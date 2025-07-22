'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLngExpression } from 'leaflet'

function ResetButton({ onReset }: { onReset: () => void }) {
  const map = useMap()
  const handleClick = () => {
    map.setView([0, 0], 2)
    onReset()
  }
  return (
    <button
      onClick={handleClick}
      className="absolute top-2 right-2 z-[1000] bg-white/90 px-2 py-1 rounded"
    >
      Reset map
    </button>
  )
}

export default function MapPage() {
  const [center, setCenter] = useState<LatLngExpression | null>(null)
  const [radiusKm, setRadiusKm] = useState(10)

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative w-full h-[500px]">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          className="h-full w-full"
          scrollWheelZoom
          whenCreated={(map) => map.invalidateSize()}
          onClick={(e) => setCenter(e.latlng)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {center && <Circle center={center} radius={radiusKm * 1000} />}
        </MapContainer>
        <ResetButton onReset={() => setCenter(null)} />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="3"
          max="100"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
        />
        <span>{radiusKm} km</span>
      </div>
    </div>
  )
}
