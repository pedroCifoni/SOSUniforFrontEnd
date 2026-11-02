import { createContext } from 'react'
import type { Credenciais, Usuario } from '@/models/usuario'

export interface AuthContextValue {
  usuario: Usuario | null
  expiraEm: number | null
  login: (credenciais: Credenciais) => Promise<Usuario>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
