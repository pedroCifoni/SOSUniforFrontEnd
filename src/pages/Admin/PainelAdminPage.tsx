import { useCallback, useEffect, useState } from 'react'
import { OcorrenciaModal } from '@/components/ocorrencias/OcorrenciaModal'
import { ENCAMINHAR_LABEL, TIPO_LABEL, type Ocorrencia } from '@/models/ocorrencia'
import type { Usuario } from '@/models/usuario'
import { ocorrenciaService } from '@/services/ocorrenciaService'
import { usuarioService } from '@/services/usuarioService'
import { tempoRelativo } from '@/utils/format'

export function PainelAdminPage() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [selecionada, setSelecionada] = useState<Ocorrencia | null>(null)
  const [segurancas, setSegurancas] = useState<Usuario[]>([])

  const carregar = useCallback(async () => {
    setOcorrencias(await ocorrenciaService.listar())
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar()
    void usuarioService.listarSegurancas().then(setSegurancas)
  }, [carregar])

  async function encaminhar(id: string, destinoId?: string) {
    if (!destinoId) return
    await ocorrenciaService.encaminhar(id, destinoId)
    setSelecionada(null)
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
                <button
                  onClick={() => setSelecionada(o)}
                  aria-haspopup="dialog"
                  className="mb-3 block w-full text-left"
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
                <button
                  onClick={() => setSelecionada(o)}
                  className={`h-10 w-full rounded-xl text-xs font-semibold transition ${
                    sos
                      ? 'bg-brand-900 text-white hover:bg-brand-700'
                      : 'bg-brand-50 text-brand-500 hover:bg-brand-100'
                  }`}
                >
                  {ENCAMINHAR_LABEL[o.tipo]}
                </button>
              </li>
            )
          })}
          {fila.length === 0 && <li className="text-sm text-muted">Fila vazia. Nenhuma ocorrência pendente.</li>}
        </ul>
      </section>

      {selecionada && (
        <OcorrenciaModal
          ocorrencia={selecionada}
          onClose={() => setSelecionada(null)}
          destinos={selecionada.status === 'pendente' ? segurancas : undefined}
          acao={
            selecionada.status === 'pendente'
              ? { label: ENCAMINHAR_LABEL[selecionada.tipo], onClick: (destinoId) => void encaminhar(selecionada.id, destinoId) }
              : undefined
          }
        />
      )}
    </div>
  )
}
