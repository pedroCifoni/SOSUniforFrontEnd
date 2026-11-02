import { simulateRequest } from '@/api/client'
import { usuariosMock } from '@/mocks/db'
import type { Usuario } from '@/models/usuario'

export const usuarioService = {
  /** Backend: GET /usuarios?perfil=seguranca. Destinos possíveis de um encaminhamento. */
  listarSegurancas(): Promise<Usuario[]> {
    return simulateRequest(() => usuariosMock.filter((u) => u.perfil === 'seguranca'), 150)
  },
}
