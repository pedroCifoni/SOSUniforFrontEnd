import type { Usuario } from '@/models/usuario'
import { base64UrlEncode, type JwtClaims } from '@/utils/jwt'

const VALIDADE_SEGUNDOS = 60 * 60


export function gerarJwtMock(usuario: Usuario): string {
  const agora = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', typ: 'JWT' }
  const claims: JwtClaims = {
    sub: usuario.id,
    name: usuario.nome,
    email: usuario.email,
    role: usuario.perfil,
    iat: agora,
    exp: agora + VALIDADE_SEGUNDOS,
  }
  return [
    base64UrlEncode(JSON.stringify(header)),
    base64UrlEncode(JSON.stringify(claims)),
    'assinatura-mock',
  ].join('.')
}
