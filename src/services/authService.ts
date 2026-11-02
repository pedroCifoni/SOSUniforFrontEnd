import { USE_MOCK } from '@/api/config'
import { http, simulateRequest } from '@/api/client'
import { SENHA_MOCK, usuariosMock } from '@/mocks/db'
import { gerarJwtMock } from '@/mocks/jwt'
import type { Credenciais, LoginResponse } from '@/models/usuario'

export const authService = {
  /** Backend: POST /auth/login -> { token }. A autenticação e a autorização são feitas lá. */
  login(credenciais: Credenciais): Promise<LoginResponse> {
    if (!USE_MOCK) return http.post<LoginResponse>('/auth/login', credenciais)

    return simulateRequest(() => {
      const usuario = usuariosMock.find((u) => u.email === credenciais.email.trim().toLowerCase())
      if (!usuario || credenciais.senha !== SENHA_MOCK) {
        throw new Error('E-mail ou senha inválidos.')
      }
      return { token: gerarJwtMock(usuario) }
    })
  },
}
