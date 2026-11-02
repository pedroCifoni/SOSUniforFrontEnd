import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { UsuarioFormModal } from '@/components/usuarios/UsuarioFormModal'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { PERFIL_LABEL, type DadosUsuario, type Perfil, type Usuario } from '@/models/usuario'
import { usuarioService } from '@/services/usuarioService'
import { iniciais } from '@/utils/format'

interface Rascunho extends Usuario {
  novo?: boolean
  senha?: string
}

type Formulario = { tipo: 'novo' } | { tipo: 'editar'; usuario: Rascunho }

const novoId = () => `novo-${crypto.randomUUID()}`

export function UsuariosPage() {
  const { usuario: eu } = useAuth()
  const toast = useToast()
  const [salvos, setSalvos] = useState<Usuario[] | null>(null)
  const [rascunho, setRascunho] = useState<Rascunho[]>([])
  const [formulario, setFormulario] = useState<Formulario | null>(null)
  const [paraExcluir, setParaExcluir] = useState<Rascunho | null>(null)
  const [salvando, setSalvando] = useState(false)

  const carregar = useCallback(async () => {
    const lista = await usuarioService.listar()
    setSalvos(lista)
    setRascunho(lista)
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  const mudancas = useMemo(() => {
    const base = new Map((salvos ?? []).map((u) => [u.id, u]))
    const criados = rascunho.filter((r) => r.novo)
    const editados = rascunho.filter((r) => {
      const original = base.get(r.id)
      return (
        !r.novo &&
        original &&
        (original.nome !== r.nome || original.email !== r.email || original.perfil !== r.perfil || !!r.senha)
      )
    })
    const mantidos = new Set(rascunho.map((r) => r.id))
    const excluidos = (salvos ?? []).filter((u) => !mantidos.has(u.id))
    return { criados, editados, excluidos, total: criados.length + editados.length + excluidos.length }
  }, [salvos, rascunho])

  function alterar(id: string, dados: Partial<Rascunho>) {
    setRascunho((atual) => atual.map((r) => (r.id === id ? { ...r, ...dados } : r)))
  }

  function aplicarFormulario(dados: DadosUsuario) {
    const nome = dados.nome.trim()
    const email = dados.email.trim().toLowerCase()
    const editando = formulario?.tipo === 'editar' ? formulario.usuario : null

    if (!nome) throw new Error('Informe o nome.')
    if (!email.includes('@')) throw new Error('Informe um e-mail válido.')
    if (rascunho.some((r) => r.email === email && r.id !== editando?.id)) {
      throw new Error('Já existe um usuário com este e-mail.')
    }
    if (!editando && (!dados.senha || dados.senha.length < 6)) {
      throw new Error('A senha deve ter ao menos 6 caracteres.')
    }
    if (dados.senha && dados.senha.length < 6) throw new Error('A senha deve ter ao menos 6 caracteres.')

    if (editando) {
      alterar(editando.id, { nome, email, perfil: dados.perfil, ...(dados.senha && { senha: dados.senha }) })
    } else {
      setRascunho((atual) => [...atual, { id: novoId(), nome, email, perfil: dados.perfil, senha: dados.senha, novo: true }])
    }
    setFormulario(null)
  }

  async function salvar() {
    setSalvando(true)
    try {
      for (const c of mudancas.criados) {
        await usuarioService.criar({ nome: c.nome, email: c.email, perfil: c.perfil, senha: c.senha })
      }
      for (const e of mudancas.editados) {
        await usuarioService.atualizar(e.id, { nome: e.nome, email: e.email, perfil: e.perfil, senha: e.senha })
      }
      for (const x of mudancas.excluidos) {
        await usuarioService.excluir(x.id)
      }
      toast.sucesso(mudancas.total === 1 ? 'Alteração salva.' : `${mudancas.total} alterações salvas.`)
    } catch (err) {
      toast.erro(
        `${err instanceof Error ? err.message : 'Não foi possível salvar.'} As alterações anteriores a este erro já foram salvas.`,
      )
    } finally {
      await carregar()
      setSalvando(false)
    }
  }

  function descartar() {
    setRascunho(salvos ?? [])
    toast.info('Alterações descartadas.')
  }

  const ordenados = [...rascunho].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{salvos ? `${rascunho.length} usuários` : 'Carregando…'}</p>
        <button
          onClick={() => setFormulario({ tipo: 'novo' })}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-900 px-4 text-xs font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={16} /> Novo usuário
        </button>
      </div>

      <ul className="space-y-3">
        {ordenados.map((u) => {
          const proprio = u.id === eu?.id
          const original = salvos?.find((s) => s.id === u.id)
          const alterado = u.novo || mudancas.editados.some((e) => e.id === u.id)
          return (
            <li
              key={u.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm ${alterado ? 'border-amber-400' : 'border-line'}`}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-900 text-xs font-semibold text-white">
                  {iniciais(u.nome)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-900">
                    {u.nome} {proprio && <span className="text-[11px] font-medium text-muted">(você)</span>}
                    {alterado && (
                      <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                        {u.novo ? 'NOVO' : 'ALTERADO'}
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted">{u.email}</p>
                </div>
                <button
                  aria-label={`Editar ${u.nome}`}
                  onClick={() => setFormulario({ tipo: 'editar', usuario: u })}
                  className="rounded-lg p-2 text-brand-500 hover:bg-brand-50"
                >
                  <Pencil size={18} />
                </button>
                <button
                  aria-label={`Excluir ${u.nome}`}
                  disabled={proprio}
                  title={proprio ? 'Você não pode excluir a si mesmo' : undefined}
                  onClick={() => setParaExcluir(u)}
                  className="rounded-lg p-2 text-sos-700 hover:bg-sos-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <label htmlFor={`perfil-${u.id}`} className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Perfil
                </label>
                <select
                  id={`perfil-${u.id}`}
                  value={u.perfil}
                  disabled={proprio}
                  title={proprio ? 'Você não pode alterar o seu próprio perfil' : undefined}
                  onChange={(e) => alterar(u.id, { perfil: e.target.value as Perfil })}
                  className="h-9 flex-1 rounded-lg border border-line bg-surface px-2 text-sm text-brand-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
                >
                  {(Object.keys(PERFIL_LABEL) as Perfil[]).map((p) => (
                    <option key={p} value={p}>
                      {PERFIL_LABEL[p]}
                    </option>
                  ))}
                </select>
                {original && original.perfil !== u.perfil && (
                  <span className="text-[11px] text-muted">era {PERFIL_LABEL[original.perfil]}</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {mudancas.total > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <p className="hidden flex-1 text-xs text-muted sm:block">
              {mudancas.total} {mudancas.total === 1 ? 'alteração pendente' : 'alterações pendentes'}
              {mudancas.excluidos.length > 0 && ` · ${mudancas.excluidos.length} para excluir`}
            </p>
            <button
              onClick={descartar}
              disabled={salvando}
              className="h-11 flex-1 rounded-xl bg-brand-50 text-sm font-semibold text-brand-900 hover:bg-brand-100 disabled:opacity-60 sm:flex-none sm:px-5"
            >
              Descartar
            </button>
            <button
              onClick={() => void salvar()}
              disabled={salvando}
              className="h-11 flex-[2] rounded-xl bg-brand-900 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:flex-none sm:px-6"
            >
              {salvando ? 'Salvando…' : `Salvar alterações (${mudancas.total})`}
            </button>
          </div>
        </div>
      )}

      {formulario && (
        <UsuarioFormModal
          usuario={formulario.tipo === 'editar' ? formulario.usuario : undefined}
          perfilTravado={formulario.tipo === 'editar' && formulario.usuario.id === eu?.id}
          onClose={() => setFormulario(null)}
          onSubmit={async (dados) => aplicarFormulario(dados)}
        />
      )}

      {paraExcluir && (
        <ConfirmModal
          titulo="Excluir usuário?"
          confirmarLabel="Sim, excluir"
          onCancel={() => setParaExcluir(null)}
          onConfirm={() => {
            const alvo = paraExcluir
            setParaExcluir(null)
            setRascunho((atual) => atual.filter((r) => r.id !== alvo.id))
          }}
        >
          Tem certeza que deseja excluir <strong className="text-brand-900">{paraExcluir.nome}</strong>? A exclusão só é
          definitiva depois de clicar em “Salvar alterações”.
        </ConfirmModal>
      )}
    </div>
  )
}
