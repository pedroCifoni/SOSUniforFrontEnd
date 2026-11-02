import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, LayoutDashboard, ShieldAlert, Wrench } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { useHoldPress } from '@/hooks/useHoldPress'
import type { Ocorrencia } from '@/models/ocorrencia'
import { ocorrenciaService } from '@/services/ocorrenciaService'

const atalhos = [
  { to: '/novo-chamado', label: 'Manutenção', icon: Wrench },
  { to: '/nova-denuncia', label: 'Denúncia', icon: ShieldAlert },
  { to: '/minhas-ocorrencias', label: 'Acompanhar', icon: ClipboardList },
]

export function HomePage() {
  const { usuario } = useAuth()
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const navigate = useNavigate()

  const carregar = useCallback(async () => {
    if (usuario) setOcorrencias(await ocorrenciaService.listarPorAutor(usuario.id))
  }, [usuario])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar()
  }, [carregar])

  const acionarSos = useCallback(async () => {
    if (!usuario) return
    const sos = await ocorrenciaService.criar(
      { titulo: 'Acionamento de Emergência', local: 'Bloco D · Próx. Entrada principal', tipo: 'sos' },
      usuario,
    )
    navigate(`/sos/${sos.id}`)
  }, [usuario, navigate])

  const { progresso, iniciar, cancelar } = useHoldPress(acionarSos, 2000)

  const minhas = ocorrencias.filter((o) => o.tipo !== 'sos').slice(0, 3)

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-brand-900">Olá, {usuario?.nome.split(' ')[0]}</h2>
        <p className="text-sm text-muted">Precisa de ajuda imediata no campus?</p>
      </section>

      <section className="flex flex-col items-center gap-3 py-2">
        <button
          onPointerDown={iniciar}
          onPointerUp={cancelar}
          onPointerLeave={cancelar}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="Segure por 2 segundos para acionar a segurança"
          className="relative grid size-44 touch-none select-none place-items-center rounded-full bg-sos-500 text-white shadow-[0_0_0_14px_rgba(225,29,46,0.12),0_0_0_28px_rgba(225,29,46,0.06)] transition active:scale-95"
          style={{ background: `conic-gradient(var(--color-sos-700) ${progresso * 360}deg, var(--color-sos-500) 0)` }}
        >
          <span className="grid size-[10.5rem] place-items-center rounded-full bg-sos-500">
            <span className="text-center">
              <span className="block text-4xl font-bold leading-none">SOS</span>
              <span className="mt-1 block text-[10px] font-semibold tracking-widest">EMERGÊNCIA</span>
            </span>
          </span>
        </button>
        <p className="text-xs font-semibold text-sos-500">Pressione por 2 segundos para acionar a segurança</p>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {atalhos.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 text-xs font-semibold text-brand-900 shadow-sm transition hover:border-brand-500 hover:shadow"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-500">
              <Icon size={20} />
            </span>
            {label}
          </Link>
        ))}
      </section>

      {usuario?.perfil === 'admin' && (
        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-2xl bg-brand-900 p-4 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <LayoutDashboard size={20} /> Abrir Painel de Monitoramento
        </Link>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-brand-900">Últimas Ocorrências</h3>
          <Link to="/minhas-ocorrencias" className="text-xs font-semibold text-brand-500">
            Ver todas
          </Link>
        </div>
        <ul className="space-y-3">
          {minhas.map((o) => (
            <li key={o.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] text-muted">{o.protocolo}</p>
                  <p className="truncate text-sm font-semibold text-brand-900">{o.titulo}</p>
                  <p className="truncate text-xs text-muted">{o.local}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            </li>
          ))}
          {minhas.length === 0 && <li className="text-sm text-muted">Nenhuma ocorrência ainda.</li>}
        </ul>
      </section>
    </div>
  )
}
