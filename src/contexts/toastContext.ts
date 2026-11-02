import { createContext } from 'react'

export type TipoToast = 'success' | 'error' | 'info'

export interface ToastContextValue {
  notificar: (tipo: TipoToast, mensagem: string) => void
  sucesso: (mensagem: string) => void
  erro: (mensagem: string) => void
  info: (mensagem: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
