export default function InfoPanel({ sale, closestSales, onClose, onSelectSale }) {
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

        {closestSales.length > 0 && (
          <div className="info-panel__nearby">
            <h3>Nearby Sales</h3>
            <ul className="nearby-list">
              {closestSales.map(nearby => (
                <li key={nearby.id} className="nearby-item">
                  <button className="nearby-item__btn" onClick={() => onSelectSale(nearby.id)}>
                    <span className="nearby-item__id">#{nearby.id}</span>
                    <span className="nearby-item__address">{nearby.address}</span>
                    {nearby.tags.length > 0 && (
                      <span className="nearby-item__tags">
                        {nearby.tags.slice(0, 3).join(', ')}
                        {nearby.tags.length > 3 ? ` +${nearby.tags.length - 3}` : ''}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
