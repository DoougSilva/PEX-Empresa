import { useState, useRef, useCallback } from 'react'
import Header        from '../components/Header'
import Footer        from '../components/Footer'
import AssinaturaModal from '../components/AssinaturaModal'
import ConfirmModal    from '../components/ConfirmModal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DOCS }          from '../data/docsSeguranca'
import { useFullscreen }  from '../hooks/useFullscreen'
import { useVideoSound }  from '../hooks/useVideoSound'
import { exportarExcel }  from '../utils/exportarExcel'
import '../styles/Styleps.css'

export default function ProcedimentosSeguranca() {
  const [assinaturas, setAssinaturas] = useLocalStorage('assinaturas_PS', [])
  const [activeIdx, setActiveIdx] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [deleteIdx, setDeleteIdx] = useState(null)
  const videoRef = useRef(null)
  const iframeRef = useRef(null)
  const { muted, alternarSom } = useVideoSound(videoRef)

  const active = DOCS[activeIdx]

  /* ── troca documento ── */
  const carregarDocumento = useCallback((idx) => {
    setActiveIdx(idx)
    if (videoRef.current) {
      videoRef.current.src = DOCS[idx].video
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [])

  /* ── fullscreen ── */
  const solicitarTelaCheia = useFullscreen()

  /* ── salvar assinatura ── */
  const salvarAssinatura = useCallback((dados) => {
    setAssinaturas(prev => [...prev, dados])
  }, [setAssinaturas])

  /* ── deletar ── */
  const confirmarDelete = useCallback(() => {
    setAssinaturas(prev => prev.filter((_, i) => i !== deleteIdx))
    setDeleteIdx(null)
  }, [deleteIdx, setAssinaturas])

  /* ── exportar Excel ── */
  const handleExportarExcel = useCallback(() => {
    if (!assinaturas.length) return
    exportarExcel({
      cabecalho: [
        ['Procedimentos de Segurança — Whirlpool'],
        [`Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}`],
        [],
      ],
      colunas: ['#', 'Nome', 'Matrícula', 'Área / Turno', 'Documento', 'Data'],
      dados: assinaturas.map((a, i) => [i + 1, a.nome, a.re, a.turno, a.doc, a.data]),
      nomeArquivo: 'Assinaturas_ProcedimentosSeguranca.xlsx',
      nomeAba: 'Assinaturas',
      larguraColunas: [{ wch: 4 }, { wch: 28 }, { wch: 14 }, { wch: 22 }, { wch: 44 }, { wch: 12 }],
      merges: [{ s: { r:0,c:0 }, e: { r:0,c:5 } }, { s: { r:1,c:0 }, e: { r:1,c:5 } }],
    })
  }, [assinaturas])

  return (
    <>
      <Header title="Procedimentos de Segurança" />

      <AssinaturaModal variant="ps"
        open={showForm}
        onClose={() => setShowForm(false)}
        onConfirm={salvarAssinatura}
        docLabel={active.title}
      />

      <ConfirmModal
        open={deleteIdx !== null}
        message="Esta ação não pode ser desfeita."
        onConfirm={confirmarDelete}
        onCancel={() => setDeleteIdx(null)}
      />

      <main className="ps-main">

        {/* ASIDE: botoes oblongos dos documentos */}
        <aside className="ps-aside">
          <div className="section-title">
            <h4>Documentos</h4>
          </div>
          <div className="ps-doc-list">
            {DOCS.map((d, i) => (
              <button
                key={d.label}
                className={`ps-doc-btn${activeIdx === i ? ' active' : ''}`}
                onClick={() => carregarDocumento(i)}
              >
                <span className="ps-doc-icon">{d.icon}</span>
                <span className="ps-doc-label">{d.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* CONTEUDO: doc + video lado a lado */}
        <section className="ps-content">

          <div className="section-title ps-content-title">
            <h4>{active.title}</h4>
          </div>

          <div className="ps-viewer-row">

            {/* Viewer de documento */}
            <div className="ps-doc-viewer box show">
              <div className="ps-viewer-header">
                <span className="ps-viewer-label">📄 Documento</span>
                <button
                  className="btn-fullscreen"
                  title="Tela cheia"
                  onClick={() => solicitarTelaCheia(iframeRef)}
                  style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
                >⛶</button>
              </div>
              <div className="ps-frame-wrap">
                <iframe ref={iframeRef} src={active.doc} title="Documento de Segurança" />
              </div>
            </div>

            {/* Viewer de video */}
            <div className="ps-video-viewer box show">
              <div className="ps-viewer-header">
                <span className="ps-viewer-label">🎬 Vídeo Instrucional</span>
                <div className="ps-video-btns">
                  <button
                    className="btn-floating-sound"
                    title="Som"
                    style={{ position: 'static' }}
                    onClick={alternarSom}
                    aria-label={muted ? 'Ativar som' : 'Desativar som'}
                  >{muted ? '🔇' : '🔊'}</button>
                  <button
                    className="btn-fullscreen"
                    title="Tela cheia"
                    onClick={() => solicitarTelaCheia(videoRef)}
                    style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
                  >⛶</button>
                </div>
              </div>
              <div className="ps-frame-wrap">
                <video
                  ref={videoRef}
                  src={active.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>

          </div>

          {/* Acoes */}
          <div className="ps-actions">
            <button className="btn-assinar" onClick={() => setShowForm(true)}>
              ✍️ Assinar Documento
            </button>
            <button className="btn-exportar" onClick={handleExportarExcel}>
              ⬇️ Exportar para Excel
            </button>
          </div>

        </section>
      </main>

      {/* ── TABELA DE ASSINATURAS ── */}
      <section className="tabelas-ps">
        <div className="section-title" style={{ padding: '0 24px 10px' }}>
          <h4>📝 Folha de Assinaturas</h4>
        </div>
        <div className="ps-table-wrap">
          <table className="tabelaPS">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Área / Turno</th>
                <th>Documento</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assinaturas.length === 0
                ? <tr className="empty-row"><td colSpan={7}>Nenhuma assinatura registrada.</td></tr>
                : assinaturas.map((a, i) => (
                  <tr key={`${a.re}-${a.data}-${i}`}>
                    <td>{i + 1}</td>
                    <td>{a.nome}</td>
                    <td>{a.re}</td>
                    <td>{a.turno}</td>
                    <td>{a.doc}</td>
                    <td>{a.data}</td>
                    <td>
                      <button
                        className="btn-lixeira"
                        type="button"
                        title="Remover"
                        onClick={() => setDeleteIdx(i)}
                      >🗑</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </>
  )
}
