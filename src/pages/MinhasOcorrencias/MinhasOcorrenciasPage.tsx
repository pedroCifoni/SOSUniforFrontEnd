import { useEffect, useMemo, useState } from 'react'
import { BellRing, ChevronRight, ShieldAlert, Wrench, type LucideIcon } from 'lucide-react'
import { OcorrenciaModal } from '@/components/ocorrencias/OcorrenciaModal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import type { Ocorrencia, TipoOcorrencia } from '@/models/ocorrencia'
import { ocorrenciaService } from '@/services/ocorrenciaService'

type Aba = 'todas' | 'abertas' | 'concluidas'

const ABAS: { id: Aba; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'abertas', label: 'Abertas' },
  { id: 'concluidas', label: 'Concluídas' },
]

const ICONES: Record<TipoOcorrencia, LucideIcon> = {
  manutencao: Wrench,
  denuncia: ShieldAlert,
  sos: BellRing,
}

export function MinhasOcorrenciasPage() {
  const { usuario } = useAuth()
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[] | null>(null)
  const [aba, setAba] = useState<Aba>('todas')
  const [selecionada, setSelecionada] = useState<Ocorrencia | null>(null)

  useEffect(() => {
    if (!usuario) return
    let ativo = true
    ocorrenciaService.listarPorAutor(usuario.id).then((lista) => {
      if (!ativo) return
      setOcorrencias(lista)
    })
    return () => {
      ativo = false
    }
  }, [usuario])

  const visiveis = useMemo(() => {
    const lista = ocorrencias ?? []
    if (aba === 'abertas') return lista.filter((o) => o.status !== 'concluido')
    if (aba === 'concluidas') return lista.filter((o) => o.status === 'concluido')
    return lista
  }, [ocorrencias, aba])

  return (
    <div className="mx-auto max-w-2xl">
      <div role="tablist" className="mb-5 grid grid-cols-3 border-b border-line">
        {ABAS.map((a) => (
          <button
            key={a.id}
            role="tab"
            aria-selected={aba === a.id}
            onClick={() => setAba(a.id)}
            className={`-mb-px border-b-2 py-3 text-sm font-semibold transition ${
              aba === a.id ? 'border-brand-500 text-brand-500' : 'border-transparent text-muted hover:text-brand-900'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {ocorrencias === null ? (
        <p className="py-12 text-center text-sm text-muted">Carregando ocorrências…</p>
      ) : visiveis.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">Nenhuma ocorrência nesta aba.</p>
      ) : (
        <ul className="space-y-3">
          {visiveis.map((o) => {
            const Icone = ICONES[o.tipo]
            return (
              <li key={o.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
                <button
                  onClick={() => setSelecionada(o)}
                  aria-haspopup="dialog"
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-500">
                    <Icone size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] text-muted">{o.protocolo}</span>
                    <span className="block truncate text-sm font-semibold text-brand-900">{o.titulo}</span>
                  </span>
                  <StatusBadge status={o.status} />
                  <ChevronRight size={16} className="mt-1 shrink-0 text-muted" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {selecionada && <OcorrenciaModal ocorrencia={selecionada} onClose={() => setSelecionada(null)} />}
    </div>
  )
}
