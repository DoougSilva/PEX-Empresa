import { useState, useCallback } from 'react'

/**
 * Hook para controle de mute/unmute de vídeo(s).
 * @param {React.RefObject|React.RefObject[]} videoRefs — ref único ou array de refs
 * @param {{ inicialMudo?: boolean }} opcoes
 */
export function useVideoSound(videoRefs, { inicialMudo = true } = {}) {
  const [muted, setMuted] = useState(inicialMudo)

  const alternarSom = useCallback(() => {
    setMuted(prev => {
      const proximo = !prev
      const refs = Array.isArray(videoRefs) ? videoRefs : [videoRefs]
      refs.forEach(ref => {
        const el = ref?.current
        if (el) el.muted = proximo
      })
      return proximo
    })
  }, [videoRefs])

  return { muted, alternarSom }
}
