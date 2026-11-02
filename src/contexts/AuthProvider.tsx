import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUnauthorizedHandler } from '@/api/client'
import { tokenStorage } from '@/api/tokenStorage'
import type { Credenciais } from '@/models/usuario'
import { useToast } from '@/hooks/useToast'
import { authService } from '@/services/authService'
import { claimsParaUsuario, decodeJwt, expiraEmMs } from '@/utils/jwt'
import { AuthContext } from './authContext'

function carregarTokenValido(): string | null {
  const token = tokenStorage.get()
  const claims = token ? decodeJwt(token) : null
  if (token && claims && expiraEmMs(claims) > 0) return token
  tokenStorage.clear()
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(carregarTokenValido)
  const toast = useToast()

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

  const sessaoExpirada = useCallback(() => {
    logout()
    toast.info('Sua sessão expirou. Entre novamente.')
  }, [logout, toast])

  useEffect(() => {
    setUnauthorizedHandler(sessaoExpirada)
    return () => setUnauthorizedHandler(null)
  }, [sessaoExpirada])

  useEffect(() => {
    if (!claims) return
    const conferir = () => {
      if (expiraEmMs(claims) <= 0) sessaoExpirada()
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
  }, [claims, sessaoExpirada])

  const value = useMemo(() => ({ usuario, expiraEm, login, logout }), [usuario, expiraEm, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
