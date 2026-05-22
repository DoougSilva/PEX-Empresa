import { useRef, useState } from 'react'

/**
 * DocVideoViewer
 * Props:
 *  - docSrc: string    — iframe src (PDF path)
 *  - videoSrc: string  — video src
 *  - docLabel?: string
 *  - videoLabel?: string
 *  - showPlaceholder?: boolean
 *  - className?: string  — extra CSS class on the row wrapper
 */
export default function DocVideoViewer({
  docSrc,
  videoSrc,
  docLabel   = '📄 Documento',
  videoLabel = '🎬 Vídeo',
  showPlaceholder = false,
  rowClass = '',
}) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const toggleSound = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  const fullscreen = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {})
    else document.exitFullscreen()
  }

  return (
    <div className={`dds-viewer-row ${rowClass}`}>

      {/* ── PDF Viewer ── */}
      <div className="dds-doc-viewer box show">
        <div className="dds-viewer-header">
          <span className="dds-viewer-label">{docLabel}</span>
          <button
            className="btn-fullscreen"
            onClick={() => fullscreen('dvw-iframe')}
            title="Tela cheia"
            style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
          >⛶</button>
        </div>
        <div className="dds-frame-wrap">
          {docSrc
            ? <iframe id="dvw-iframe" src={docSrc} title={docLabel} />
            : showPlaceholder && (
              <div className="dds-placeholder">
                <span>📄</span><p>Selecione um item no painel lateral</p>
              </div>
            )
          }
        </div>
      </div>

      {/* ── Video Viewer ── */}
      <div className="dds-video-viewer box show">
        <div className="dds-viewer-header">
          <span className="dds-viewer-label">{videoLabel}</span>
          <div className="dds-video-btns">
            <button
              className="btn-floating-sound"
              onClick={toggleSound}
              title="Som"
              style={{ position: 'static' }}
              aria-label={muted ? 'Ativar som' : 'Desativar som'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              className="btn-fullscreen"
              onClick={() => fullscreen('dvw-video')}
              title="Tela cheia"
              style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
            >⛶</button>
          </div>
        </div>
        <div className="dds-frame-wrap">
          {videoSrc
            ? <video
                id="dvw-video"
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
              />
            : showPlaceholder && (
              <div className="dds-placeholder">
                <span>🎬</span><p>Vídeo do item selecionado</p>
              </div>
            )
          }
        </div>
      </div>

    </div>
  )
}
