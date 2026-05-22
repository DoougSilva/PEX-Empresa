import { useState } from 'react'

const DEPTS = [
  { key: 'geral',      label: 'Geral'       },
  { key: 'linha1',     label: 'Linha 1'     },
  { key: 'linha2',     label: 'Linha 2'     },
  { key: 'qualidade',  label: 'Qualidade'   },
  { key: 'logistica',  label: 'Logística'   },
  { key: 'manutencao', label: 'Manutenção'  },
]

export default function CruzSegurancaModal({ open, onClose }) {
  const [dept, setDept]   = useState('geral')
  const [imgOk, setImgOk] = useState(true)

  if (!open) return null

  const src = `/img/cruz/${dept}.png`

  const handleDept = (key) => {
    setDept(key)
    setImgOk(true)   // re-try image each time dept changes
  }

  return (
    <div
      className="overlay-cruz active"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="cruz-modal" role="dialog" aria-modal="true">

        <div className="cruz-modal-header">
          <span>✚ Cruz de Segurança — Departamentos</span>
          <button className="btn-cruz-close" onClick={onClose} title="Fechar" aria-label="Fechar">✕</button>
        </div>

        <div className="cruz-dept-row">
          {DEPTS.map(d => (
            <button
              key={d.key}
              className={`cruz-dept-btn ${dept === d.key ? 'active' : ''}`}
              onClick={() => handleDept(d.key)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="cruz-img-wrap">
          {imgOk
            ? (
              <img
                src={src}
                alt="Cruz de Segurança"
                onError={() => setImgOk(false)}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            )
            : (
              <div className="cruz-fallback" style={{ display: 'flex' }}>
                <div className="cruz-shape">
                  <div className="cruz-cell cruz-top">🔝<br /><small>Último<br />Acidente</small></div>
                  <div className="cruz-row-mid">
                    <div className="cruz-cell cruz-left">◀<br /><small>Dias sem<br />Acidente</small></div>
                    <div className="cruz-cell cruz-center">✚<br /><small>Cruz de<br />Segurança</small></div>
                    <div className="cruz-cell cruz-right">▶<br /><small>Próxima<br />Meta</small></div>
                  </div>
                  <div className="cruz-cell cruz-bottom">🔽<br /><small>Observações</small></div>
                </div>
                <p className="cruz-fallback-msg">
                  Adicione a imagem em <code>img/cruz/{dept}.png</code>
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
