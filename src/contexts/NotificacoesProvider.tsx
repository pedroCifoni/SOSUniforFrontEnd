import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import type { Notificacao } from '@/models/notificacao'
import { notificacaoService } from '@/services/notificacaoService'
import { NotificacoesContext } from './notificacoesContext'

const INTERVALO_MS = 4000

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth()
  const toast = useToast()
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [revisao, setRevisao] = useState(0)
  const vistas = useRef<Set<string> | null>(null)
  const usuarioId = usuario?.id

  const atualizar = useCallback(async () => {
    if (!usuarioId) return
    const lista = await notificacaoService.listar(usuarioId)
    setNotificacoes(lista)

    if (vistas.current === null) {
      vistas.current = new Set(lista.map((n) => n.id))
      return
    }
    const novas = lista.filter((n) => !vistas.current!.has(n.id))
    if (novas.length === 0) return
    novas.forEach((n) => vistas.current!.add(n.id))
    novas.reverse().forEach((n) => toast.notificar(n.tipo === 'concluida' ? 'success' : 'info', `${n.titulo}: ${n.mensagem}`))
    setRevisao((r) => r + 1)
  }, [usuarioId, toast])

  useEffect(() => {
    vistas.current = null
    if (!usuarioId) {
      setNotificacoes([])
      return
    }
    void atualizar()
    const intervalo = setInterval(() => void atualizar(), INTERVALO_MS)
    return () => clearInterval(intervalo)
  }, [usuarioId, atualizar])

  const marcarTodasLidas = useCallback(async () => {
    if (!usuarioId) return
    await notificacaoService.marcarTodasLidas(usuarioId)
    setNotificacoes((atual) => atual.map((n) => ({ ...n, lida: true })))
  }, [usuarioId])

  const value = useMemo(
    () => ({ notificacoes, naoLidas: notificacoes.filter((n) => !n.lida).length, revisao, marcarTodasLidas }),
    [notificacoes, revisao, marcarTodasLidas],
  )

  return <NotificacoesContext.Provider value={value}>{children}</NotificacoesContext.Provider>
}
