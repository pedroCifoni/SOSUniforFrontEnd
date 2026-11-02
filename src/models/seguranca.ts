export type StatusSeguranca = 'notificado' | 'a_caminho'

export interface Seguranca {
  id: string
  nome: string
  viatura: string
  distanciaM: number
  status: StatusSeguranca
}
