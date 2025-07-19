'use client'

import { useEffect } from 'react'

export default function PopLoader() {
  useEffect(() => {
    fetch('/api/pop?lat=30.3&lon=-97.7&r_km=10')
      .then(r => r.json())
      .then(d => console.log('population', d.population))
      .catch(console.error)
  }, [])

  return null
}
