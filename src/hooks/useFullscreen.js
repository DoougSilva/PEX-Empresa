import { useCallback } from 'react'

export function useFullscreen() {
  return useCallback((ref) => {
    const el = ref?.current ?? ref
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {})
    else document.exitFullscreen()
  }, [])
}
