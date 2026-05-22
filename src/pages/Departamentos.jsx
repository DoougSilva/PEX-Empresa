import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Departamentos.css'

export default function Departamentos() {
    const navigate       = useNavigate()
    const soundBtnRef    = useRef(null)
    const soundIconRef   = useRef(null)
    const trackRef       = useRef(null)
    const videosRef      = useRef([])
    const cardScrollRef  = useRef(null)

    useEffect(() => {
        const track  = trackRef.current
        const videos = videosRef.current.filter(Boolean)
        const btn    = soundBtnRef.current
        const icon   = soundIconRef.current
        const cardScroller = cardScrollRef.current

        let idx = 0
        let lastScrollTop = 0

        /* ── CARROSSEL AUTO ── */
        function showVideo(i) {
            if (!track || videos.length === 0) return
            track.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1)'
            track.style.transform  = `translateX(-${i * 100}%)`
            videos.forEach(v => v.pause())
            if (videos[i]) {
                videos[i].currentTime = 0
                videos[i].play().catch(() => {})
            }
        }

        videos.forEach(v => {
            v.addEventListener('ended', () => {
                idx = (idx + 1) % videos.length
                showVideo(idx)
            })
        })

        showVideo(0)

        /* ── SOM ── */
        const soundHandler = () => {
            if (videos.length === 0) return
            const nextMuted = !videos[0].muted
            videos.forEach(v => { v.muted = nextMuted })
            if (icon) icon.textContent = nextMuted ? '🔇' : '🔊'
        }
        if (btn) btn.addEventListener('click', soundHandler)

        /* ── SCROLL REVEAL nos cards ── */
        const items = Array.from(
            cardScroller?.querySelectorAll('.dept-cards-grid .box') || []
        )

        const observer = new IntersectionObserver(
            (entries) => {
                const currentScrollTop = cardScroller?.scrollTop || 0
                const scrollingUp = currentScrollTop < lastScrollTop
                lastScrollTop = currentScrollTop

                entries.forEach((entry) => {
                    const el = entry.target
                    if (entry.isIntersecting) {
                        el.classList.remove('reveal-from-top')
                        void el.offsetHeight
                        el.classList.add('show')
                    } else {
                        el.classList.remove('show')
                        if (scrollingUp) el.classList.add('reveal-from-top')
                        else el.classList.remove('reveal-from-top')
                    }
                })
            },
            {
                root: cardScroller || null,
                threshold: 0.08,
                rootMargin: '0px 0px -16px 0px',
            }
        )
        items.forEach((item) => observer.observe(item))

        return () => {
            if (btn) btn.removeEventListener('click', soundHandler)
            videos.forEach(v => v.pause())
            observer.disconnect()
        }
    }, [])

    return (
        <>
            <Header title="Treinar Colaborador" />

            <main className="dept-layout">

                {/* ESQUERDA: carrossel de vídeos */}
                <section className="dept-video-panel" aria-label="Vídeos institucionais">
                    <div className="video-box-container">
                        <button className="btn-floating-sound" ref={soundBtnRef} title="Som">
                            <span ref={soundIconRef}>🔇</span>
                        </button>
                        <div className="video-track" ref={trackRef}>
                            <div className="video-item">
                                <video
                                    ref={el => (videosRef.current[0] = el)}
                                    muted autoPlay playsInline
                                    src="/video/paginaprincipal.mp4"
                                />
                            </div>
                            <div className="video-item">
                                <video
                                    ref={el => (videosRef.current[1] = el)}
                                    muted playsInline
                                    src="/video/paginaprincipal.mp4"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* DIREITA: cards de departamentos */}
                <section className="dept-cards-section" aria-label="Departamentos">
                    <div className="section-header">
                        <h4>Selecione o Departamento</h4>
                    </div>

                    <div className="dept-cards-grid" ref={cardScrollRef}>

                        <div className="box">
                            <img src="/img/OIP.webp" alt="Fábrica II" />
                            <div className="box-content">
                                <p>Área responsável por parte da produção e organização de processos industriais.</p>
                                <button type="button" onClick={() => navigate('/fabrica2')}>Fábrica II</button>
                            </div>
                        </div>

                        <div className="box">
                            <img src="/img/FabricaTres.webp" alt="Fábrica III" />
                            <div className="box-content">
                                <p>Unidade dedicada à ampliação da capacidade produtiva e novos produtos.</p>
                                <button type="button">Fábrica III</button>
                            </div>
                        </div>

                        <div className="box">
                            <img src="/img/Portas.jpg" alt="Central de Portas" />
                            <div className="box-content">
                                <p>Setor de produção, acabamento e controle de qualidade das portas.</p>
                                <button type="button">Central de Portas</button>
                            </div>
                        </div>

                        <div className="box">
                            <img src="/img/Portas.jpg" alt="Metais" />
                            <div className="box-content">
                                <p>Setor responsável pela produção e controle de componentes metálicos.</p>
                                <button type="button">Metais</button>
                            </div>
                        </div>

                        <div className="box">
                            <img src="/img/Portas.jpg" alt="Termoformagem" />
                            <div className="box-content">
                                <p>Setor de termoformagem de peças plásticas para os produtos.</p>
                                <button type="button">Termoformagem</button>
                            </div>
                        </div>

                        <div className="box">
                            <img src="/img/Portas.jpg" alt="Manutenção" />
                            <div className="box-content">
                                <p>Equipe responsável pela manutenção preventiva e corretiva das linhas.</p>
                                <button type="button">Manutenção</button>
                            </div>
                        </div>

                    </div>
                </section>

            </main>

            <Footer />
        </>
    )
}