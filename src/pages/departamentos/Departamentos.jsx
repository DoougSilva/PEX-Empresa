import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import VideoCarousel from '../../components/VideoCarousel'
import { DEPARTAMENTOS, VIDEOS_DEPARTAMENTOS } from '../../data/departamentos'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import '../../styles/Departamentos.css'

export default function Departamentos() {
  const navigate = useNavigate()
  const cardScrollRef = useRef(null)

  useScrollReveal(cardScrollRef, { usarDirecaoScroll: true })

  return (
    <>
      <Header title="Treinar Colaborador" />

      <main className="dept-layout">

        {/* ESQUERDA: carrossel de vídeos */}
        <section className="dept-video-panel" aria-label="Vídeos institucionais">
          <VideoCarousel videos={VIDEOS_DEPARTAMENTOS} showControls />
        </section>

        {/* DIREITA: cards de departamentos */}
        <section className="dept-cards-section" aria-label="Departamentos">
          <div className="section-header">
            <h4>Selecione o Departamento</h4>
          </div>

          <div className="dept-cards-grid" ref={cardScrollRef}>
            {DEPARTAMENTOS.map((dept) => (
              <div className="box" key={dept.label}>
                <img src={dept.img} alt={dept.label} loading="lazy" />
                <div className="box-content">
                  <p>{dept.desc}</p>
                  <button
                    type="button"
                    onClick={() => dept.to && navigate(dept.to)}
                    disabled={!dept.to}
                    style={!dept.to ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    {dept.label}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
