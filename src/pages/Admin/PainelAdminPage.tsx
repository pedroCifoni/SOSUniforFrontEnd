import { useCallback, useEffect, useState } from 'react'
import { TIPO_LABEL, type Ocorrencia } from '@/models/ocorrencia'
import { ocorrenciaService } from '@/services/ocorrenciaService'
import { tempoRelativo } from '@/utils/format'

export function PainelAdminPage() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])

  const carregar = useCallback(async () => {
    setOcorrencias(await ocorrenciaService.listar())
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar()
  }, [carregar])

  async function encaminhar(id: string) {
    await ocorrenciaService.atualizarStatus(id, 'em_andamento')
    void carregar()
  }

  const pendentes = ocorrencias.filter((o) => o.status === 'pendente')
  const sosAtivos = pendentes.filter((o) => o.tipo === 'sos').length
  const denuncias = ocorrencias.filter((o) => o.tipo === 'denuncia').length

  const fila = [...pendentes].sort((a, b) => Number(b.tipo === 'sos') - Number(a.tipo === 'sos'))

  const cards = [
    { label: 'SOS ATIVOS', valor: sosAtivos, cor: 'border-sos-500 text-sos-500' },
    { label: 'PENDENTES', valor: pendentes.length, cor: 'border-brand-500 text-brand-500' },
    { label: 'DENÚNCIAS', valor: denuncias, cor: 'border-brand-900 text-brand-900' },
  ]

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl border-2 bg-white p-3 sm:p-4 ${c.cor}`}>
            <p className="text-[10px] font-bold tracking-wide">{c.label}</p>
            <p className="text-3xl font-bold">{String(c.valor).padStart(2, '0')}</p>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-bold text-brand-900">Fila Prioritária</h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {fila.map((o) => {
            const sos = o.tipo === 'sos'
            return (
              <li
                key={o.id}
                className={`rounded-2xl border bg-white p-4 shadow-sm ${sos ? 'border-sos-500' : 'border-line'}`}
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
                <p className="mb-3 text-xs text-muted">
                  {o.solicitante} · {o.local}
                </p>
                <button
                  onClick={() => encaminhar(o.id)}
                  className={`h-10 w-full rounded-xl text-xs font-semibold transition ${
                    sos
                      ? 'bg-brand-900 text-white hover:bg-brand-700'
                      : 'bg-brand-50 text-brand-500 hover:bg-brand-100'
                  }`}
                >
                  {sos ? 'Encaminhar Patrulha' : o.tipo === 'manutencao' ? 'Encaminhar Técnico' : 'Analisar'}
                </button>
              </li>
            )
          })}
          {fila.length === 0 && <li className="text-sm text-muted">Fila vazia. Nenhuma ocorrência pendente.</li>}
        </ul>
      </section>
    </div>
  )
}
