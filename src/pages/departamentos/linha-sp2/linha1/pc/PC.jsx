import { useState, useRef, useCallback } from 'react'
import Header          from '../../../../../components/Header'
import Footer          from '../../../../../components/Footer'
import AssinaturaModal from '../../../../../components/AssinaturaModal'
import ConfirmModal    from '../../../../../components/ConfirmModal'
import { useLocalStorage } from '../../../../../hooks/useLocalStorage'
import { useFullscreen }   from '../../../../../hooks/useFullscreen'
import { CONTEUDOS, PDS }  from '../../../../../data/conteudosPD'
import { exportarExcel }   from '../../../../../utils/exportarExcel'
import '../../../../../styles/styleIlhas.css'

export default function PC() {
  const [assinaturas, setAssinaturas] = useLocalStorage('assinaturas_PC_L1F2', {})
  const [pdAtual, setPdAtual] = useState(null)
  const [modelo, setModelo] = useState(null)
  const [docSrc, setDocSrc] = useState('')
  const [videoSrc, setVideoSrc] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [deleteKey, setDeleteKey] = useState(null)
  const [printPd, setPrintPd] = useState(null)
  const videoRef = useRef(null)
  const docViewRef = useRef(null)
  const pdRowRef = useRef(null)
  const printPdRowRef = useRef(null)

  /* ── scroll do carrossel de PDs ── */
  const scrollPDs = useCallback((dir) => {
    pdRowRef.current?.scrollBy({ left: dir * 120, behavior: 'smooth' })
  }, [])

  const scrollPrintPDs = useCallback((dir) => {
    printPdRowRef.current?.scrollBy({ left: dir * 100, behavior: 'smooth' })
  }, [])

  /* ── abrir seletor de modelos ── */
  const abrirModelos = useCallback((pd) => {
    setPdAtual(pd)
    setShowOverlay(true)
  }, [])

  /* ── carregar conteudo apos selecionar modelo ── */
  const carregarConteudo = useCallback((pd, m) => {
    const c = CONTEUDOS[pd][m]
    setDocSrc(c.doc)
    setVideoSrc(c.video)
    setModelo(m)
    setPdAtual(pd)
    setShowOverlay(false)
  }, [])

  /* ── controles de video ── */
  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.paused ? v.play() : v.pause()
  }, [])

  const toggleSound = useCallback(() => {
    const v = videoRef.current
    if (v) v.muted = !v.muted
  }, [])

  const solicitarTelaCheia = useFullscreen()

  /* ── assinatura (usa updater function para evitar estado stale) ── */
  const salvarAssinatura = useCallback((dados) => {
    setAssinaturas(prev => ({
      ...prev,
      [pdAtual]: [...(prev[pdAtual] || []), { ...dados, modelo }]
    }))
  }, [pdAtual, modelo, setAssinaturas])

  /* ── exclusao ── */
  const confirmarDelete = useCallback(() => {
    if (!deleteKey) return
    const { pd, idx } = deleteKey
    setAssinaturas(prev => {
      const lista = [...(prev[pd] || [])]
      lista.splice(idx, 1)
      return { ...prev, [pd]: lista }
    })
    setDeleteKey(null)
  }, [deleteKey, setAssinaturas])

  /* ── exportar Excel ── */
  const handleExportarExcel = useCallback(() => {
    const pdNum = pdAtual?.replace('pd', '') || ''
    const lista = assinaturas[pdAtual] || []
    if (!lista.length) return
    exportarExcel({
      cabecalho: [
        ['Treinamento On The Job — Whirlpool'],
        ['Preparação de Caixas — Linha 1'],
        [`PD: pd${pdNum}   Modelo: ${modelo}   Data: ${new Date().toLocaleDateString('pt-BR')}`],
        [],
      ],
      colunas: ['Modelo', 'Nome', 'RE', 'Turno', 'Tipo', 'Data'],
      dados: lista.map(a => [a.modelo, a.nome, a.re, a.turno, a.tipo, a.data]),
      nomeArquivo: `Treinamento_PC_pd${pdNum}.xlsx`,
      nomeAba: `PD${pdNum}`,
    })
  }, [pdAtual, modelo, assinaturas])

  const listaImpressao = printPd ? (assinaturas[printPd] || []) : []

  return (
    <>
      <Header title="Preparação de Caixas — Linha 1" />

      {/* ── OVERLAY: selecao de modelo ── */}
      {showOverlay && (
        <div
          className="overlay active"
          role="dialog"
          aria-modal="true"
          aria-label="Selecione o Modelo"
          onClick={e => { if (e.target === e.currentTarget) setShowOverlay(false) }}
        >
          <div className="model-box">
            <h3>Selecione o Modelo</h3>
            <div className="model-options">
              {pdAtual && Object.keys(CONTEUDOS[pdAtual]).map(m => (
                <button key={m} type="button" onClick={() => carregarConteudo(pdAtual, m)}>{m}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AssinaturaModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onConfirm={salvarAssinatura}
        docLabel={pdAtual ? `${pdAtual.toUpperCase()} · ${modelo}` : ''}
      />

      <ConfirmModal
        open={!!deleteKey}
        message="Deseja realmente excluir esta assinatura?"
        onConfirm={confirmarDelete}
        onCancel={() => setDeleteKey(null)}
      />

      {/* ── MAIN LAYOUT ── */}
      <main className="main-layout">

        {/* LADO ESQUERDO: documento */}
        <section className="doc-area">

          <div className="section-title">
            <h4>Selecione o PD</h4>
          </div>

          {/* ── Carrossel de PDs com setas ── */}
          <div className="pd-carousel">
            <button
              className="pd-arrow pd-arrow-left"
              type="button"
              onClick={() => scrollPDs(-1)}
              aria-label="Rolar esquerda"
            >‹</button>

            <div className="boxes-row" ref={pdRowRef}>
              {PDS.map(pd => (
                <button
                  key={pd}
                  className={`box-pd ${pdAtual === pd ? 'active' : ''}`}
                  type="button"
                  onClick={() => abrirModelos(pd)}
                >
                  {pd.replace('pd', 'PD')}
                </button>
              ))}
            </div>

            <button
              className="pd-arrow pd-arrow-right"
              type="button"
              onClick={() => scrollPDs(1)}
              aria-label="Rolar direita"
            >›</button>
          </div>

          {/* viewer de documento */}
          <div className="document-view" ref={docViewRef}>
            {docSrc
              ? <iframe src={docSrc} title="Visualizador de Documento" />
              : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', opacity:.4, flexDirection:'column', gap:8 }}>
                  <span style={{ fontSize:42 }}>📄</span>
                  <p style={{ fontSize:13 }}>Selecione um PD e modelo</p>
                </div>
            }
            <button className="btn-fullscreen" onClick={() => solicitarTelaCheia(docViewRef)} title="Tela cheia">⛶</button>
          </div>

        </section>

        {/* LADO DIREITO: video */}
        <section className="video-area">
          <div className="video-container">
            {videoSrc
              ? <video ref={videoRef} muted autoPlay loop playsInline src={videoSrc} />
              : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', opacity:.4, flexDirection:'column', gap:8 }}>
                  <span style={{ fontSize:42 }}>🎬</span>
                  <p style={{ fontSize:13 }}>Selecione um PD e modelo</p>
                </div>
            }
            <div className="video-controls">
              <button type="button" onClick={togglePlay} title="Play/Pause">▶</button>
              <button type="button" onClick={toggleSound} title="Som">🔊</button>
              <button type="button" onClick={() => solicitarTelaCheia(videoRef)} title="Tela cheia">⛶</button>
            </div>
          </div>
        </section>

      </main>

      {/* ── BOTAO ASSINAR ── */}
      <div className="assinatura-area">
        <button
          className="btn-assinar"
          disabled={!docSrc}
          onClick={() => setShowForm(true)}
        >
          ✍ Assinar Documento
        </button>
      </div>

      {/* ── BARRA EXPORTAR + PAINEL IMPRESSAO ── */}
      <div className="export-print-bar">

        <button className="btn-exportar" onClick={handleExportarExcel}>
          📥 Exportar para Excel
        </button>

        <div className="print-panel">
          <span className="print-label">Folha de assinatura:</span>

          <div className="print-pd-carousel">
            <button
              className="pd-arrow pd-arrow-left"
              type="button"
              onClick={() => scrollPrintPDs(-1)}
            >‹</button>

            <div className="print-pd-row" ref={printPdRowRef}>
              {PDS.map(pd => (
                <button
                  key={pd}
                  type="button"
                  className={`box-pd box-pd-sm ${printPd === pd ? 'active' : ''}`}
                  onClick={() => setPrintPd(pd)}
                >
                  {pd.replace('pd', 'PD')}
                </button>
              ))}
            </div>

            <button
              className="pd-arrow pd-arrow-right"
              type="button"
              onClick={() => scrollPrintPDs(1)}
            >›</button>
          </div>

          <button
            className="btn-imprimir"
            disabled={!printPd || listaImpressao.length === 0}
            onClick={() => window.print()}
            title={!printPd ? 'Selecione um PD' : listaImpressao.length === 0 ? 'Sem registros' : 'Imprimir'}
          >
            🖨 Imprimir
          </button>
        </div>
      </div>

      {/* ── TABELAS PD ── */}
      <section className="tabelas-pd">
        {PDS.map(pd => {
          const lista = assinaturas[pd] || []
          const visivel = printPd ? printPd === pd : pdAtual === pd
          return (
            <table
              key={pd}
              className={`tabelaPD${visivel ? ' visible' : ''}`}
            >
              <thead>
                <tr>
                  <th>Modelo</th><th>Nome</th><th>RE</th>
                  <th>Turno</th><th>Tipo</th><th>Data</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lista.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign:'center', opacity:.5, fontStyle:'italic', padding:20 }}>Sem registros.</td></tr>
                  : lista.map((a, i) => (
                    <tr key={`${a.re}-${a.data}-${i}`}>
                      <td>{a.modelo}</td>
                      <td>{a.nome}</td>
                      <td>{a.re}</td>
                      <td>{a.turno}</td>
                      <td>{a.tipo}</td>
                      <td>{a.data}</td>
                      <td>
                        <button
                          className="btn-lixeira"
                          type="button"
                          title="Excluir"
                          onClick={() => setDeleteKey({ pd, idx: i })}
                        >🗑</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )
        })}
      </section>

      <Footer />
    </>
  )
}
