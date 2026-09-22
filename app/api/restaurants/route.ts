import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// The homepage's waiter: lists every restaurant's name, cuisine, area and photo.
export async function GET() {
  const rows = await sql.query(
    'SELECT id, name, cuisine, area, photo_url FROM restaurants ORDER BY id'
  );
  const restaurants = rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    cuisine: row.cuisine,
    area: row.area,
    photoUrl: row.photo_url ?? null,
  }));
  return Response.json({ restaurants });
}