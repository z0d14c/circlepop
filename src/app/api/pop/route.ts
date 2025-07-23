import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  const r_km = Number(req.nextUrl.searchParams.get('r_km'));

  const items = await sql`
    SELECT COALESCE(SUM(pop),0)::bigint AS pop
    FROM   ghs_pop_pts_de
    WHERE  ST_DWithin(
             geom::geography,
             ST_SetSRID(ST_Point(${lon},${lat}),4326)::geography,
             ${r_km * 1000}
           );
  `;

  const population = items?.[0]?.pop ?? 0

  return NextResponse.json({ population });
}
