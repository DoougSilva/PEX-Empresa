import { useRef, useId } from 'react'
import { useFullscreen } from '../hooks/useFullscreen'
import { useVideoSound } from '../hooks/useVideoSound'

/**
 * DocVideoViewer
 * Props:
 *  - docSrc: string    — iframe src (PDF path)
 *  - videoSrc: string  — video src
 *  - docLabel?: string
 *  - videoLabel?: string
 *  - showPlaceholder?: boolean
 *  - rowClass?: string  — extra CSS class on the row wrapper
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
  const iframeRef = useRef(null)
  const uid = useId()
  const solicitarTelaCheia = useFullscreen()
  const { muted, alternarSom } = useVideoSound(videoRef)

  return (
    <div className={`dds-viewer-row ${rowClass}`}>

      {/* ── PDF Viewer ── */}
      <div className="dds-doc-viewer box show">
        <div className="dds-viewer-header">
          <span className="dds-viewer-label">{docLabel}</span>
          <button
            className="btn-fullscreen"
            onClick={() => solicitarTelaCheia(iframeRef)}
            title="Tela cheia"
            style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
          >⛶</button>
        </div>
        <div className="dds-frame-wrap">
          {docSrc
            ? <iframe ref={iframeRef} id={`${uid}-iframe`} src={docSrc} title={docLabel} />
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
              onClick={alternarSom}
              title="Som"
              style={{ position: 'static' }}
              aria-label={muted ? 'Ativar som' : 'Desativar som'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              className="btn-fullscreen"
              onClick={() => solicitarTelaCheia(videoRef)}
              title="Tela cheia"
              style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
            >⛶</button>
          </div>
        </div>
        <div className="dds-frame-wrap">
          {videoSrc
            ? <video
                id={`${uid}-video`}
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
