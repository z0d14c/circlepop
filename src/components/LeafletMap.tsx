'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Circle, useMap, useMapEvents } from 'react-leaflet'
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

function CircleMarker({ radiusKm, center, setCenter }: { radiusKm: number, center: LatLngExpression | null, setCenter: (center: LatLngExpression) => void }) {
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setCenter(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return center && <Circle center={center} radius={radiusKm * 1000} />
}

export default function LeafletMap() {
  const [radiusKm, setRadiusKm] = useState(10)
  const [center, setCenter] = useState<LatLngExpression | null>(null)

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative w-full h-[500px]">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <CircleMarker radiusKm={radiusKm} center={center} setCenter={setCenter} />
          <ResetButton onReset={() => setCenter(null)} />
        </MapContainer>
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
