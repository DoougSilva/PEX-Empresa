import { useEffect } from 'react'

/**
 * Hook para scroll reveal com IntersectionObserver.
 *
 * Variante A (Home, LinhaSP2): detecta posição acima/abaixo do root via getBoundingClientRect.
 * Variante B (Departamentos, Linha1): detecta direção via scrollTop.
 *
 * @param {React.RefObject} containerRef — ref do container com scroll
 * @param {{
 *   seletor?: string,
 *   threshold?: number,
 *   rootMargin?: string,
 *   mobileBreakpoint?: number,
 *   usarDirecaoScroll?: boolean,
 *   staggerDelay?: number,
 *   debounceResize?: number,
 * }} opcoes
 */
export function useScrollReveal(containerRef, {
  seletor = '.box',
  threshold = 0.08,
  rootMargin = '0px 0px -16px 0px',
  mobileBreakpoint = 860,
  usarDirecaoScroll = false,
  staggerDelay = 0,
  debounceResize = 0,
} = {}) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ehMobile = () => window.innerWidth <= mobileBreakpoint

    const staggerTimers = []

    if (staggerDelay > 0) {
      const items = Array.from(container.querySelectorAll(`:scope > ${seletor}`))
      const initTimer = setTimeout(() => {
        items.forEach((el, i) => {
          const t = setTimeout(() => {
            el.classList.remove('reveal-from-top')
            el.classList.add('show')
          }, i * staggerDelay)
          staggerTimers.push(t)
        })
      }, 60)
      staggerTimers.push(initTimer)
    }

    const criarObserver = (alvo) => {
      const items = Array.from(alvo.querySelectorAll(`:scope > ${seletor}`))
      if (!items.length) return () => {}

      let lastScrollTop = 0

      const observer = new IntersectionObserver(
        (entries) => {
          if (usarDirecaoScroll) {
            const scrollAtual = alvo.scrollTop || 0
            const scrollandoParaCima = scrollAtual < lastScrollTop
            lastScrollTop = scrollAtual

            entries.forEach((entry) => {
              const el = entry.target
              if (entry.isIntersecting) {
                el.classList.remove('reveal-from-top')
                void el.offsetHeight
                el.classList.add('show')
              } else {
                el.classList.remove('show')
                if (scrollandoParaCima) el.classList.add('reveal-from-top')
                else el.classList.remove('reveal-from-top')
              }
            })
          } else {
            entries.forEach((entry) => {
              const el = entry.target
              if (entry.isIntersecting) {
                el.classList.remove('reveal-from-top')
                void el.offsetHeight
                el.classList.add('show')
              } else {
                if (staggerDelay > 0 && !el.classList.contains('show')) return
                el.classList.remove('show')
                const rootEl = ehMobile() ? null : alvo
                const rootRect = rootEl
                  ? rootEl.getBoundingClientRect()
                  : { top: 0, bottom: window.innerHeight }
                const elRect = el.getBoundingClientRect()

                if (elRect.bottom < rootRect.top) {
                  el.classList.add('reveal-from-top')
                } else {
                  el.classList.remove('reveal-from-top')
                }
              }
            })
          }
        },
        {
          root: usarDirecaoScroll ? alvo : (ehMobile() ? null : alvo),
          threshold,
          rootMargin,
        },
      )

      items.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }

    let limpar = criarObserver(container)

    let timerResize
    const handleResize = debounceResize > 0
      ? () => {
        clearTimeout(timerResize)
        timerResize = setTimeout(() => {
          limpar()
          limpar = criarObserver(container)
        }, debounceResize)
      }
      : null

    if (handleResize) window.addEventListener('resize', handleResize)

    return () => {
      limpar()
      staggerTimers.forEach(clearTimeout)
      if (handleResize) {
        window.removeEventListener('resize', handleResize)
        clearTimeout(timerResize)
      }
    }
  }, [containerRef, seletor, threshold, rootMargin, mobileBreakpoint, usarDirecaoScroll, staggerDelay, debounceResize])
}
