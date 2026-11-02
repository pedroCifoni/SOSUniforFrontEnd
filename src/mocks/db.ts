import type { Ocorrencia } from '@/models/ocorrencia'
import type { Seguranca } from '@/models/seguranca'
import type { Usuario } from '@/models/usuario'

export const SENHA_MOCK = '123456'

export const usuariosMock: Usuario[] = [
  { id: 'u1', nome: 'Eduardo Costa', email: 'eduardo.costa@unifor.br', perfil: 'usuario' },
  { id: 'u2', nome: 'Administrador', email: 'admin@unifor.br', perfil: 'admin' },
  { id: 'u3', nome: 'Equipe Segurança', email: 'seguranca@unifor.br', perfil: 'seguranca' },
  { id: 'u4', nome: 'Carlos Mendes', email: 'carlos.mendes@unifor.br', perfil: 'seguranca' },
]

export const segurancasMock: Seguranca[] = [
  { id: 's1', nome: 'Carlos Mendes', viatura: 'Patrulha 01', distanciaM: 120, status: 'notificado' },
  { id: 's2', nome: 'Rafaela Lima', viatura: 'Patrulha 03', distanciaM: 260, status: 'notificado' },
  { id: 's3', nome: 'Jonas Albuquerque', viatura: 'Portaria Central', distanciaM: 410, status: 'notificado' },
]

export const ocorrenciasMock: Ocorrencia[] = [
  {
    id: 'o1',
    protocolo: '#2026-0045',
    titulo: 'Acionamento de Emergência',
    local: 'Bloco D · Próx. Entrada principal',
    tipo: 'sos',
    status: 'pendente',
    solicitante: 'Eduardo Costa',
    autorId: 'u1',
    criadoEm: new Date(Date.now() - 3 * 60_000).toISOString(),
  },
  {
    id: 'o2',
    protocolo: '#2026-0044',
    titulo: 'Vazamento severo de água',
    local: 'Bloco D, Sala D3',
    tipo: 'manutencao',
    status: 'pendente',
    solicitante: 'Eduardo Costa',
    autorId: 'u1',
    criadoEm: new Date(Date.now() - 15 * 60_000).toISOString(),
  },
  {
    id: 'o3',
    protocolo: '#2026-0042',
    titulo: 'Ar-condicionado vazando',
    local: 'Bloco D, Sala D3',
    tipo: 'manutencao',
    status: 'em_andamento',
    responsavelId: 'u3',
    solicitante: 'Eduardo Costa',
    autorId: 'u1',
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'o4',
    protocolo: '#2026-0039',
    titulo: 'Lâmpada queimada',
    local: 'Biblioteca, Piso 1',
    tipo: 'manutencao',
    status: 'concluido',
    solicitante: 'Eduardo Costa',
    autorId: 'u1',
    criadoEm: new Date(Date.now() - 24 * 3600_000).toISOString(),
  },
  {
    id: 'o5',
    protocolo: '#2026-0038',
    titulo: 'Poste de luz apagado',
    local: 'Estacionamento B',
    tipo: 'denuncia',
    status: 'concluido',
    solicitante: 'Anônimo',
    autorId: 'u1',
    criadoEm: new Date(Date.now() - 48 * 3600_000).toISOString(),
  },
]
