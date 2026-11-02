export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

/** Sem VITE_API_URL o app roda 100% com dados mockados. */
export const USE_MOCK = API_URL === ''
