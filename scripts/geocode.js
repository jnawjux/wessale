#!/usr/bin/env node
/**
 * Geocodes addresses in public/sales.csv and writes lat/lng columns back.
 * Run once: npm run geocode
 *
 * - Skips rows that already have lat/lng
 * - Respects Nominatim's 1 req/sec rate limit
 * - Overwrites public/sales.csv in place when done
 */

import { readFileSync, writeFileSync } from 'fs'
import { parse, unparse } from 'papaparse'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSV_PATH = join(__dirname, '../public/sales.csv')
const RATE_LIMIT_MS = 1100

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'wessale-garage-sale-map/1.0' },
  })
  if (!res.ok) return null
  const data = await res.json()
  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

const text = readFileSync(CSV_PATH, 'utf8')
const { data } = parse(text, {
  header: true,
  skipEmptyLines: true,
  transformHeader: h => h.trim().toLowerCase().replace(/^﻿/, ''),
})

let geocoded = 0
let skipped = 0
let failed = 0

for (const row of data) {
  const alreadyHas = row.lat && row.lng && !isNaN(parseFloat(row.lat)) && !isNaN(parseFloat(row.lng))
  if (alreadyHas) {
    skipped++
    continue
  }

  process.stdout.write(`Geocoding: ${row.address} ... `)
  const coords = await geocode(row.address)

  if (coords) {
    row.lat = coords.lat
    row.lng = coords.lng
    geocoded++
    console.log(`✓ (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`)
  } else {
    row.lat = ''
    row.lng = ''
    failed++
    console.log('✗ not found')
  }

  await sleep(RATE_LIMIT_MS)
}

writeFileSync(CSV_PATH, unparse(data), 'utf8')

console.log(`\nDone. Geocoded: ${geocoded}, Already had coords: ${skipped}, Failed: ${failed}`)
console.log(`Saved to ${CSV_PATH}`)
