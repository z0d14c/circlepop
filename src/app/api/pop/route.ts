import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const lat  = Number(req.nextUrl.searchParams.get('lat'))
  const lon  = Number(req.nextUrl.searchParams.get('lon'))
  const r_km = Number(req.nextUrl.searchParams.get('r_km'))           // kilometres
  const r_m  = r_km * 1_000                                           // metres

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      population : 0,
      busStops   : 0,
      tramStops  : 0,
      metroTrain : 0,
    })
  }

  const sql = neon(process.env.DATABASE_URL)

  /* one round‑trip: population + stop counts */
  const rows: {
    pop: string
    bus: number
    tram: number
    metro_train: number
  }[] = await sql`
    WITH circle AS (
      SELECT  ST_SetSRID(ST_Point(${lon}, ${lat}), 4326)::geography AS c,
              ${r_m}::double precision                               AS r
    )
    SELECT
      /* population */
      (SELECT COALESCE(SUM(pop), 0)           FROM ghs_pop_pts_de p, circle
       WHERE ST_DWithin(p.geom::geography, circle.c, circle.r))           AS pop,

      /* bus stops */
      (SELECT COUNT(*) FROM osm_nodes s, circle
       WHERE s.mode = 'bus'
         AND ST_DWithin(s.geom::geography, circle.c, circle.r))           AS bus,

      /* tram stops */
      (SELECT COUNT(*) FROM osm_nodes s, circle
       WHERE s.mode = 'tram'
         AND ST_DWithin(s.geom::geography, circle.c, circle.r))           AS tram,

      /* metro + heavy‑rail stations */
      (SELECT COUNT(*) FROM osm_nodes s, circle
       WHERE s.mode IN ('metro', 'train')
         AND ST_DWithin(s.geom::geography, circle.c, circle.r))           AS metro_train
  ` as {
    pop: string
    bus: number
    tram: number
    metro_train: number
  }[]

  if (rows.length === 0) {
    return NextResponse.json({
      population : 0,
      busStops   : 0,
      tramStops  : 0,
      metroTrain : 0
    })
  }

  return NextResponse.json({
    population : rows[0].pop,
    busStops   : rows[0].bus,
    tramStops  : rows[0].tram,
    metroTrain : rows[0].metro_train
  })
}
