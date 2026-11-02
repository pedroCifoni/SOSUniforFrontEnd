import { createContext } from 'react'
import type { Notificacao } from '@/models/notificacao'

export interface NotificacoesContextValue {
  notificacoes: Notificacao[]
  naoLidas: number
  revisao: number
  marcarTodasLidas: () => Promise<void>
}

export const NotificacoesContext = createContext<NotificacoesContextValue | null>(null)
