import { useCallback, useEffect, useState } from 'react'
import { OcorrenciaModal } from '@/components/ocorrencias/OcorrenciaModal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { TIPO_LABEL, type Ocorrencia } from '@/models/ocorrencia'
import { ocorrenciaService } from '@/services/ocorrenciaService'
import { tempoRelativo } from '@/utils/format'

export function SegurancaHomePage() {
  const { usuario } = useAuth()
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[] | null>(null)
  const [selecionada, setSelecionada] = useState<Ocorrencia | null>(null)

  const carregar = useCallback(async () => {
    if (usuario) setOcorrencias(await ocorrenciaService.listarPorResponsavel(usuario.id))
  }, [usuario])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar()
  }, [carregar])

  async function concluir(id: string) {
    await ocorrenciaService.atualizarStatus(id, 'concluido')
    setSelecionada(null)
    void carregar()
  }

  const lista = ocorrencias ?? []
  const aAtender = lista
    .filter((o) => o.status !== 'concluido')
    .sort((a, b) => Number(b.tipo === 'sos') - Number(a.tipo === 'sos'))
  const concluidas = lista.filter((o) => o.status === 'concluido')

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-brand-900">Olá, {usuario?.nome.split(' ')[0]}</h2>
        <p className="text-sm text-muted">Ocorrências encaminhadas para você.</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-sos-500 bg-white p-4 text-sos-500">
          <p className="text-[10px] font-bold tracking-wide">A ATENDER</p>
          <p className="text-3xl font-bold">{String(aAtender.length).padStart(2, '0')}</p>
        </div>
        <div className="rounded-2xl border-2 border-brand-900 bg-white p-4 text-brand-900">
          <p className="text-[10px] font-bold tracking-wide">CONCLUÍDAS</p>
          <p className="text-3xl font-bold">{String(concluidas.length).padStart(2, '0')}</p>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-bold text-brand-900">Encaminhadas para você</h3>
        {ocorrencias === null ? (
          <p className="py-8 text-center text-sm text-muted">Carregando ocorrências…</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {aAtender.map((o) => {
              const sos = o.tipo === 'sos'
              return (
                <li key={o.id}>
                  <button
                    onClick={() => setSelecionada(o)}
                    aria-haspopup="dialog"
                    className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow ${
                      sos ? 'border-sos-500' : 'border-line hover:border-brand-500'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          sos ? 'bg-sos-50 text-sos-700' : 'bg-brand-50 text-brand-500'
                        }`}
                      >
                        {TIPO_LABEL[o.tipo].toUpperCase()}
                      </span>
                      <span className={`text-xs ${sos ? 'font-semibold text-sos-500' : 'text-muted'}`}>
                        {tempoRelativo(o.criadoEm)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-brand-900">{o.titulo}</p>
                    <p className="text-xs text-muted">
                      {o.solicitante} · {o.local}
                    </p>
                  </button>
                </li>
              )
            })}
            {aAtender.length === 0 && (
              <li className="text-sm text-muted">Nenhuma ocorrência encaminhada para você no momento.</li>
            )}
          </ul>
        )}
      </section>

      {concluidas.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-bold text-brand-900">Concluídas</h3>
          <ul className="space-y-3">
            {concluidas.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => setSelecionada(o)}
                  aria-haspopup="dialog"
                  className="flex w-full items-start justify-between gap-2 rounded-2xl border border-line bg-white p-4 text-left shadow-sm transition hover:border-brand-500"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted">{o.protocolo}</p>
                    <p className="truncate text-sm font-semibold text-brand-900">{o.titulo}</p>
                    <p className="truncate text-xs text-muted">{o.local}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {selecionada && (
        <OcorrenciaModal
          ocorrencia={selecionada}
          onClose={() => setSelecionada(null)}
          acao={
            selecionada.status === 'concluido'
              ? undefined
              : { label: 'Concluir atendimento', onClick: () => void concluir(selecionada.id) }
          }
        />
      )}
    </div>
  )
}
