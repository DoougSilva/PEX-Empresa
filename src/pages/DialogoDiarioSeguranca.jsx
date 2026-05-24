import { useState, useRef, useCallback } from 'react'
import Header             from '../components/Header'
import Footer             from '../components/Footer'
import CruzSegurancaModal from '../components/CruzSegurancaModal'
import { TEMAS }          from '../data/temasDDS'
import { useFullscreen }  from '../hooks/useFullscreen'
import { useVideoSound }  from '../hooks/useVideoSound'
import '../styles/Styledds.css'

export default function DialogoDiarioSeguranca() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [cruzOpen, setCruzOpen] = useState(false)
  const videoRef = useRef(null)
  const iframeRef = useRef(null)
  const { muted, alternarSom } = useVideoSound(videoRef)

  const active = TEMAS[activeIdx]

  const carregarTema = useCallback((idx) => {
    setActiveIdx(idx)
    if (videoRef.current) {
      videoRef.current.src = TEMAS[idx].video
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const solicitarTelaCheia = useFullscreen()

  return (
    <>
      <Header title="Diálogo Diário de Segurança — DDS" />

      <CruzSegurancaModal open={cruzOpen} onClose={() => setCruzOpen(false)} />

      <main className="dds-main">

        {/* ASIDE: botoes oblongos dos temas DDS */}
        <aside className="dds-aside">
          <div className="section-title">
            <h4>Temas DDS</h4>
          </div>
          <div className="dds-doc-list">
            {TEMAS.map((t, i) => (
              <button
                key={t.label}
                className={`dds-doc-btn${activeIdx === i ? ' active' : ''}`}
                onClick={() => carregarTema(i)}
              >
                <span className="dds-doc-icon">{t.icon}</span>
                <span className="dds-doc-label">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="dds-aside-footer">
            <button className="dds-btn-cruz" onClick={() => setCruzOpen(true)}>
              ✚ Cruz de Segurança — Departamentos
            </button>
          </div>
        </aside>

        {/* CONTEUDO: doc + video lado a lado */}
        <section className="dds-content">

          <div className="section-title dds-content-title">
            <h4>{active.title}</h4>
          </div>

          <div className="dds-viewer-row">

            {/* Viewer de documento */}
            <div className="dds-doc-viewer box show">
              <div className="dds-viewer-header">
                <span className="dds-viewer-label">📄 Material DDS</span>
                <button
                  className="btn-fullscreen"
                  title="Tela cheia"
                  onClick={() => solicitarTelaCheia(iframeRef)}
                  style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
                >⛶</button>
              </div>
              <div className="dds-frame-wrap">
                <iframe ref={iframeRef} src={active.doc} title="Material DDS" />
              </div>
            </div>

            {/* Viewer de video */}
            <div className="dds-video-viewer box show">
              <div className="dds-viewer-header">
                <span className="dds-viewer-label">🎬 Vídeo DDS</span>
                <div className="dds-video-btns">
                  <button
                    className="btn-floating-sound"
                    title="Som"
                    style={{ position: 'static' }}
                    onClick={alternarSom}
                    aria-label={muted ? 'Ativar som' : 'Desativar som'}
                  >{muted ? '🔇' : '🔊'}</button>
                  <button
                    className="btn-fullscreen"
                    title="Tela cheia"
                    onClick={() => solicitarTelaCheia(videoRef)}
                    style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
                  >⛶</button>
                </div>
              </div>
              <div className="dds-frame-wrap">
                <video
                  ref={videoRef}
                  src={active.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>

          </div>

          <div className="dds-actions">
            <button className="dds-btn-cruz-inline" onClick={() => setCruzOpen(true)}>
              ✚ Visualizar Cruz de Segurança — Departamentos
            </button>
          </div>

        </section>
      </main>

      <Footer />
    </>
  )
}
