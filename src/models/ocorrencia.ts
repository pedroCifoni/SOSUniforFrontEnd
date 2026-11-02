export type TipoOcorrencia = 'sos' | 'manutencao' | 'denuncia'

export type StatusOcorrencia = 'pendente' | 'em_andamento' | 'concluido'

export interface Ocorrencia {
  id: string
  protocolo: string
  titulo: string
  descricao?: string
  local: string
  tipo: TipoOcorrencia
  status: StatusOcorrencia
  solicitante: string
  /** Autor real, mantido mesmo em denúncias anônimas (nunca exibido na UI). */
  autorId: string
  anonima?: boolean
  anexos?: string[]
  criadoEm: string
}

export interface NovaOcorrencia {
  titulo: string
  descricao?: string
  local: string
  tipo: TipoOcorrencia
  anonima?: boolean
  anexos?: string[]
}

export const STATUS_LABEL: Record<StatusOcorrencia, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
}

export const TIPO_LABEL: Record<TipoOcorrencia, string> = {
  sos: 'Alerta SOS',
  manutencao: 'Manutenção',
  denuncia: 'Denúncia',
}
