// src/app/api/pop/route.ts
import { NextRequest, NextResponse } from 'next/server'
// import { sql } from '@vercel/postgres'   // Neon or Vercel Postgres client

// just want to send a test response
export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'))
  const lon = Number(req.nextUrl.searchParams.get('lon'))
  const rKm = Number(req.nextUrl.searchParams.get('r_km'))

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lon) ||
    Number.isNaN(rKm)
  ) {
    return NextResponse.json({ error: 'invalid params' }, { status: 400 })
  }

  // TODO: replace this with real population calculation
  return NextResponse.json({ population: 1000 })
}

