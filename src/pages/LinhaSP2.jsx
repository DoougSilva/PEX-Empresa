import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/StyleSP2.css'

export default function LinhaSP2() {
    const navigate     = useNavigate()
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const items = Array.from(container.querySelectorAll(':scope > .box'))
        if (!items.length) return

        const isMobile = () => window.innerWidth <= 860

        /* ── Staggered entry ao carregar ──
           Dá um frame para o layout estabilizar, depois mostra
           os cards um a um com delay incremental.             */
        let staggerTimers = []
        const triggerStagger = () => {
            items.forEach((el, i) => {
                const t = setTimeout(() => {
                    el.classList.remove('reveal-from-top')
                    el.classList.add('show')
                }, i * 80)           // 80 ms entre cada card
                staggerTimers.push(t)
            })
        }
        // Um frame de delay garante que o CSS já aplicou opacity:0
        const initTimer = setTimeout(triggerStagger, 60)

        /* ── Scroll reveal para cards além do viewport ── */
        let lastScroll = isMobile() ? window.scrollY : container.scrollTop
        const getScroll    = () => isMobile() ? window.scrollY : container.scrollTop
        const scrollTarget = isMobile() ? window : container

        const onScroll = () => { lastScroll = getScroll() }
        scrollTarget.addEventListener('scroll', onScroll, { passive: true })

        const observer = new IntersectionObserver(
            (entries) => {
                const currentScroll = getScroll()

                entries.forEach((entry) => {
                    const el = entry.target
                    if (entry.isIntersecting) {
                        el.classList.remove('reveal-from-top')
                        void el.offsetHeight
                        el.classList.add('show')
                    } else {
                        // Só aplica reveal-from-top depois do stagger inicial
                        if (!el.classList.contains('show')) return
                        el.classList.remove('show')

                        const rootEl   = isMobile() ? null : container
                        const rootRect = rootEl
                            ? rootEl.getBoundingClientRect()
                            : { top: 0, bottom: window.innerHeight }
                        const elRect   = el.getBoundingClientRect()

                        if (elRect.bottom < rootRect.top) {
                            el.classList.add('reveal-from-top')
                        } else {
                            el.classList.remove('reveal-from-top')
                        }
                    }
                })

                lastScroll = currentScroll
            },
            {
                root:       isMobile() ? null : container,
                threshold:  0.08,
                rootMargin: '0px 0px -16px 0px',
            }
        )

        items.forEach((el) => observer.observe(el))

        return () => {
            clearTimeout(initTimer)
            staggerTimers.forEach(clearTimeout)
            scrollTarget.removeEventListener('scroll', onScroll)
            observer.disconnect()
        }
    }, [])

    const linhas = [
        { label: 'Linha 1',   to: '/fabrica2/linha1' },
        { label: 'Linha 2',   to: null },
        { label: 'Linha 3',   to: null },
        { label: 'Linha 6',   to: null },
        { label: 'Linha 7',   to: null },
        { label: 'Linha 8',   to: null },
        { label: 'Linha 9',   to: null },
        { label: 'Eco House', to: null },
    ]

    return (
        <>
            <Header title="Fábrica II — Linhas de Produção" />

            <main className="sp2-page-main">
                <div className="section-header">
                    <h4>Selecione a Linha</h4>
                </div>

                <div className="container" ref={containerRef}>
                    {linhas.map((l, i) => (
                        <div className="box" key={i}>
                            <img src="/img/Portas.jpg" alt={l.label} />
                            <div className="box-content">
                                <p>Montagem dos produtos CRM39 · BRM45 · BRM54</p>
                                <button
                                    type="button"
                                    onClick={() => l.to ? navigate(l.to) : undefined}
                                    style={!l.to ? { opacity: 0.6 } : {}}
                                >
                                    {l.label}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </>
    )
}