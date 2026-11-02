import { simulateRequest } from '@/api/client'
import { usuariosMock } from '@/mocks/db'
import type { Notificacao } from '@/models/notificacao'
import type { Perfil } from '@/models/usuario'

let banco: Notificacao[] = []

type DadosNotificacao = Omit<Notificacao, 'id' | 'destinatarioId' | 'criadaEm' | 'lida'>

export const notificacaoService = {
  listar(usuarioId: string): Promise<Notificacao[]> {
    return simulateRequest(
      () => banco.filter((n) => n.destinatarioId === usuarioId).sort((a, b) => b.criadaEm.localeCompare(a.criadaEm)),
      0,
    )
  },

  marcarTodasLidas(usuarioId: string): Promise<void> {
    return simulateRequest(() => {
      banco = banco.map((n) => (n.destinatarioId === usuarioId ? { ...n, lida: true } : n))
    }, 0)
  },

  emitir(destinatarios: Array<string | undefined>, dados: DadosNotificacao, ignorarId?: string) {
    const ids = new Set(destinatarios.filter((id): id is string => !!id && id !== ignorarId))
    const agora = new Date().toISOString()
    banco = [
      ...Array.from(ids, (destinatarioId) => ({
        ...dados,
        id: crypto.randomUUID(),
        destinatarioId,
        criadaEm: agora,
        lida: false,
      })),
      ...banco,
    ]
  },

  idsPorPerfil(...perfis: Perfil[]): string[] {
    return usuariosMock.filter((u) => perfis.includes(u.perfil)).map((u) => u.id)
  },
}
