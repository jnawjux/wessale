import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'

const userLocationIcon = L.divIcon({
  className: '',
  html: '<div class="user-location-dot"><div class="user-location-pulse"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function makeSaleIcon(id, selected) {
  return L.divIcon({
    className: '',
    html: `<div class="map-marker${selected ? ' map-marker--selected' : ''}">${id}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

function FitBounds({ sales }) {
  const map = useMap()
  const fitted = useRef(false)

  useEffect(() => {
    if (!fitted.current && sales.length) {
      const bounds = L.latLngBounds(sales.map(s => [s.lat, s.lng]))
      map.fitBounds(bounds, { padding: [40, 40] })
      fitted.current = true
    }
  }, [map, sales])

  return null
}

function FlyToSale({ sale }) {
  const map = useMap()
  const prevId = useRef(null)

  useEffect(() => {
    if (sale && sale.id !== prevId.current) {
      map.flyTo([sale.lat, sale.lng], Math.max(map.getZoom(), 16), { duration: 0.8 })
      prevId.current = sale.id
    }
    if (!sale) prevId.current = null
  }, [sale, map])

  return null
}

export default function MapView({ sales, selectedSaleId, userLocation, onSelectSale }) {
  const selectedSale = sales.find(s => s.id === selectedSaleId) ?? null
  const center = sales.length ? [sales[0].lat, sales[0].lng] : [39.5, -98.35]

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds sales={sales} />
        <FlyToSale sale={selectedSale} />
        {sales.map(sale => (
          <Marker
            key={sale.id}
            position={[sale.lat, sale.lng]}
            icon={makeSaleIcon(sale.id, sale.id === selectedSaleId)}
            eventHandlers={{ click: () => onSelectSale(sale.id) }}
          />
        ))}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          />
        )}
      </MapContainer>
    </div>
  )
}
