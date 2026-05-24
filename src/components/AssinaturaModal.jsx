import { useState } from 'react'
import { useEscapeKey } from '../hooks/useEscapeKey'

export default function AssinaturaModal({ open, onClose, onConfirm, docLabel, variant = 'pc' }) {
  const [nome, setNome] = useState('')
  const [re, setRe] = useState('')
  const [turno, setTurno] = useState('')
  const [tipo, setTipo] = useState('')
  const [area, setArea] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0])
  const [abriuAnterior, setAbriuAnterior] = useState(false)

  if (open && !abriuAnterior) {
    setAbriuAnterior(true)
    setNome('')
    setRe('')
    setTurno('')
    setTipo('')
    setArea('')
    setData(new Date().toISOString().split('T')[0])
  }
  if (!open && abriuAnterior) {
    setAbriuAnterior(false)
  }

  // ESC para fechar
  useEscapeKey(open, onClose)

  if (!open) return null

  function formatarData(d) {
    if (!d) return new Date().toLocaleDateString('pt-BR')
    const [y, m, dd] = d.split('-')
    return `${dd}/${m}/${y}`
  }

  function validarEConfirmar() {
    if (variant === 'pc') {
      if (!nome.trim() || !re.trim() || !turno.trim() || !tipo) return
      onConfirm({
        nome: nome.trim(), re: re.trim(), turno: turno.trim(), tipo,
        doc: docLabel, data: new Date().toLocaleDateString('pt-BR')
      })
    } else {
      if (!nome.trim() || !re.trim() || !area.trim()) return
      onConfirm({
        nome: nome.trim(), re: re.trim(), turno: area.trim(),
        doc: docLabel, data: formatarData(data)
      })
    }
    onClose()
  }

  return (
    <div
      className="overlay-form active"
      role="dialog"
      aria-modal="true"
      aria-label={variant === 'pc' ? 'Assinar Documento' : 'Registrar Assinatura'}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="form-box">
        {variant === 'pc'
          ? <h3>✍️ Assinar Documento</h3>
          : <h3>✍️ Registrar Assinatura</h3>
        }

        <label htmlFor="as-nome">Nome completo</label>
        <input
          id="as-nome" type="text" value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex.: João Silva" autoComplete="name"
        />

        {variant === 'pc' ? (
          <>
            <label htmlFor="as-re">RE / Matrícula</label>
            <input
              id="as-re" type="text" value={re}
              onChange={e => setRe(e.target.value)}
              placeholder="Ex.: WH-00123"
            />

            <label htmlFor="as-turno">Turno</label>
            <input
              id="as-turno" type="text" value={turno}
              onChange={e => setTurno(e.target.value)}
              placeholder="Ex.: A, B ou C"
            />

            <label htmlFor="as-tipo">Tipo de Treinamento</label>
            <select id="as-tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="">Selecione…</option>
              <option value="Aprendizagem">Aprendizagem</option>
              <option value="Reciclagem 1">Reciclagem 1</option>
              <option value="Reciclagem 2">Reciclagem 2</option>
              <option value="Integração">Integração</option>
            </select>
          </>
        ) : (
          <>
            <label htmlFor="as-mat">Matrícula</label>
            <input
              id="as-mat" type="text" value={re}
              onChange={e => setRe(e.target.value)}
              placeholder="Ex.: WH-00123"
            />

            <label htmlFor="as-area">Área / Turno</label>
            <input
              id="as-area" type="text" value={area}
              onChange={e => setArea(e.target.value)}
              placeholder="Ex.: Linha 3 / Turno A"
            />
          </>
        )}

        <label htmlFor="as-doc">Documento</label>
        <input id="as-doc" type="text" value={docLabel} readOnly />

        {variant === 'ps' && (
          <>
            <label htmlFor="as-data">Data</label>
            <input
              id="as-data" type="date" value={data}
              onChange={e => setData(e.target.value)}
            />
          </>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="button" onClick={validarEConfirmar} style={{ flex: 1, textAlign: 'center' }}>
            Confirmar
          </button>
          <button
            type="button" onClick={onClose}
            style={{ flex: 1, textAlign: 'center', background: 'rgba(230,57,70,0.15)', color: '#e63946', borderColor: 'rgba(230,57,70,0.4)' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
