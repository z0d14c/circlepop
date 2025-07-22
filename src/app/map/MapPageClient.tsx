'use client'

import dynamic from 'next/dynamic'

const LeafletMap = dynamic(() => import('circlepop/components/LeafletMap'), {
  ssr: false,
})

export default function MapPageClient() {
  return <LeafletMap />
}
