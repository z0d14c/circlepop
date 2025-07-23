import MapPageClient from './MapPageClient'

export default function MapPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold text-center mt-4">CirclePop🎈📌</h1>
      <MapPageClient />
    </div>
  )
}
