import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import Header          from '../components/Header'
import Footer          from '../components/Footer'
import AssinaturaModal from '../components/AssinaturaModal'
import ConfirmModal    from '../components/ConfirmModal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import '../styles/styleIlhas.css'

/* ── mapa de conteúdos ── */
const CONTEUDOS = {
    pd01: { BRM45:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, BRM54:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, CRM39:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'} },
    pd02: { BRM45:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, BRM54:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, CRM39:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'} },
    pd03: { BRM45:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, BRM54:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, CRM39:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'} },
    pd04: { BRM45:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, BRM54:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, CRM39:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'} },
    pd05: { BRM45:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, BRM54:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, CRM39:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'} },
    pd06: { BRM45:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, BRM54:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, CRM39:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'} },
    pd07: { BRM45:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, BRM54:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, CRM39:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'} },
    pd08: { BRM45:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, BRM54:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'}, CRM39:{doc:'BRM45/Docs/pd01.png',video:'BRM45/midias/pd01.mp4'} },
}

const PDS = Object.keys(CONTEUDOS)

export default function PC() {
    const [assinaturas, setAssinaturas] = useLocalStorage('assinaturas_PC_L1F2', {})
    const [pdAtual,     setPdAtual]     = useState(null)
    const [modelo,      setModelo]      = useState(null)
    const [docSrc,      setDocSrc]      = useState('')
    const [videoSrc,    setVideoSrc]    = useState('')
    const [showOverlay, setShowOverlay] = useState(false)
    const [showForm,    setShowForm]    = useState(false)
    const [deleteKey,   setDeleteKey]   = useState(null)
    const [printPd,     setPrintPd]     = useState(null)  // pd selecionado no painel de impressão
    const videoRef   = useRef(null)
    const pdRowRef   = useRef(null)

    /* ── scroll do carrossel de PDs ── */
    function scrollPDs(dir) {
        const row = pdRowRef.current
        if (!row) return
        row.scrollBy({ left: dir * 120, behavior: 'smooth' })
    }

    /* ── abrir seletor de modelos ── */
    function abrirModelos(pd) {
        setPdAtual(pd)
        setShowOverlay(true)
    }

    /* ── carregar conteúdo após selecionar modelo ── */
    function carregarConteudo(pd, m) {
        const c = CONTEUDOS[pd][m]
        setDocSrc(c.doc)
        setVideoSrc(c.video)
        setModelo(m)
        setPdAtual(pd)
        setShowOverlay(false)
    }

    /* ── controles de vídeo ── */
    function togglePlay()      { const v = videoRef.current; if (v) { v.paused ? v.play() : v.pause() } }
    function toggleSound()     { const v = videoRef.current; if (v) v.muted = !v.muted }
    function fullscreenVideo() { const v = videoRef.current; v?.requestFullscreen?.() }
    function fullscreenDoc()   { document.querySelector('.document-view')?.requestFullscreen?.() }

    /* ── assinatura ── */
    function salvarAssinatura(dados) {
        const lista = assinaturas[pdAtual] || []
        setAssinaturas(prev => ({ ...prev, [pdAtual]: [...lista, { ...dados, modelo }] }))
    }

    /* ── exclusão ── */
    function confirmarDelete() {
        if (!deleteKey) return
        const { pd, idx } = deleteKey
        setAssinaturas(prev => {
            const lista = [...(prev[pd] || [])]
            lista.splice(idx, 1)
            return { ...prev, [pd]: lista }
        })
        setDeleteKey(null)
    }

    /* ── exportar Excel ── */
    function exportarExcel() {
        const pdNum = pdAtual?.replace('pd', '') || ''
        const lista = assinaturas[pdAtual] || []
        if (!lista.length) return
        const wb   = XLSX.utils.book_new()
        const rows = [
            ['Treinamento On The Job — Whirlpool'],
            ['Preparação de Caixas — Linha 1'],
            [`PD: pd${pdNum}   Modelo: ${modelo}   Data: ${new Date().toLocaleDateString('pt-BR')}`],
            [],
            ['Modelo', 'Nome', 'RE', 'Turno', 'Tipo', 'Data'],
            ...lista.map(a => [a.modelo, a.nome, a.re, a.turno, a.tipo, a.data])
        ]
        const ws = XLSX.utils.aoa_to_sheet(rows)
        XLSX.utils.book_append_sheet(wb, ws, `PD${pdNum}`)
        XLSX.writeFile(wb, `Treinamento_PC_pd${pdNum}.xlsx`)
    }

    /* ── imprimir folha de assinatura ── */
    function imprimirFolha() {
        window.print()
    }

    const listaImpressao = printPd ? (assinaturas[printPd] || []) : []

    return (
        <>
            <Header title="Preparação de Caixas — Linha 1" />

            {/* ── OVERLAY: seleção de modelo ── */}
            {showOverlay && (
                <div
                    className="overlay active"
                    onClick={e => { if (e.target.classList.contains('overlay')) setShowOverlay(false) }}
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
                    <div className="document-view">
                        {docSrc
                            ? <iframe src={docSrc} title="Visualizador de Documento" />
                            : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', opacity:.4, flexDirection:'column', gap:8 }}>
                                <span style={{ fontSize:42 }}>📄</span>
                                <p style={{ fontSize:13 }}>Selecione um PD e modelo</p>
                            </div>
                        }
                        <button className="btn-fullscreen" onClick={fullscreenDoc} title="Tela cheia">⛶</button>
                    </div>

                </section>

                {/* LADO DIREITO: vídeo */}
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
                            <button type="button" onClick={togglePlay}  title="Play/Pause">▶</button>
                            <button type="button" onClick={toggleSound} title="Som">🔊</button>
                            <button type="button" onClick={fullscreenVideo} title="Tela cheia">⛶</button>
                        </div>
                    </div>
                </section>

            </main>

            {/* ── BOTÃO ASSINAR ── */}
            <div className="assinatura-area">
                <button
                    className="btn-assinar"
                    disabled={!docSrc}
                    onClick={() => setShowForm(true)}
                >
                    ✍ Assinar Documento
                </button>
            </div>

            {/* ── BARRA EXPORTAR + PAINEL IMPRESSÃO ── */}
            <div className="export-print-bar">

                {/* Botão exportar */}
                <button className="btn-exportar" onClick={exportarExcel}>
                    📥 Exportar para Excel
                </button>

                {/* Painel de impressão inline */}
                <div className="print-panel">
                    <span className="print-label">Folha de assinatura:</span>

                    <div className="print-pd-carousel">
                        <button
                            className="pd-arrow pd-arrow-left"
                            type="button"
                            onClick={() => {
                                const el = document.getElementById('printPdRow')
                                el?.scrollBy({ left: -100, behavior: 'smooth' })
                            }}
                        >‹</button>

                        <div className="print-pd-row" id="printPdRow">
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
                            onClick={() => {
                                const el = document.getElementById('printPdRow')
                                el?.scrollBy({ left: 100, behavior: 'smooth' })
                            }}
                        >›</button>
                    </div>

                    <button
                        className="btn-imprimir"
                        disabled={!printPd || listaImpressao.length === 0}
                        onClick={imprimirFolha}
                        title={!printPd ? 'Selecione um PD' : listaImpressao.length === 0 ? 'Sem registros' : 'Imprimir'}
                    >
                        🖨 Imprimir
                    </button>
                </div>
            </div>

            {/* ── TABELAS PD ── */}
            <section className="tabelas-pd">
                {PDS.map(pd => {
                    const num   = pd.replace('pd', '')
                    const lista = assinaturas[pd] || []
                    const visivel = pdAtual === pd || printPd === pd
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
                                    <tr key={i}>
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