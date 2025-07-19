// src/app/api/pop/route.ts
import { NextRequest, NextResponse } from 'next/server'
// import { sql } from '@vercel/postgres'   // Neon or Vercel Postgres client

// just want to send a test response
export async function GET(req: NextRequest) {
  // const lat  = Number(req.nextUrl.searchParams.get('lat'))
  // const lon  = Number(req.nextUrl.searchParams.get('lon'))
  // const rKm  = Number(req.nextUrl.searchParams.get('r_km'))

  // if (!lat || !lon || rKm < 3 || rKm > 50) {
  //   return NextResponse.json({ error: 'invalid params' }, { status: 400 })
  // }

  // const { rows } = await sql`
  //   SELECT SUM(pop) AS p
  //     FROM grid25
  //    WHERE ST_DWithin(
  //          geog,
  //          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography,
  //          ${rKm * 1000}
  //        );
  // `
  // return NextResponse.json({ population: rows[0]?.p ?? 0 })
  return NextResponse.json({ population: 1000000 })
}

