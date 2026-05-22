import { useState } from 'react'

/**
 * AssinaturaModal — replica exata dos overlays do HTML original
 *
 * Props:
 *  - open      : boolean
 *  - onClose   : () => void
 *  - onConfirm : (dados) => void
 *  - docLabel  : string   — campo readonly exibido no form
 *  - variant   : 'pc' | 'ps'   (default: 'pc')
 *      'pc' → Nome, RE, Turno, Tipo de Treinamento, Documento (readonly)
 *      'ps' → Nome, Matrícula, Área/Turno, Documento (readonly), Data
 */
export default function AssinaturaModal({ open, onClose, onConfirm, docLabel, variant = 'pc' }) {
  const [nome,   setNome]   = useState('')
  const [re,     setRe]     = useState('')
  const [turno,  setTurno]  = useState('')
  const [tipo,   setTipo]   = useState('')
  const [area,   setArea]   = useState('')
  const [data,   setData]   = useState(() => new Date().toISOString().split('T')[0])

  if (!open) return null

  function reset() {
    setNome(''); setRe(''); setTurno(''); setTipo(''); setArea('')
    setData(new Date().toISOString().split('T')[0])
  }

  function handleCancel() { reset(); onClose() }

  function handleConfirm() {
    if (variant === 'pc') {
      if (!nome.trim() || !re.trim() || !turno.trim() || !tipo) return
      onConfirm({
        nome: nome.trim(), re: re.trim(), turno: turno.trim(), tipo,
        doc: docLabel, data: new Date().toLocaleDateString('pt-BR')
      })
    } else {
      // ps variant
      if (!nome.trim() || !re.trim() || !area.trim()) return
      onConfirm({
        nome: nome.trim(), re: re.trim(), turno: area.trim(),
        doc: docLabel, data: formatarData(data)
      })
    }
    reset(); onClose()
  }

  function formatarData(d) {
    if (!d) return new Date().toLocaleDateString('pt-BR')
    const [y, m, dd] = d.split('-')
    return `${dd}/${m}/${y}`
  }

  return (
    <div
      className="overlay-form active"
      onClick={e => { if (e.target === e.currentTarget) handleCancel() }}
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
          <button type="button" onClick={handleConfirm} style={{ flex: 1, textAlign: 'center' }}>
            Confirmar
          </button>
          <button
            type="button" onClick={handleCancel}
            style={{ flex: 1, textAlign: 'center', background: 'rgba(230,57,70,0.15)', color: '#e63946', borderColor: 'rgba(230,57,70,0.4)' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
