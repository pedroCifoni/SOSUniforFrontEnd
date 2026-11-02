import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X, type LucideIcon } from 'lucide-react'
import { ToastContext, type TipoToast } from './toastContext'

interface Toast {
  id: number
  tipo: TipoToast
  mensagem: string
}

const DURACAO_MS: Record<TipoToast, number> = { success: 4000, info: 4000, error: 6000 }
const MAX_VISIVEIS = 4

const ESTILO: Record<TipoToast, { icone: LucideIcon; classe: string }> = {
  success: { icone: CheckCircle2, classe: 'border-emerald-200 text-emerald-700 [&_svg:first-child]:text-emerald-500' },
  error: { icone: AlertCircle, classe: 'border-sos-500/40 text-sos-700 [&_svg:first-child]:text-sos-500' },
  info: { icone: Info, classe: 'border-brand-500/30 text-brand-900 [&_svg:first-child]:text-brand-500' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const proximoId = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const remover = useCallback((id: number) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((atual) => atual.filter((t) => t.id !== id))
  }, [])

  const notificar = useCallback(
    (tipo: TipoToast, mensagem: string) => {
      const id = ++proximoId.current
      setToasts((atual) => [...atual.slice(-(MAX_VISIVEIS - 1)), { id, tipo, mensagem }])
      timers.current.set(id, setTimeout(() => remover(id), DURACAO_MS[tipo]))
    },
    [remover],
  )

  useEffect(() => {
    const ativos = timers.current
    return () => ativos.forEach(clearTimeout)
  }, [])

  const value = useMemo(
    () => ({
      notificar,
      sucesso: (m: string) => notificar('success', m),
      erro: (m: string) => notificar('error', m),
      info: (m: string) => notificar('info', m),
    }),
    [notificar],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      >
        {toasts.map((t) => {
          const { icone: Icone, classe } = ESTILO[t.tipo]
          return (
            <div
              key={t.id}
              role={t.tipo === 'error' ? 'alert' : 'status'}
              className={`toast-entrada pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-lg ${classe}`}
            >
              <Icone size={20} className="mt-0.5 shrink-0" />
              <p className="min-w-0 flex-1 break-words">{t.mensagem}</p>
              <button
                aria-label="Fechar notificação"
                onClick={() => remover(t.id)}
                className="shrink-0 rounded p-0.5 text-muted hover:text-brand-900"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
