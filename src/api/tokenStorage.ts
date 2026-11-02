const KEY = 'sos-unifor:token'

// TODO(backend): se o servidor emitir o JWT em cookie httpOnly, este arquivo deixa de existir
// e o http client passa a usar `credentials: 'include'` em vez do header Authorization.
// localStorage é simples, mas legível por qualquer script da página (risco de XSS).
export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(KEY, token)
    } catch {
      /* storage indisponível: a sessão vale só até recarregar */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignora */
    }
  },
}
