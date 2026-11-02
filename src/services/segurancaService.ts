import { simulateRequest } from '@/api/client'
import { segurancasMock } from '@/mocks/db'
import type { Seguranca } from '@/models/seguranca'

export const segurancaService = {
  listarNotificados(): Promise<Seguranca[]> {
    return simulateRequest(() => segurancasMock.map((s) => ({ ...s })), 600)
  },
}
