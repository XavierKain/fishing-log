import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Catch } from '../types'

// Fix default marker icons in bundled builds
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

interface Props { catches: Catch[] }

export default function MapView({ catches }: Props) {
  const withCoords = catches.filter(c => c.lat != null && c.lng != null)

  if (withCoords.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-4xl mb-2">🗺️</p>
        <p>No catches with GPS coordinates yet.</p>
        <p className="text-xs mt-1">Use the 📍 button when logging a catch!</p>
      </div>
    )
  }

  const center: [number, number] = [withCoords[0].lat!, withCoords[0].lng!]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-emerald-400">Catch Map</h2>
      <div className="rounded-xl overflow-hidden border border-slate-700" style={{ height: '60vh' }}>
        <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {withCoords.map(c => (
            <Marker key={c.id} position={[c.lat!, c.lng!]}>
              <Popup>
                <strong>{c.species}</strong><br />
                {c.weight != null && <>{c.weight} {c.weightUnit}<br /></>}
                {c.date}<br />
                {c.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
