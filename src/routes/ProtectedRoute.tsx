import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { Perfil } from '@/models/usuario'

interface ProtectedRouteProps {
  perfis?: Perfil[]
}

export function ProtectedRoute({ perfis }: ProtectedRouteProps) {
  const { usuario } = useAuth()

  if (!usuario) return <Navigate to="/login" replace />
  if (perfis && !perfis.includes(usuario.perfil)) return <Navigate to="/" replace />

  return <Outlet />
}
