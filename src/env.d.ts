/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API. Vazia/ausente = modo mock (sem backend). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
