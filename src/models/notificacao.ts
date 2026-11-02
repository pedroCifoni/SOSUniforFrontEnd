export type TipoNotificacao = 'criada' | 'encaminhada' | 'concluida'

export interface Notificacao {
  id: string
  destinatarioId: string
  tipo: TipoNotificacao
  titulo: string
  mensagem: string
  ocorrenciaId: string
  criadaEm: string
  lida: boolean
}
