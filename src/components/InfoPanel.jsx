export default function InfoPanel({ sale, onClose }) {
  return (
    <div className="info-panel">
      <div className="info-panel__header">
        <div className="info-panel__address">
          <span className="info-panel__stop-label">Stop #{sale.id}</span>
          <h2>{sale.address}</h2>
        </div>
        <button className="info-panel__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="info-panel__body">
        <p className="info-panel__description">{sale.description}</p>
        {sale.tags.length > 0 && (
          <div className="info-panel__tags">
            {sale.tags.map(tag => (
              <span key={tag} className="info-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
