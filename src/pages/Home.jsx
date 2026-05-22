import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/style.css'

export default function Home() {
    const soundBtnRef  = useRef(null)
    const soundIconRef = useRef(null)
    const videoRef     = useRef(null)
    const boxesColRef  = useRef(null)

    useEffect(() => {
        /* ── Som ── */
        const btn   = soundBtnRef.current
        const icon  = soundIconRef.current
        const video = videoRef.current

        const toggleSound = () => {
            if (!video) return
            video.muted = !video.muted
            if (icon) icon.textContent = video.muted ? '🔇' : '🔊'
        }
        if (btn) btn.addEventListener('click', toggleSound)

        /* ── Scroll Reveal ──────────────────────────────────────────
           Container único (.boxes-col) com overflow-y:auto no desktop.
           - Desktop: o próprio .boxes-col é o root do observer.
             Rastreamos container.scrollTop para detectar direção.
           - Mobile: root = null (viewport). Rastreamos window.scrollY.

           Ao sair pelo TOPO  → adiciona 'reveal-from-top' (entra de cima na volta).
           Ao sair pelo FUNDO → remove 'reveal-from-top'  (entra de baixo na volta).
        ── */

        const isMobile = () => window.innerWidth <= 860

        const setupReveal = (container) => {
            const items = Array.from(container.querySelectorAll(':scope > .box'))
            if (!items.length) return () => {}

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
                            void el.offsetHeight          // força reflow para reiniciar transição
                            el.classList.add('show')
                        } else {
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
                scrollTarget.removeEventListener('scroll', onScroll)
                observer.disconnect()
            }
        }

        /* Inicializa o container único */
        let cleanBoxes = setupReveal(boxesColRef.current)

        /* Re-inicializa ao redimensionar (troca entre desktop e mobile) */
        let resizeTimer
        const onResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                cleanBoxes()
                cleanBoxes = setupReveal(boxesColRef.current)
            }, 200)
        }
        window.addEventListener('resize', onResize)

        return () => {
            if (btn) btn.removeEventListener('click', toggleSound)
            cleanBoxes()
            window.removeEventListener('resize', onResize)
            clearTimeout(resizeTimer)
        }
    }, [])

    return (
        <>
          <Header title="Seja bem-vindo ao Espaço do Colaborador" />

            <main className="home-page-main">
                <section className="home-main">

                    {/* ── FLYER — 260 px, altura total entre header e footer ── */}
                    <aside className="flyer">
                        <div>
                            <h2>Nossa Essência</h2>
                        </div>
                        <div>
                            <h3>Missão</h3>
                            <p>Ganhar confiança e criar demanda para nossas marcas num mundo digital.</p>
                        </div>
                        <div>
                            <h3>Valores</h3>
                            <p>Integridade · Respeito · Inclusão e Diversidade · One Whirlpool · Espírito de Vitória</p>
                        </div>
                        <div>
                            <h3>Visão</h3>
                            <p>Ser a melhor empresa de cozinha e lavanderia, em busca constante de melhorar a vida em casa.</p>
                        </div>
                    </aside>

                    {/* ── ÁREA DOS CARDS — container único com grid de 2 colunas ── */}
                    <div className="boxes-col" ref={boxesColRef}>

                        <div className="box col-left">
                            <img src="https://picsum.photos/800/400" alt="Construindo o futuro" />
                            <h2>Construindo o Futuro</h2>
                            <p>
                                Aqui na Whirlpool, acreditamos que o conhecimento é a nossa matéria-prima mais valiosa.
                                Investir na aprendizagem contínua não é apenas desenvolver habilidades — é fortalecer o DNA
                                da nossa empresa. Quando cada colaborador aprende, a companhia inteira evolui, garantindo
                                processos mais seguros e uma entrega de excelência ao mundo.
                            </p>
                        </div>

                        <div className="box col-right video-card">
                            <button className="btn-floating-sound" ref={soundBtnRef} title="Ativar/Desativar Som">
                                <span ref={soundIconRef}>🔇</span>
                            </button>
                            <div className="video-wrap">
                                <video ref={videoRef} autoPlay muted loop playsInline>
                                    <source src="/video/paginaprincipal.mp4" type="video/mp4" />
                                </video>
                            </div>
                            <h2>A Arte da Montagem</h2>
                            <p>
                                Já pensou em transformar um simples produto em desejo de consumo? Entender o passo a passo
                                por trás da montagem dos nossos refrigeradores é entender que o seu toque final faz toda a
                                diferença na entrega de um momento especial para o cliente.
                            </p>
                        </div>

                        <div className="box col-left">
                            <img src="https://picsum.photos/800/401" alt="Segurança e Qualidade" />
                            <h2>Segurança e Qualidade: Dois Lados da Mesma Moeda</h2>
                            <p>
                                Na nossa indústria, a precisão vai além da linha de montagem. Ela está no olhar atento
                                à segurança de cada profissional. Manter um ambiente seguro é o que nos permite alcançar
                                padrões de qualidade internacionais. Cuidar de quem faz a engrenagem girar é o nosso
                                compromisso inegociável.
                            </p>
                        </div>

                        <div className="box col-right">
                            <img src="https://picsum.photos/800/402" alt="Inovação Contínua" />
                            <h2>Inovação Contínua</h2>
                            <p>
                                Aqui na Whirlpool, acreditamos que o conhecimento é a nossa matéria-prima mais valiosa.
                                Investir na aprendizagem contínua não é apenas desenvolver habilidades — é fortalecer o DNA
                                da nossa empresa. Quando cada colaborador aprende, a companhia inteira evolui, garantindo
                                processos mais seguros e uma entrega de excelência ao mundo.
                            </p>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}