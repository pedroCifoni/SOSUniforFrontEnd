import type { Anexo } from '@/models/ocorrencia'

export function paraAnexo(arquivo: File): Anexo {
  return { nome: arquivo.name, url: URL.createObjectURL(arquivo), tipo: arquivo.type }
}
