const CACHE_KEY = 'geocache_v1'
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
const RATE_LIMIT_MS = 1100

let queue = []
let drainerActive = false

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') }
  catch { return {} }
}

function saveCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) }
  catch {} // storage full — degrade gracefully
}

function getCached(address) {
  const cache = loadCache()
  const entry = cache[address]
  if (!entry) return null
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null
  return { lat: entry.lat, lng: entry.lng }
}

function setCached(address, coords) {
  const cache = loadCache()
  cache[address] = { ...coords, cachedAt: Date.now() }
  saveCache(cache)
}

async function nominatimFetch(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'wessale-garage-sale-map/1.0' },
  })
  if (!res.ok) return null
  const data = await res.json()
  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

function startDrainer() {
  if (drainerActive) return
  drainerActive = true
  const interval = setInterval(() => {
    if (!queue.length) {
      clearInterval(interval)
      drainerActive = false
      return
    }
    const { address, resolve } = queue.shift()
    nominatimFetch(address).then(coords => {
      if (coords) setCached(address, coords)
      resolve(coords)
    }).catch(() => resolve(null))
  }, RATE_LIMIT_MS)
}

function geocodeAddress(address) {
  const cached = getCached(address)
  if (cached) return Promise.resolve(cached)

  return new Promise(resolve => {
    queue.push({ address, resolve })
    startDrainer()
  })
}

export async function geocodeAll(rawSales, onProgress) {
  const results = []
  let done = 0

  // Rows with lat/lng already in the CSV skip geocoding entirely
  const needsGeocoding = []
  for (const sale of rawSales) {
    if (sale.lat !== null && sale.lng !== null && !isNaN(sale.lat) && !isNaN(sale.lng)) {
      results.push(sale)
      done++
      onProgress?.(done, rawSales.length)
      continue
    }
    const cached = getCached(sale.address)
    if (cached) {
      results.push({ ...sale, ...cached })
      done++
      onProgress?.(done, rawSales.length)
    } else {
      needsGeocoding.push(sale)
    }
  }

  const geocoded = await Promise.all(
    needsGeocoding.map(sale =>
      geocodeAddress(sale.address).then(coords => {
        done++
        onProgress?.(done, rawSales.length)
        return coords ? { ...sale, ...coords } : null
      })
    )
  )

  return [...results, ...geocoded.filter(Boolean)]
}
