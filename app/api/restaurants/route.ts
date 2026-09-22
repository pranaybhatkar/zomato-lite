import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// The homepage's waiter: lists every restaurant's name, cuisine and area.
export async function GET() {
  const rows = await sql.query(
    'SELECT id, name, cuisine, area FROM restaurants ORDER BY id'
  );
  const restaurants = rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    cuisine: row.cuisine,
    area: row.area,
  }));
  return Response.json({ restaurants });
}