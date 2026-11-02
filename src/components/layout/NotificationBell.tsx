import { useState } from 'react'
import { Bell, CheckCircle2, Send, SquarePlus, type LucideIcon } from 'lucide-react'
import { useNotificacoes } from '@/hooks/useNotificacoes'
import type { TipoNotificacao } from '@/models/notificacao'
import { tempoRelativo } from '@/utils/format'

const ICONES: Record<TipoNotificacao, LucideIcon> = {
  criada: SquarePlus,
  encaminhada: Send,
  concluida: CheckCircle2,
}

export function NotificationBell() {
  const { notificacoes, naoLidas, marcarTodasLidas } = useNotificacoes()
  const [aberto, setAberto] = useState(false)

  return (
    <div className="relative">
      <button
        aria-label={naoLidas > 0 ? `Notificações (${naoLidas} não lidas)` : 'Notificações'}
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
        className="relative rounded-lg p-2 text-brand-900 hover:bg-brand-50"
      >
        <Bell size={20} />
        {naoLidas > 0 && (
          <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-sos-500 px-1 text-[10px] font-bold leading-4 text-white">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <>
          <button aria-label="Fechar notificações" className="fixed inset-0 z-20 cursor-default" onClick={() => setAberto(false)} />
          <div className="fixed inset-x-3 top-16 z-30 overflow-hidden rounded-2xl border border-line bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="text-sm font-bold text-brand-900">Notificações</h2>
              {naoLidas > 0 && (
                <button onClick={() => void marcarTodasLidas()} className="text-xs font-semibold text-brand-500 hover:underline">
                  Marcar todas como lidas
                </button>
              )}
            </div>
            <ul className="max-h-[60vh] divide-y divide-line overflow-y-auto">
              {notificacoes.map((n) => {
                const Icone = ICONES[n.tipo]
                return (
                  <li key={n.id} className={`flex gap-3 px-4 py-3 ${n.lida ? '' : 'bg-brand-50/60'}`}>
                    <span
                      className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${
                        n.tipo === 'concluida' ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-50 text-brand-500'
                      }`}
                    >
                      <Icone size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand-900">{n.titulo}</p>
                      <p className="break-words text-xs text-ink">{n.mensagem}</p>
                      <p className="mt-0.5 text-[11px] text-muted">{tempoRelativo(n.criadaEm)}</p>
                    </div>
                    {!n.lida && <span aria-label="Não lida" className="mt-2 size-2 shrink-0 rounded-full bg-sos-500" />}
                  </li>
                )
              })}
              {notificacoes.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-muted">Nenhuma notificação por enquanto.</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
