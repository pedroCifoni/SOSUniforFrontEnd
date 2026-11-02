import { useEffect, useState, type FormEvent } from 'react'
import { Lock, Mail, User as UserIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PERFIL_LABEL, type DadosUsuario, type Perfil, type Usuario } from '@/models/usuario'

interface UsuarioFormModalProps {
  usuario?: Usuario
  perfilTravado?: boolean
  onClose: () => void
  onSubmit: (dados: DadosUsuario) => Promise<void>
}

export function UsuarioFormModal({ usuario, perfilTravado, onClose, onSubmit }: UsuarioFormModalProps) {
  const [nome, setNome] = useState(usuario?.nome ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [perfil, setPerfil] = useState<Perfil>(usuario?.perfil ?? 'usuario')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    const aoTecla = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', aoTecla)
    return () => document.removeEventListener('keydown', aoTecla)
  }, [onClose])

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setSalvando(true)
    try {
      await onSubmit({ nome, email, perfil, senha })
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar.')
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-black/50 sm:place-items-center sm:p-4" onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-label={usuario ? 'Editar usuário' : 'Novo usuário'}
        onClick={(e) => e.stopPropagation()}
        onSubmit={enviar}
        noValidate
        className="max-h-[92vh] w-full space-y-4 overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:max-w-md sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-900">{usuario ? 'Editar usuário' : 'Novo usuário'}</h2>
          <button type="button" aria-label="Fechar" onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-brand-50">
            <X size={20} />
          </button>
        </div>

        <Input label="Nome" icon={<UserIcon size={18} />} value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Input
          label="E-mail institucional"
          type="email"
          icon={<Mail size={18} />}
          placeholder="nome.sobrenome@unifor.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label={usuario ? 'Nova senha (opcional)' : 'Senha'}
          type="password"
          autoComplete="new-password"
          icon={<Lock size={18} />}
          placeholder={usuario ? 'Deixe em branco para manter' : 'Mínimo de 6 caracteres'}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <fieldset disabled={perfilTravado}>
          <legend className="mb-1.5 text-xs font-semibold text-brand-900">Perfil</legend>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PERFIL_LABEL) as Perfil[]).map((p) => (
              <label
                key={p}
                className={`cursor-pointer rounded-xl border px-2 py-2.5 text-center text-xs font-semibold transition has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 ${
                  perfil === p ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-line text-brand-900 hover:bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name="perfil"
                  value={p}
                  checked={perfil === p}
                  onChange={() => setPerfil(p)}
                  className="sr-only"
                />
                {PERFIL_LABEL[p]}
              </label>
            ))}
          </div>
          {perfilTravado && <p className="mt-1 text-[11px] text-muted">Você não pode alterar o seu próprio perfil.</p>}
        </fieldset>

        {erro && (
          <p role="alert" className="rounded-lg bg-sos-50 px-3 py-2 text-sm text-sos-700">
            {erro}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={salvando} disabled={!nome || !email || (!usuario && !senha)}>
            {usuario ? 'Aplicar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
