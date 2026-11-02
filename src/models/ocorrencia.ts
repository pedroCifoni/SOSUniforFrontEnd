export interface Anexo {
  nome: string
  url?: string
  tipo?: string
}

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
  autorId: string
  anonima?: boolean
  anexos?: Anexo[]
  responsavelId?: string
  criadoEm: string
}

export interface NovaOcorrencia {
  titulo: string
  descricao?: string
  local: string
  tipo: TipoOcorrencia
  anonima?: boolean
  anexos?: Anexo[]
}

export const STATUS_LABEL: Record<StatusOcorrencia, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
}

export const ENCAMINHAR_LABEL: Record<TipoOcorrencia, string> = {
  sos: 'Encaminhar Patrulha',
  manutencao: 'Encaminhar Técnico',
  denuncia: 'Encaminhar para Análise',
}

export const TIPO_LABEL: Record<TipoOcorrencia, string> = {
  sos: 'Alerta SOS',
  manutencao: 'Manutenção',
  denuncia: 'Denúncia',
}
