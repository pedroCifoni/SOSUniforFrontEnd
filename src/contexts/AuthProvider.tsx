import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUnauthorizedHandler } from '@/api/client'
import { tokenStorage } from '@/api/tokenStorage'
import type { Credenciais } from '@/models/usuario'
import { authService } from '@/services/authService'
import { claimsParaUsuario, decodeJwt, expiraEmMs } from '@/utils/jwt'
import { AuthContext } from './authContext'

/** Token guardado só vale se for legível e ainda não tiver expirado. */
function carregarTokenValido(): string | null {
  const token = tokenStorage.get()
  const claims = token ? decodeJwt(token) : null
  if (token && claims && expiraEmMs(claims) > 0) return token
  tokenStorage.clear()
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(carregarTokenValido)

  // A sessão inteira (usuário, perfil, expiração) é derivada do token: fonte única de verdade.
  const claims = useMemo(() => (token ? decodeJwt(token) : null), [token])
  const usuario = useMemo(() => (claims ? claimsParaUsuario(claims) : null), [claims])
  const expiraEm = claims ? claims.exp * 1000 : null

  const logout = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
  }, [])

  const login = useCallback(async (credenciais: Credenciais) => {
    const { token: novo } = await authService.login(credenciais)
    const novasClaims = decodeJwt(novo)
    if (!novasClaims) throw new Error('Resposta de login inválida.')
    tokenStorage.set(novo)
    setToken(novo)
    return claimsParaUsuario(novasClaims)
  }, [])

  // Backend respondeu 401 com token enviado: sessão inválida, volta ao login.
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  // Encerra a sessão quando o token expira. O timer sozinho não basta: com a aba em segundo plano
  // ou o computador suspenso ele atrasa, então também conferimos ao voltar à aba e a cada 30 s.
  useEffect(() => {
    if (!claims) return
    const conferir = () => {
      if (expiraEmMs(claims) <= 0) logout()
    }
    const timer = setTimeout(conferir, Math.max(0, expiraEmMs(claims)))
    const intervalo = setInterval(conferir, 30_000)
    document.addEventListener('visibilitychange', conferir)
    window.addEventListener('focus', conferir)
    return () => {
      clearTimeout(timer)
      clearInterval(intervalo)
      document.removeEventListener('visibilitychange', conferir)
      window.removeEventListener('focus', conferir)
    }
  }, [claims, logout])

  const value = useMemo(() => ({ usuario, expiraEm, login, logout }), [usuario, expiraEm, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
