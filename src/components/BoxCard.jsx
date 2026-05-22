import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * BoxCard
 * Props:
 *  - title: string
 *  - description: string
 *  - imgSrc?: string
 *  - to?: string           — react-router path (uses navigate)
 *  - onClick?: () => void  — custom click handler (overrides `to`)
 *  - btnLabel?: string     — button text (default: "Acessar")
 *  - delay?: number        — stagger delay ms for appear animation
 *  - disabled?: boolean
 */
export default function BoxCard({
  title,
  description,
  imgSrc,
  to,
  onClick,
  btnLabel = 'Acessar',
  delay = 0,
  disabled = false,
}) {
  const boxRef   = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      boxRef.current?.classList.add('show')
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  const handleClick = () => {
    if (disabled) return
    if (onClick) { onClick(); return }
    if (to) navigate(to)
  }

  return (
    <div className="box" ref={boxRef}>
      {imgSrc && <img src={imgSrc} alt={title} loading="lazy" />}
      <div className="box-content">
        {title && <h2>{title}</h2>}
        {description && <p>{description}</p>}
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  )
}
