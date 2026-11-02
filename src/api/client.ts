import { API_URL } from './config'
import { tokenStorage } from './tokenStorage'

export function simulateRequest<T>(produce: () => T, ms = 400): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(produce())
      } catch (err) {
        reject(err)
      }
    }, ms)
  })
}

let aoNaoAutorizado: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  aoNaoAutorizado = handler
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = tokenStorage.get()
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && token) aoNaoAutorizado?.()

  if (!res.ok) {
    const erro = await res.json().catch(() => null)
    throw new Error(erro?.message ?? `Erro ${res.status}`)
  }
  return (res.status === 204 ? undefined : await res.json()) as T
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
