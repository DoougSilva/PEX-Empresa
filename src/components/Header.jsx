import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/navigation'

export default function Header({ title }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <header>
        <img
          src="/icons/LOGOWHIRLPOOL.png"
          alt="Logo Whirlpool"
          className="logotype"
        />
        <span className="header-title">{title}</span>
        <button
          className="menu-toggle"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={open}
          style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0, minHeight: 'unset' }}
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {/* overlay escuro */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
            zIndex: 998, backdropFilter: 'blur(2px)'
          }}
          onClick={() => setOpen(false)}
        />
      )}

      <nav id="menu" className={open ? 'active' : ''}>
        <ul>
          {NAV_LINKS.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={pathname === l.to ? 'active-nav' : ''}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
