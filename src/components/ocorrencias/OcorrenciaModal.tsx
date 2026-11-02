import { useEffect, useState, type ReactNode } from 'react'
import { BellRing, FileText, MapPin, ShieldAlert, Wrench, X, type LucideIcon } from 'lucide-react'
import { Timeline } from '@/components/ocorrencias/Timeline'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { TIPO_LABEL, type Ocorrencia, type TipoOcorrencia } from '@/models/ocorrencia'
import type { Usuario } from '@/models/usuario'
import { dataHora } from '@/utils/format'

const ICONES: Record<TipoOcorrencia, LucideIcon> = {
  manutencao: Wrench,
  denuncia: ShieldAlert,
  sos: BellRing,
}

interface OcorrenciaModalProps {
  ocorrencia: Ocorrencia
  onClose: () => void
  acao?: { label: string; onClick: (destinoId?: string) => void }
  destinos?: Pick<Usuario, 'id' | 'nome'>[]
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-brand-900">{children}</dd>
    </div>
  )
}

export function OcorrenciaModal({ ocorrencia: o, onClose, acao, destinos }: OcorrenciaModalProps) {
  const [destinoId, setDestinoId] = useState<string>('')
  const destino = destinoId || destinos?.[0]?.id
  const sos = o.tipo === 'sos'
  const Icone = ICONES[o.tipo]

  useEffect(() => {
    const aoTecla = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', aoTecla)
    return () => document.removeEventListener('keydown', aoTecla)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-black/50 p-0 sm:place-items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes da ocorrência ${o.protocolo}`}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-xl sm:rounded-3xl ${
          sos ? 'sm:max-w-2xl' : 'sm:max-w-lg'
        }`}
      >
        <header className={`flex items-start gap-3 p-5 ${sos ? 'bg-sos-500 text-white' : 'border-b border-line'}`}>
          <span
            className={`grid shrink-0 place-items-center rounded-xl ${
              sos ? 'size-12 bg-white text-sos-500' : 'size-10 bg-brand-50 text-brand-500'
            }`}
          >
            <Icone size={sos ? 24 : 20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-xs ${sos ? 'text-white/90' : 'text-muted'}`}>
              {TIPO_LABEL[o.tipo]} · {o.protocolo}
            </p>
            <h2 className={`font-bold leading-tight ${sos ? 'text-xl' : 'text-base text-brand-900'}`}>{o.titulo}</h2>
          </div>
          <button
            aria-label="Fechar"
            onClick={onClose}
            className={`rounded-lg p-1.5 ${sos ? 'hover:bg-white/20' : 'text-muted hover:bg-brand-50'}`}
          >
            <X size={20} />
          </button>
        </header>

        <div className="space-y-5 p-5">
          <dl className={`grid gap-4 ${sos ? 'sm:grid-cols-2' : 'grid-cols-2'}`}>
            <Campo label="Status">
              <StatusBadge status={o.status} />
            </Campo>
            <Campo label="Registrado em">{dataHora(o.criadoEm)}</Campo>
            <Campo label="Solicitante">{o.solicitante}</Campo>
            <Campo label="Local">
              <span className="inline-flex items-start gap-1">
                <MapPin size={14} className="mt-0.5 shrink-0 text-brand-500" />
                {o.local}
              </span>
            </Campo>
          </dl>

          {o.descricao && (
            <section>
              <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Descrição</h3>
              <p className="whitespace-pre-wrap text-sm text-ink">{o.descricao}</p>
            </section>
          )}

          {o.anexos && o.anexos.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Anexos ({o.anexos.length})
              </h3>
              <ul className="grid grid-cols-2 gap-3">
                {o.anexos.map((a, i) => (
                  <li key={`${a.nome}-${i}`} className="overflow-hidden rounded-xl border border-line">
                    {a.url && a.tipo?.startsWith('image/') ? (
                      <a href={a.url} target="_blank" rel="noreferrer">
                        <img src={a.url} alt={a.nome} className="h-36 w-full object-cover" />
                      </a>
                    ) : (
                      <div className="grid h-36 place-items-center gap-1 px-3 text-center text-xs text-muted">
                        <FileText size={24} className="mx-auto" />
                        {a.url ? (
                          <a href={a.url} target="_blank" rel="noreferrer" className="break-all font-semibold text-brand-500">
                            {a.nome}
                          </a>
                        ) : (
                          <span className="break-all">{a.nome} (pré-visualização indisponível)</span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted">Andamento</h3>
            <Timeline ocorrencia={o} />
          </section>

          {acao && destinos && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-brand-900">Encaminhar para</span>
              <select
                value={destino ?? ''}
                onChange={(e) => setDestinoId(e.target.value)}
                className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-brand-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                {destinos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>
            </label>
          )}

          {acao && (
            <button
              onClick={() => acao.onClick(destino)}
              disabled={!!destinos && !destino}
              className={`h-12 w-full rounded-xl text-sm font-semibold text-white disabled:opacity-50 ${
                sos ? 'bg-sos-500 hover:bg-sos-700' : 'bg-brand-900 hover:bg-brand-700'
              }`}
            >
              {acao.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
