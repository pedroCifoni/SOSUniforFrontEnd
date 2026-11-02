const KEY = 'sos-unifor:token'

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
      return
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(KEY)
    } catch {
      return
    }
  },
}
