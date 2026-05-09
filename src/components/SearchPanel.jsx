import { useRef, useEffect } from 'react'

export default function SearchPanel({ query, onQueryChange, results, onSelectSale }) {
  const inputRef = useRef(null)

  function highlight(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    const start = Math.max(0, idx - 40)
    const snippet = (start > 0 ? '…' : '') + text.slice(start, idx + query.length + 60)
    const rel = idx - start + (start > 0 ? 1 : 0)
    return (
      <>
        {snippet.slice(0, rel)}
        <mark>{snippet.slice(rel, rel + query.length)}</mark>
        {snippet.slice(rel + query.length)}
      </>
    )
  }

  return (
    <div className="search-panel">
      <input
        ref={inputRef}
        className="search-input"
        type="search"
        placeholder="Search descriptions…"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map(sale => (
            <li key={sale.id}>
              <button
                className="search-result-btn"
                onClick={() => onSelectSale(sale.id)}
              >
                <span className="search-result-id">#{sale.id}</span>
                <span className="search-result-address">{sale.address}</span>
                <span className="search-result-snippet">
                  {highlight(sale.description, query)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.trim().length > 1 && results.length === 0 && (
        <div className="search-no-results">No matches found</div>
      )}
    </div>
  )
}
