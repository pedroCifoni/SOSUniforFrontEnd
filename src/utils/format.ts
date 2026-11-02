export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase()
}

export function dataHora(iso: string): string {
  const d = new Date(iso)
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const dias = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / 86_400_000)
  if (dias === 0) return `Hoje, ${hora}`
  if (dias === 1) return `Ontem, ${hora}`
  return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, ${hora}`
}

export function tempoRelativo(iso: string): string {
  const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
  if (min < 60) return `Há ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `Há ${h} h`
  return h < 48 ? 'Ontem' : `Há ${Math.round(h / 24)} dias`
}
