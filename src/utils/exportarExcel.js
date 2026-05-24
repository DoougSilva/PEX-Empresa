import * as XLSX from 'xlsx'

/**
 * Exporta dados para arquivo Excel (.xlsx).
 *
 * @param {{
 *   cabecalho: string[][],
 *   colunas: string[],
 *   dados: Array<Array<string|number>>,
 *   nomeArquivo: string,
 *   nomeAba?: string,
 *   larguraColunas?: Array<{ wch: number }>,
 *   merges?: Array<{ s: { r: number, c: number }, e: { r: number, c: number } }>,
 * }} config
 */
export function exportarExcel({
  cabecalho,
  colunas,
  dados,
  nomeArquivo,
  nomeAba = 'Dados',
  larguraColunas,
  merges,
}) {
  if (!dados.length) return

  const linhas = [...cabecalho, colunas, ...dados]
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(linhas)

  if (larguraColunas) ws['!cols'] = larguraColunas
  if (merges) ws['!merges'] = merges

  XLSX.utils.book_append_sheet(wb, ws, nomeAba)
  XLSX.writeFile(wb, nomeArquivo)
}
