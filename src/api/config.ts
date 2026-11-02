export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export const USE_MOCK = API_URL === ''
