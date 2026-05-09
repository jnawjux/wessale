import Papa from 'papaparse'

export async function fetchSales(csvUrl) {
  const res = await fetch(csvUrl)
  if (!res.ok) throw new Error(`Could not fetch sheet (HTTP ${res.status}). Make sure the sheet is published to the web.`)
  const text = await res.text()

  if (text.trimStart().startsWith('<')) {
    throw new Error('The URL returned an HTML page instead of CSV data. Make sure you are using the export URL (ending in export?format=csv), not the regular edit link.')
  }

  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim().toLowerCase().replace(/^﻿/, ''),
    relaxQuotes: true,
    relaxColumnCount: true,
  })

  const fatalErrors = errors.filter(e => e.type === 'Delimiter' || e.type === 'Abort')
  if (fatalErrors.length) throw new Error(`CSV parse error: ${fatalErrors[0].message}`)
  if (!data.length) throw new Error('The sheet appears to be empty.')

  const cols = Object.keys(data[0])
  for (const col of ['id', 'address', 'description']) {
    if (!cols.includes(col)) throw new Error(`Sheet is missing required column: "${col}". Expected columns: id, address, description.`)
  }

  return data.map(row => ({
    id: String(row.id).trim(),
    address: String(row.address).trim(),
    description: String(row.description).trim(),
  })).filter(row => row.id && row.address)
}
