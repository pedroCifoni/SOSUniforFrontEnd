import type { Perfil, Usuario } from '@/models/usuario'

export interface JwtClaims {
  sub: string
  name: string
  email: string
  role: Perfil
  iat: number
  exp: number
}

export function base64UrlEncode(texto: string): string {
  const bytes = new TextEncoder().encode(texto)
  const binario = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(valor: string): string {
  const base64 = valor.replace(/-/g, '+').replace(/_/g, '/')
  const binario = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
  return new TextDecoder().decode(Uint8Array.from(binario, (c) => c.charCodeAt(0)))
}

/**
 * Lê as claims do payload. NÃO valida a assinatura: isso só o backend pode fazer.
 * No front o token serve para exibir dados do usuário e saber quando expira.
 */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const partes = token.split('.')
    if (partes.length !== 3) return null
    const claims = JSON.parse(base64UrlDecode(partes[1])) as Partial<JwtClaims>
    if (!claims.sub || !claims.name || !claims.email || !claims.exp) return null
    if (claims.role !== 'admin' && claims.role !== 'usuario') return null
    return claims as JwtClaims
  } catch {
    return null
  }
}

export function expiraEmMs(claims: JwtClaims): number {
  return claims.exp * 1000 - Date.now()
}

export function claimsParaUsuario(claims: JwtClaims): Usuario {
  return { id: claims.sub, nome: claims.name, email: claims.email, perfil: claims.role }
}
