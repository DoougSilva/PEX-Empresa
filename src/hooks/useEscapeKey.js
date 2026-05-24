import { useEffect } from 'react'

export function useEscapeKey(ativo, callback) {
  useEffect(() => {
    if (!ativo) return
    const handleEsc = (e) => { if (e.key === 'Escape') callback() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [ativo, callback])
}
