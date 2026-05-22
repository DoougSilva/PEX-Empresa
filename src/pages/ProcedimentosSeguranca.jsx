import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import Header        from '../components/Header'
import Footer        from '../components/Footer'
import AssinaturaModal from '../components/AssinaturaModal'
import ConfirmModal    from '../components/ConfirmModal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import '../styles/Styleps.css'

const DOCS = [
  { icon: '🛡️', label: 'NR-12 — Segurança em Máquinas',         title: 'NR-12 — Segurança em Máquinas e Equipamentos',    doc: 'docs/seguranca/NR12.pdf',              video: 'video/seguranca/NR12.mp4'              },
  { icon: '⚠️', label: 'NR-35 — Trabalho em Altura',             title: 'NR-35 — Trabalho em Altura',                      doc: 'docs/seguranca/NR35.pdf',              video: 'video/seguranca/NR35.mp4'              },
  { icon: '🔥', label: 'Plano de Emergência e Evacuação',         title: 'Plano de Emergência e Evacuação',                  doc: 'docs/seguranca/Emergencia.pdf',        video: 'video/seguranca/Emergencia.mp4'        },
  { icon: '⚡', label: 'NR-10 — Segurança em Eletricidade',      title: 'NR-10 — Segurança em Eletricidade',               doc: 'docs/seguranca/NR10.pdf',              video: 'video/seguranca/NR10.mp4'              },
  { icon: '🧤', label: 'EPI — Equipamentos de Proteção',         title: 'EPI — Equipamentos de Proteção Individual',       doc: 'docs/seguranca/EPI.pdf',               video: 'video/seguranca/EPI.mp4'               },
  { icon: '🚑', label: 'Procedimento de Primeiros Socorros',     title: 'Procedimento de Primeiros Socorros',               doc: 'docs/seguranca/PrimeirosSocorros.pdf', video: 'video/seguranca/PrimeirosSocorros.mp4' },
  { icon: '☣️', label: 'Manuseio de Produtos Químicos',          title: 'Manuseio de Produtos Químicos',                   doc: 'docs/seguranca/Quimicos.pdf',          video: 'video/seguranca/Quimicos.mp4'          },
  { icon: '📋', label: 'Permissão de Trabalho — PT',             title: 'Permissão de Trabalho — PT',                      doc: 'docs/seguranca/PT.pdf',                video: 'video/seguranca/PT.mp4'                },
]

export default function ProcedimentosSeguranca() {
  const [assinaturas, setAssinaturas] = useLocalStorage('assinaturas_PS', [])
  const [activeIdx,  setActiveIdx]    = useState(0)
  const [muted,      setMuted]        = useState(true)
  const [showForm,   setShowForm]     = useState(false)
  const [deleteIdx,  setDeleteIdx]    = useState(null)
  const videoRef = useRef(null)

  const active = DOCS[activeIdx]

  /* ── troca documento ── */
  function loadDoc(idx) {
    setActiveIdx(idx)
    // sincroniza src do vídeo diretamente (mesmo comportamento do HTML original)
    if (videoRef.current) {
      videoRef.current.src = DOCS[idx].video
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }

  /* ── som ── */
  function toggleSound() {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  /* ── fullscreen ── */
  function toggleFullscreen(id) {
    const el = document.getElementById(id)
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {})
    else document.exitFullscreen()
  }

  /* ── salvar assinatura ── */
  function salvarAssinatura(dados) {
    setAssinaturas(prev => [...prev, dados])
  }

  /* ── deletar ── */
  function confirmarDelete() {
    setAssinaturas(prev => prev.filter((_, i) => i !== deleteIdx))
    setDeleteIdx(null)
  }

  /* ── exportar Excel ── */
  function exportarExcel() {
    if (!assinaturas.length) return
    const wb   = XLSX.utils.book_new()
    const rows = [
      ['Procedimentos de Segurança — Whirlpool'],
      [`Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}`],
      [],
      ['#', 'Nome', 'Matrícula', 'Área / Turno', 'Documento', 'Data'],
      ...assinaturas.map((a, i) => [i + 1, a.nome, a.re, a.turno, a.doc, a.data]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [{ wch: 4 }, { wch: 28 }, { wch: 14 }, { wch: 22 }, { wch: 44 }, { wch: 12 }]
    ws['!merges'] = [{ s: { r:0,c:0 }, e: { r:0,c:5 } }, { s: { r:1,c:0 }, e: { r:1,c:5 } }]
    XLSX.utils.book_append_sheet(wb, ws, 'Assinaturas')
    XLSX.writeFile(wb, 'Assinaturas_ProcedimentosSeguranca.xlsx')
  }

  return (
    <>
      <Header title="Procedimentos de Segurança" />

      {/* ── OVERLAY FORMULÁRIO (componente global) ── */}
      <AssinaturaModal variant="ps"
        open={showForm}
        onClose={() => setShowForm(false)}
        onConfirm={salvarAssinatura}
        docLabel={active.title}
      />

      {/* ── OVERLAY CONFIRMAR DELETE (componente global) ── */}
      <ConfirmModal
        open={deleteIdx !== null}
        message="Esta ação não pode ser desfeita."
        onConfirm={confirmarDelete}
        onCancel={() => setDeleteIdx(null)}
      />

      {/* ── MAIN (estrutura idêntica ao HTML original) ── */}
      <main className="ps-main">

        {/* ASIDE: botões oblongos dos documentos */}
        <aside className="ps-aside">
          <div className="section-title">
            <h4>Documentos</h4>
          </div>
          <div className="ps-doc-list" id="docList">
            {DOCS.map((d, i) => (
              <button
                key={i}
                className={`ps-doc-btn${activeIdx === i ? ' active' : ''}`}
                onClick={() => loadDoc(i)}
              >
                <span className="ps-doc-icon">{d.icon}</span>
                <span className="ps-doc-label">{d.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* CONTEÚDO: doc + vídeo lado a lado */}
        <section className="ps-content">

          {/* título do documento ativo */}
          <div className="section-title ps-content-title">
            <h4 id="docActiveTitle">{active.title}</h4>
          </div>

          <div className="ps-viewer-row">

            {/* Viewer de documento */}
            <div className="ps-doc-viewer box show" id="docViewer">
              <div className="ps-viewer-header">
                <span className="ps-viewer-label">📄 Documento</span>
                <button
                  className="btn-fullscreen"
                  id="btnFullDoc"
                  title="Tela cheia"
                  onClick={() => toggleFullscreen('docFrame')}
                  style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
                >⛶</button>
              </div>
              <div className="ps-frame-wrap">
                <iframe id="docFrame" src={active.doc} title="Documento de Segurança" />
              </div>
            </div>

            {/* Viewer de vídeo */}
            <div className="ps-video-viewer box show" id="videoViewer">
              <div className="ps-viewer-header">
                <span className="ps-viewer-label">🎬 Vídeo Instrucional</span>
                <div className="ps-video-btns">
                  <button
                    className="btn-floating-sound"
                    id="btnSound"
                    title="Som"
                    style={{ position: 'static' }}
                    onClick={toggleSound}
                  >{muted ? '🔇' : '🔊'}</button>
                  <button
                    className="btn-fullscreen"
                    title="Tela cheia"
                    onClick={() => toggleFullscreen('docVideo')}
                    style={{ position: 'static', width: 32, height: 32, fontSize: 14 }}
                  >⛶</button>
                </div>
              </div>
              <div className="ps-frame-wrap">
                <video
                  id="docVideo"
                  ref={videoRef}
                  src={active.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>

          </div>{/* /.ps-viewer-row */}

          {/* Ações */}
          <div className="ps-actions">
            <button className="btn-assinar" id="btnAssinar" onClick={() => setShowForm(true)}>
              ✍️ Assinar Documento
            </button>
            <button className="btn-exportar" onClick={exportarExcel}>
              ⬇️ Exportar para Excel
            </button>
          </div>

        </section>
      </main>

      {/* ── TABELA DE ASSINATURAS ── */}
      <section className="tabelas-ps" id="tabelaSection">
        <div className="section-title" style={{ padding: '0 24px 10px' }}>
          <h4>📝 Folha de Assinaturas</h4>
        </div>
        <div className="ps-table-wrap">
          <table className="tabelaPS" id="tabelaAssinaturas">
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
            <tbody id="tbodyAssinaturas">
              {assinaturas.length === 0
                ? <tr className="empty-row"><td colSpan={7}>Nenhuma assinatura registrada.</td></tr>
                : assinaturas.map((a, i) => (
                  <tr key={i}>
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
