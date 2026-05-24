import { useState, useCallback, useRef, useEffect } from 'react'

export function useToast(duracao = 3000) {
  const [toasts, setToasts] = useState([])
  const contadorRef = useRef(0)
  const timersRef = useRef(new Map())

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(timer => clearTimeout(timer))
  }, [])

  const showToast = useCallback((msg, type = '') => {
    const id = ++contadorRef.current
    setToasts(prev => [...prev, { id, msg, type }])

    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
      timersRef.current.delete(id)
    }, duracao)

    timersRef.current.set(id, timer)
  }, [duracao])

  return { toasts, showToast }
}
