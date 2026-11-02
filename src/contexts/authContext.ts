import { createContext } from 'react'
import type { Credenciais, Usuario } from '@/models/usuario'

export interface AuthContextValue {
  usuario: Usuario | null
  /** Instante (ms) em que a sessão expira, ou null se não há sessão. */
  expiraEm: number | null
  login: (credenciais: Credenciais) => Promise<Usuario>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
