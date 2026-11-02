import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BellRing, MapPin, Navigation, Phone, ShieldCheck } from 'lucide-react'
import type { Ocorrencia } from '@/models/ocorrencia'
import type { Seguranca } from '@/models/seguranca'
import { ocorrenciaService } from '@/services/ocorrenciaService'
import { segurancaService } from '@/services/segurancaService'
import { iniciais } from '@/utils/format'

export function SosPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null)
  const [segurancas, setSegurancas] = useState<Seguranca[]>([])
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    let ativo = true
    ocorrenciaService
      .buscarPorId(id)
      .then((o) => ativo && setOcorrencia(o))
      .catch(() => ativo && navigate('/', { replace: true }))
    segurancaService.listarNotificados().then((s) => ativo && setSegurancas(s))
    return () => {
      ativo = false
    }
  }, [id, navigate])

  // Simula os seguranças confirmando deslocamento, um após o outro.
  useEffect(() => {
    if (segurancas.length === 0) return
    const timers = segurancas.map((s, i) =>
      setTimeout(
        () => setSegurancas((atual) => atual.map((x) => (x.id === s.id ? { ...x, status: 'a_caminho' } : x))),
        2500 + i * 2500,
      ),
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segurancas.length])

  async function cancelar() {
    if (!ocorrencia) return
    await ocorrenciaService.atualizarStatus(ocorrencia.id, 'concluido')
    navigate('/', { replace: true })
  }

  if (!ocorrencia) {
    return <p className="py-16 text-center text-sm text-muted">Carregando alerta…</p>
  }

  return (
    <div className="space-y-5">
      <section className="flex items-center gap-4 rounded-2xl bg-sos-500 p-4 text-white">
        <span className="relative grid size-12 shrink-0 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
          <span className="relative grid size-12 place-items-center rounded-full bg-white text-sos-500">
            <BellRing size={22} />
          </span>
        </span>
        <div>
          <p className="text-lg font-bold leading-tight">SOS acionado</p>
          <p className="text-xs text-white/90">
            Protocolo {ocorrencia.protocolo} · a segurança foi alertada
          </p>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <h2 className="px-4 pt-4 text-sm font-bold text-brand-900">Local da ocorrência</h2>
          <div className="relative m-4 h-44 overflow-hidden rounded-xl bg-brand-50">
            <svg className="absolute inset-0 size-full text-brand-100" aria-hidden>
              <defs>
                <pattern id="grade" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grade)" />
            </svg>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute -inset-3 animate-ping rounded-full bg-sos-500/40" />
              <MapPin size={34} className="relative fill-sos-500 text-white" />
            </span>
          </div>
          <div className="flex items-start gap-2 px-4 pb-4">
            <Navigation size={16} className="mt-0.5 shrink-0 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-brand-900">{ocorrencia.local}</p>
              <p className="text-xs text-muted">Localização compartilhada com a equipe em tempo real</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-900">Seguranças notificados</h2>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-500">
              {segurancas.length}
            </span>
          </div>
          <ul className="space-y-3">
            {segurancas.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-900 text-xs font-semibold text-white">
                  {iniciais(s.nome)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-900">{s.nome}</p>
                  <p className="truncate text-xs text-muted">
                    {s.viatura} · {s.distanciaM} m
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                    s.status === 'a_caminho' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {s.status === 'a_caminho' && <ShieldCheck size={12} />}
                  {s.status === 'a_caminho' ? 'A caminho' : 'Notificado'}
                </span>
              </li>
            ))}
            {segurancas.length === 0 && <li className="text-sm text-muted">Notificando seguranças…</li>}
          </ul>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href="tel:+558534773000"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Phone size={18} /> Ligar para a Segurança
        </a>
        {confirmando ? (
          <div className="flex gap-2">
            <button
              onClick={cancelar}
              className="h-12 flex-1 rounded-xl bg-sos-500 text-sm font-semibold text-white hover:bg-sos-700"
            >
              Confirmar cancelamento
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className="h-12 flex-1 rounded-xl bg-brand-50 text-sm font-semibold text-brand-900 hover:bg-brand-100"
            >
              Voltar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="h-12 rounded-xl border border-line text-sm font-semibold text-sos-700 hover:bg-sos-50"
          >
            Cancelar SOS (alarme falso)
          </button>
        )}
      </div>
    </div>
  )
}
