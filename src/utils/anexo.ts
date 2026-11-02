import type { Anexo } from '@/models/ocorrencia'

// A URL vale só durante a sessão; com backend, troque pela URL devolvida no upload.
export function paraAnexo(arquivo: File): Anexo {
  return { nome: arquivo.name, url: URL.createObjectURL(arquivo), tipo: arquivo.type }
}
