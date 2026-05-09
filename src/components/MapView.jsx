import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'

const defaultIcon = L.divIcon({
  className: '',
  html: '<div class="map-pin map-pin--default"></div>',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
})

const selectedIcon = L.divIcon({
  className: '',
  html: '<div class="map-pin map-pin--selected"></div>',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
})

const closestIcon = L.divIcon({
  className: '',
  html: '<div class="map-pin map-pin--closest"></div>',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
})

const userLocationIcon = L.divIcon({
  className: '',
  html: '<div class="user-location-dot"><div class="user-location-pulse"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function iconFor(sale, selectedSaleId, closestIds) {
  if (sale.id === selectedSaleId) return selectedIcon
  if (closestIds.includes(sale.id)) return closestIcon
  return defaultIcon
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

export default function MapView({ sales, allSales, selectedSaleId, closestIds, userLocation, onSelectSale }) {
  const initialSales = allSales?.length ? allSales : sales
  const center = initialSales.length
    ? [initialSales[0].lat, initialSales[0].lng]
    : [39.5, -98.35]

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds sales={initialSales} />
        {sales.map(sale => (
          <Marker
            key={sale.id}
            position={[sale.lat, sale.lng]}
            icon={iconFor(sale, selectedSaleId, closestIds)}
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
