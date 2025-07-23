'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Circle, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'

function ResetButton({ onReset }: { onReset: () => void }) {
  const map = useMap()
  const handleClick = () => {
    map.setView([0, 0], 2)
    onReset()
  }
  return (
    <button
      onClick={handleClick}
      className="absolute bottom-12 right-2 z-[1000] bg-foreground/90 text-background font-medium px-2 py-1 rounded shadow hover:bg-foreground"
    >
      Reset map
    </button>
  )
}

function CircleMarker({
  radiusKm,
  center,
  setCenter,
  setPopulation,
  setBusStops,
  setTramStops,
  setMetroTrain,
  setLoading,
}: {
  radiusKm: number
  center: LatLngExpression | null
  setCenter: (center: LatLngExpression) => void
  setPopulation: (p: number | null) => void
  setBusStops: (c: number | null) => void
  setTramStops: (c: number | null) => void
  setMetroTrain: (c: number | null) => void
  setLoading: (l: boolean) => void
}) {
  const map = useMapEvents({
    click(e) {
      setLoading(true)
      setCenter(e.latlng)
      const circle = L.circle(e.latlng, { radius: radiusKm * 1000 }).addTo(map)
      map.fitBounds(circle.getBounds())
      circle.remove()

      const acceptableTypes = ["number", "string"]

      fetch(`/api/pop?lat=${e.latlng.lat}&lon=${e.latlng.lng}&r_km=${radiusKm}`)
        .then((r) => r.json())
        .then((d) => {
          if (acceptableTypes.includes(typeof d.population)) {
            setPopulation(Number(d.population))
          } else {
            setPopulation(null)
          }

          if (acceptableTypes.includes(typeof d.busStops)) {
            setBusStops(d.busStops)
          } else {
            setBusStops(null)
          }

          if (acceptableTypes.includes(typeof d.tramStops)) {
            setTramStops(d.tramStops)
          } else {
            setTramStops(null)
          }

          if (acceptableTypes.includes(typeof d.metroTrain)) {
            setMetroTrain(d.metroTrain)
          } else {
            setMetroTrain(null)
          }
          setLoading(false)
        })
        .catch(() => {
          setPopulation(null)
          setBusStops(null)
          setTramStops(null)
          setMetroTrain(null)
          setLoading(false)
        })
    },
  })

  return center && <Circle center={center} radius={radiusKm * 1000} />
}

export default function LeafletMap() {
  const [radiusKm, setRadiusKm] = useState(10)
  const [center, setCenter] = useState<LatLngExpression | null>(null)
  const [population, setPopulation] = useState<number | null>(null)
  const [busStops, setBusStops] = useState<number | null>(null)
  const [tramStops, setTramStops] = useState<number | null>(null)
  const [metroTrain, setMetroTrain] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

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
          <CircleMarker
            radiusKm={radiusKm}
            center={center}
            setCenter={setCenter}
            setPopulation={setPopulation}
            setBusStops={setBusStops}
            setTramStops={setTramStops}
            setMetroTrain={setMetroTrain}
            setLoading={setLoading}
          />
          <ResetButton
            onReset={() => {
              setCenter(null)
              setPopulation(null)
              setBusStops(null)
              setTramStops(null)
              setMetroTrain(null)
            }}
          />
        </MapContainer>
        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/70">
            <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {population !== null && (
          <div className="absolute bottom-12 left-2 z-[1000] bg-foreground/90 text-background px-2 py-1 rounded shadow flex flex-col space-y-1">
            <span>👥 Population: {population}</span>
            {busStops !== null && <span>🚌 Bus stops: {busStops}</span>}
            {tramStops !== null && <span>🚊 Tram stops: {tramStops}</span>}
            {metroTrain !== null && <span>🚆 Metro/Train: {metroTrain}</span>}
          </div>
        )}
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
      <div className="flex flex-col items-center gap-2">
        {/* text explaining the app */}
        <p>
          This app shows the population and number of bus, tram, and metro/train stops within a circle of a given radius.
        </p>
        <p>
          Select a radius and then click on the map to try it out.
        </p>
        <p className="italic">
          Beta (Germany-only)
        </p>
      </div>
    </div>
  )
}
