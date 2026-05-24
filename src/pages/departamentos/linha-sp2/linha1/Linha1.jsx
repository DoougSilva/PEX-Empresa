import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import VideoCarousel from '../../../../components/VideoCarousel'
import { AREAS, VIDEOS_LINHA1 } from '../../../../data/areasLinha1'
import { useScrollReveal } from '../../../../hooks/useScrollReveal'
import '../../../../styles/StyleLinhas.css'

export default function Linha1() {
  const navigate = useNavigate()
  const cardScrollRef = useRef(null)

  useScrollReveal(cardScrollRef, { usarDirecaoScroll: true })

  return (
    <>
      <Header title="Linha 1 — Áreas de Trabalho" />

      <main className="linha-layout">
        <section className="linha-cards-section" aria-label="Áreas de trabalho da Linha 1">
          <div className="section-header">
            <h4>Selecione a Área</h4>
          </div>

          <div className="linha-cards-grid" ref={cardScrollRef}>
            {AREAS.map((a) => (
              <div className="box" key={a.title}>
                <div className="box-content">
                  <h2>{a.title}</h2>
                  <p>{a.desc}</p>
                  <button
                    type="button"
                    onClick={() => a.to && navigate(a.to)}
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
          <VideoCarousel videos={VIDEOS_LINHA1} showControls />
        </section>
      </main>

      <Footer />
    </>
  )
}
