import { useState, useRef } from 'react'
import Header             from '../components/Header'
import Footer             from '../components/Footer'
import CruzSegurancaModal from '../components/CruzSegurancaModal'
import '../styles/Styledds.css'

const TEMAS = [
  { icon: '🦺', label: 'Uso Correto de EPIs',          title: 'Uso Correto de Equipamentos de Proteção Individual', doc: 'docs/dds/EPI.pdf',         video: 'video/dds/EPI.mp4'         },
  { icon: '🔥', label: 'Prevenção de Incêndios',        title: 'Prevenção de Incêndios na Planta',                   doc: 'docs/dds/Incendio.pdf',    video: 'video/dds/Incendio.mp4'    },
  { icon: '⚡', label: 'Riscos Elétricos',              title: 'Riscos Elétricos e Bloqueio de Energia',             doc: 'docs/dds/Eletrico.pdf',    video: 'video/dds/Eletrico.mp4'    },
  { icon: '🏗️', label: 'Ordem e Limpeza — 5S',         title: 'Ordem e Limpeza — Metodologia 5S',                   doc: 'docs/dds/5S.pdf',          video: 'video/dds/5S.mp4'          },
  { icon: '🤸', label: 'Ergonomia e Postura',           title: 'Ergonomia e Postura Correta no Trabalho',            doc: 'docs/dds/Ergonomia.pdf',   video: 'video/dds/Ergonomia.mp4'   },
  { icon: '🚨', label: 'Quase Acidentes — Near Miss',   title: 'Quase Acidentes — Near Miss: Como Reportar',         doc: 'docs/dds/NearMiss.pdf',    video: 'video/dds/NearMiss.mp4'    },
  { icon: '🧠', label: 'Saúde Mental no Trabalho',      title: 'Saúde Mental e Bem-estar no Ambiente de Trabalho',   doc: 'docs/dds/SaudeMental.pdf', video: 'video/dds/SaudeMental.mp4' },
  { icon: '🚗', label: 'Segurança no Trânsito',         title: 'Segurança no Trânsito — Dentro e Fora da Fábrica',  doc: 'docs/dds/Transito.pdf',    video: 'video/dds/Transito.mp4'    },
]

const DEPTS = [
  { key: 'geral',      label: 'Geral'      },
  { key: 'linha1',     label: 'Linha 1'    },
  { key: 'linha2',     label: 'Linha 2'    },
  { key: 'qualidade',  label: 'Qualidade'  },
  { key: 'logistica',  label: 'Logística'  },
  { key: 'manutencao', label: 'Manutenção' },
]

export default function DialogoDiarioSeguranca() {
  const [activeIdx,  setActiveIdx]  = useState(0)
  const [muted,      setMuted]      = useState(true)
  const [cruzOpen,   setCruzOpen]   = useState(false)
  const [cruzDept,   setCruzDept]   = useState('geral')
  const [cruzImgOk,  setCruzImgOk]  = useState(true)
  const videoRef = useRef(null)

  const active = TEMAS[activeIdx]

  /* ── carregar tema ── */
  function loadDDS(idx) {
    setActiveIdx(idx)
    if (videoRef.current) {
      videoRef.current.src = TEMAS[idx].video
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }

  /* ── som ── */
  function toggleSound() {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  /* ── fullscreen ── */
  function toggleFullscreen(id) {
    const el = document.getElementById(id)
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {})
    else document.exitFullscreen()
  }

  /* ── troca departamento na cruz ── */
  function switchDept(key) {
    setCruzDept(key)
    setCruzImgOk(true)
  }

  return (
    <>
      <Header title="Diálogo Diário de Segurança — DDS" />

      {/* ── MODAL CRUZ DE SEGURANÇA (componente global) ── */}
      <CruzSegurancaModal open={cruzOpen} onClose={() => setCruzOpen(false)} />

      {/* ── MAIN (estrutura idêntica ao HTML original) ── */}
      <main className="dds-main">

        {/* ASIDE: botões oblongos dos temas DDS */}
        <aside className="dds-aside">
          <div className="section-title">
            <h4>Temas DDS</h4>
          </div>
          <div className="dds-doc-list" id="docList">
            {TEMAS.map((t, i) => (
              <button
                key={i}
                className={`dds-doc-btn${activeIdx === i ? ' active' : ''}`}
                onClick={() => loadDDS(i)}
              >
                <span className="dds-doc-icon">{t.icon}</span>
                <span className="dds-doc-label">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Botão Cruz de Segurança */}
          <div className="dds-aside-footer">
            <button className="dds-btn-cruz" onClick={() => setCruzOpen(true)}>
              ✚ Cruz de Segurança — Departamentos
            </button>
          </div>
        </aside>

        {/* CONTEÚDO: doc + vídeo lado a lado */}
        <section className="dds-content">

          <div className="section-title dds-content-title">
            <h4 id="ddsActiveTitle">{active.title}</h4>
          </div>

          <div className="dds-viewer-row">

            {/* Viewer de documento */}
            <div className="dds-doc-viewer box show" id="docViewer">
              <div className="dds-viewer-header">
                <span className="dds-viewer-label">📄 Material DDS</span>
                <button
                  className="btn-fullscreen"
                  title="Tela cheia"
                  onClick={() => toggleFullscreen('docFrame')}
                  style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
                >⛶</button>
              </div>
              <div className="dds-frame-wrap">
                <iframe id="docFrame" src={active.doc} title="Material DDS" />
                <div className="dds-placeholder" id="docPH" style={{ display: 'none' }}>
                  <span>📄</span>
                  <p>Selecione um tema no painel lateral</p>
                </div>
              </div>
            </div>

            {/* Viewer de vídeo */}
            <div className="dds-video-viewer box show" id="videoViewer">
              <div className="dds-viewer-header">
                <span className="dds-viewer-label">🎬 Vídeo DDS</span>
                <div className="dds-video-btns">
                  <button
                    className="btn-floating-sound"
                    id="btnSound"
                    title="Som"
                    style={{ position: 'static' }}
                    onClick={toggleSound}
                  >{muted ? '🔇' : '🔊'}</button>
                  <button
                    className="btn-fullscreen"
                    title="Tela cheia"
                    onClick={() => toggleFullscreen('ddsVideo')}
                    style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
                  >⛶</button>
                </div>
              </div>
              <div className="dds-frame-wrap">
                <video
                  id="ddsVideo"
                  ref={videoRef}
                  src={active.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="dds-placeholder" id="videoPH" style={{ display: 'none' }}>
                  <span>🎬</span>
                  <p>Vídeo do tema selecionado</p>
                </div>
              </div>
            </div>

          </div>{/* /.dds-viewer-row */}

          {/* Ação única: botão Cruz inline */}
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
