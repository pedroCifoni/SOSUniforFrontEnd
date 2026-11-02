import { useEffect, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  titulo: string
  children: ReactNode
  confirmarLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ titulo, children, confirmarLabel, onConfirm, onCancel }: ConfirmModalProps) {
  useEffect(() => {
    const aoTecla = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', aoTecla)
    return () => document.removeEventListener('keydown', aoTecla)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-6 text-center shadow-xl"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-sos-50 text-sos-500">
          <AlertTriangle size={24} />
        </span>
        <div>
          <h2 className="text-base font-bold text-brand-900">{titulo}</h2>
          <p className="mt-1 text-sm text-muted">{children}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl bg-brand-50 text-sm font-semibold text-brand-900 hover:bg-brand-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="h-11 flex-1 rounded-xl bg-sos-500 text-sm font-semibold text-white hover:bg-sos-700"
          >
            {confirmarLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
