import { useState, useEffect, useCallback } from 'react'
import { CSV_URL, ALL_TAGS } from './config'
import { fetchSales } from './utils/fetchSales'
import { geocodeAll } from './utils/geocoder'
import { extractTags } from './utils/tagExtractor'
import MapView from './components/MapView'
import InfoPanel from './components/InfoPanel'
import TagFilter from './components/TagFilter'

function computeClosest10(target, allSales) {
  return allSales
    .filter(s => s.id !== target.id)
    .map(s => ({ ...s, dist: Math.hypot(s.lat - target.lat, s.lng - target.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 10)
}

export default function App() {
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState(null)
  const [geocodingProgress, setGeocodingProgress] = useState({ done: 0, total: 0 })
  const [sales, setSales] = useState([])
  const [selectedSaleId, setSelectedSaleId] = useState(null)
  const [activeTags, setActiveTags] = useState(new Set())

  useEffect(() => {
    async function load() {
      try {
        setStatus('loading')
        const rawSales = await fetchSales(CSV_URL)

        setStatus('geocoding')
        setGeocodingProgress({ done: 0, total: rawSales.length })

        const geocoded = await geocodeAll(rawSales, (done, total) => {
          setGeocodingProgress({ done, total })
        })

        const enriched = geocoded.map(sale => ({
          ...sale,
          tags: extractTags(sale.description),
        }))

        setSales(enriched)
        setStatus('ready')
      } catch (err) {
        setErrorMessage(err.message)
        setStatus('error')
      }
    }

    load()
  }, [])

  const toggleTag = useCallback(tag => {
    setActiveTags(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
    setSelectedSaleId(null)
  }, [])

  const clearTags = useCallback(() => {
    setActiveTags(new Set())
    setSelectedSaleId(null)
  }, [])

  const visibleSales = activeTags.size === 0
    ? sales
    : sales.filter(s => s.tags.some(t => activeTags.has(t)))

  const selectedSale = sales.find(s => s.id === selectedSaleId) ?? null

  const closestSales = selectedSale
    ? computeClosest10(selectedSale, visibleSales)
    : []

  const closestIds = closestSales.map(s => s.id)

  if (status === 'loading') {
    return (
      <div className="status-screen">
        <div className="status-card">
          <div className="spinner" />
          <p>Loading sale data...</p>
        </div>
      </div>
    )
  }

  if (status === 'geocoding') {
    const { done, total } = geocodingProgress
    const pct = total ? Math.round((done / total) * 100) : 0
    return (
      <div className="status-screen">
        <div className="status-card">
          <div className="spinner" />
          <p>Geocoding addresses... {done}/{total}</p>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="status-hint">This may take a moment. Results are cached after the first load.</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="status-screen">
        <div className="status-card status-card--error">
          <h2>Something went wrong</h2>
          <p>{errorMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Wessale</h1>
        <span className="app-subtitle">{visibleSales.length} sale{visibleSales.length !== 1 ? 's' : ''}</span>
      </header>
      <TagFilter
        allTags={ALL_TAGS}
        activeTags={activeTags}
        onToggle={toggleTag}
        onClearAll={clearTags}
      />
      <div className="app-body">
        <MapView
          sales={visibleSales}
          selectedSaleId={selectedSaleId}
          closestIds={closestIds}
          onSelectSale={setSelectedSaleId}
        />
        {selectedSale && (
          <InfoPanel
            sale={selectedSale}
            closestSales={closestSales}
            onClose={() => setSelectedSaleId(null)}
            onSelectSale={setSelectedSaleId}
          />
        )}
      </div>
    </div>
  )
}
