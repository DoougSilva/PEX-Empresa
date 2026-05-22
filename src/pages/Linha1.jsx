import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/StyleLinhas.css'

export default function Linha1() {
  const navigate       = useNavigate()
  const trackRef       = useRef(null)
  const videosRef      = useRef([])
  const soundBtnRef    = useRef(null)
  const soundIconRef   = useRef(null)
  const cardScrollRef  = useRef(null)

  useEffect(() => {
    const track  = trackRef.current
    const videos = videosRef.current.filter(Boolean)
    const btn    = soundBtnRef.current
    const icon   = soundIconRef.current
    const cardScroller = cardScrollRef.current

    let idx = 0
    let lastScrollTop = 0

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

    const goNext = () => {
      if (videos.length === 0) return
      idx = (idx + 1) % videos.length
      showVideo(idx)
    }

    const goPrev = () => {
      if (videos.length === 0) return
      idx = (idx - 1 + videos.length) % videos.length
      showVideo(idx)
    }

    const soundHandler = () => {
      if (videos.length === 0) return

      const nextMutedState = !videos[0].muted
      videos.forEach(v => { v.muted = nextMutedState })

      if (icon) icon.textContent = nextMutedState ? '🔇' : '🔊'
    }

    const nextBtn = document.querySelector('.linha1-video .btn-next')
    const prevBtn = document.querySelector('.linha1-video .btn-prev')

    if (nextBtn) nextBtn.addEventListener('click', goNext)
    if (prevBtn) prevBtn.addEventListener('click', goPrev)
    if (btn) btn.addEventListener('click', soundHandler)

    videos.forEach(v => v.addEventListener('ended', goNext))

    /*
      Os cards agora rolam dentro da própria section.
      Por isso o IntersectionObserver usa o container de rolagem como root,
      e não mais a janela inteira.
    */
    const items = Array.from(
        cardScroller?.querySelectorAll('.linha-cards-grid .box') || []
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

    showVideo(0)

    return () => {
      if (nextBtn) nextBtn.removeEventListener('click', goNext)
      if (prevBtn) prevBtn.removeEventListener('click', goPrev)
      if (btn) btn.removeEventListener('click', soundHandler)

      videos.forEach(v => {
        v.removeEventListener('ended', goNext)
        v.pause()
      })

      observer.disconnect()
    }
  }, [])

  const areas = [
    {
      title: 'Preparação de Caixas',
      desc: 'Montagem e preparação das caixas freezer e refrigerador, encaminhando para PU Gabinetes.',
      to: '/fabrica2/linha1/pc',
    },
    {
      title: 'PU Gabinetes',
      desc: 'Processo de poliuretano nos gabinetes, garantindo isolamento térmico do produto.',
      to: null,
    },
    {
      title: 'Montagem',
      desc: 'Montagem dos componentes internos e externos do produto.',
      to: null,
    },
    {
      title: 'Montagem Solda',
      desc: 'Processos de soldagem e fixação de componentes do circuito frigorífico.',
      to: null,
    },
    {
      title: 'Áreas de Testes',
      desc: 'Testes de funcionalidade, estanqueidade e desempenho do produto.',
      to: null,
    },
    {
      title: 'Embalagem',
      desc: 'Embalagem final do produto para expedição ao cliente.',
      to: null,
    },
    {
      title: 'Área de Portas',
      desc: 'Montagem e ajuste das portas do produto.',
      to: null,
    },
  ]

  return (
      <>
        <Header title="Linha 1 — Áreas de Trabalho" />

        <main className="linha-layout">
          <section className="linha-cards-section" aria-label="Áreas de trabalho da Linha 1">
            <div className="section-header">
              <h4>Selecione a Área</h4>
            </div>

            <div className="linha-cards-grid" ref={cardScrollRef}>
              {areas.map((a, i) => (
                  <div className="box" key={i}>
                    <div className="box-content">
                      <h2>{a.title}</h2>
                      <p>{a.desc}</p>

                      <button
                          type="button"
                          onClick={() => a.to ? navigate(a.to) : undefined}
                          disabled={!a.to}
                          aria-disabled={!a.to}
                      >
                        Acessar Área
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </section>

          <section className="linha-video-panel" aria-label="Vídeos de treinamento da Linha 1">
            <div className="video-box-container linha1-video">
              <div className="video-track" ref={trackRef}>
                <div className="video-item">
                  <video
                      ref={el => (videosRef.current[0] = el)}
                      muted
                      autoPlay
                      playsInline
                      src="/MidiasProdutos/videoplayback.mp4"
                  />
                </div>

                <div className="video-item">
                  <video
                      ref={el => (videosRef.current[1] = el)}
                      muted
                      playsInline
                      src="/MidiasProdutos/videoplayback (2).mp4"
                  />
                </div>

                <div className="video-item">
                  <video
                      ref={el => (videosRef.current[2] = el)}
                      muted
                      playsInline
                      src="/MidiasProdutos/videoplayback (3).mp4"
                  />
                </div>
              </div>

              <div className="video-controls">
                <button className="btn-carousel btn-prev" type="button" aria-label="Vídeo anterior">❮</button>

                <button className="btn-floating-sound" type="button" ref={soundBtnRef} title="Som" aria-label="Ativar ou desativar som">
                  <span ref={soundIconRef}>🔇</span>
                </button>

                <button className="btn-carousel btn-next" type="button" aria-label="Próximo vídeo">❯</button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </>
  )
}