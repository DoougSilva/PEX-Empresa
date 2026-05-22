import { useRef, useState, useEffect } from 'react'

/**
 * VideoCarousel
 * Props:
 *  - videos: string[]  — array of video src paths
 *  - sticky?: boolean  — adds sticky positioning (Linhas page)
 *  - autoAdvance?: boolean — auto-advance when video ends (default true)
 *  - showControls?: boolean — show prev/next buttons (default true)
 */
export default function VideoCarousel({
  videos = [],
  sticky = false,
  autoAdvance = true,
  showControls = true,
}) {
  const trackRef = useRef(null)
  const videoRefs = useRef([])
  const [idx, setIdx]     = useState(0)
  const [muted, setMuted] = useState(true)

  // slide to current index
  useEffect(() => {
    if (!trackRef.current) return
    trackRef.current.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1)'
    trackRef.current.style.transform  = `translateX(-${idx * 100}%)`
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === idx) { v.currentTime = 0; v.play().catch(() => {}) }
      else v.pause()
    })
  }, [idx])

  // sync mute state
  useEffect(() => {
    videoRefs.current.forEach(v => { if (v) v.muted = muted })
  }, [muted])

  const prev = () => setIdx(i => (i - 1 + videos.length) % videos.length)
  const next = () => setIdx(i => (i + 1) % videos.length)

  const containerStyle = sticky
    ? {
        position: 'sticky',
        top: 'calc(var(--header-h) + 28px)',
        height: 'calc(100vh - var(--header-h) - 80px)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--blur)',
      }
    : {}

  return (
    <div className="video-box-container" style={containerStyle}>
      {/* Sound button — absolute top-right */}
      <button
        className="btn-floating-sound"
        onClick={() => setMuted(m => !m)}
        title="Som"
        aria-label={muted ? 'Ativar som' : 'Desativar som'}
        style={showControls ? {} : { position: 'absolute' }}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {/* Track */}
      <div
        className="video-track"
        ref={trackRef}
        style={sticky ? { flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' } : {}}
      >
        {videos.map((src, i) => (
          <div
            key={i}
            className="video-item"
            style={sticky ? { minWidth: '100%', flexShrink: 0, height: '100%' } : {}}
          >
            <video
              ref={el => (videoRefs.current[i] = el)}
              src={src}
              muted={muted}
              autoPlay={i === 0}
              playsInline
              loop={!autoAdvance}
              onEnded={autoAdvance ? next : undefined}
              style={sticky ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="video-controls">
          <button className="btn-carousel btn-prev" onClick={prev} aria-label="Anterior">❮</button>
          <button
            className="btn-floating-sound"
            onClick={() => setMuted(m => !m)}
            title="Som"
            style={{ position: 'static' }}
            aria-label={muted ? 'Ativar som' : 'Desativar som'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button className="btn-carousel btn-next" onClick={next} aria-label="Próximo">❯</button>
        </div>
      )}
    </div>
  )
}
