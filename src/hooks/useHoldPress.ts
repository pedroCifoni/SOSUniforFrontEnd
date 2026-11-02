import { useCallback, useEffect, useRef, useState } from 'react'

// Dispara onComplete após o usuário segurar o botão por `ms`. `progresso` vai de 0 a 1.
export function useHoldPress(onComplete: () => void, ms = 2000) {
  const [progresso, setProgresso] = useState(0)
  const raf = useRef<number | null>(null)
  const inicio = useRef(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const cancelar = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    raf.current = null
    setProgresso(0)
  }, [])

  const iniciar = useCallback(() => {
    inicio.current = performance.now()
    const tick = (agora: number) => {
      const p = Math.min(1, (agora - inicio.current) / ms)
      setProgresso(p)
      if (p >= 1) {
        raf.current = null
        setProgresso(0)
        onCompleteRef.current()
        return
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [ms])

  useEffect(() => cancelar, [cancelar])

  return { progresso, iniciar, cancelar }
}
