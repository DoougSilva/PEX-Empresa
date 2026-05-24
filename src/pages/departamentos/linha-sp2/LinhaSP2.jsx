import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { LINHAS } from '../../../data/linhas'
import { useScrollReveal } from '../../../hooks/useScrollReveal'
import '../../../styles/StyleSP2.css'

export default function LinhaSP2() {
  const navigate = useNavigate()
  const containerRef = useRef(null)

  useScrollReveal(containerRef, { staggerDelay: 80 })

  return (
    <>
      <Header title="Fábrica II — Linhas de Produção" />

      <main className="sp2-page-main">
        <div className="section-header">
          <h4>Selecione a Linha</h4>
        </div>

        <div className="container" ref={containerRef}>
          {LINHAS.map((linha) => (
            <div className="box" key={linha.label}>
              <img src="/img/Portas.jpg" alt={linha.label} loading="lazy" />
              <div className="box-content">
                <p>Montagem dos produtos CRM39 · BRM45 · BRM54</p>
                <button
                  type="button"
                  onClick={() => linha.to && navigate(linha.to)}
                  disabled={!linha.to}
                  style={!linha.to ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  {linha.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
