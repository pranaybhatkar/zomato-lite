import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // The restaurant itself. If it doesn't exist, 404.
  const restaurants = await sql.query(
    'SELECT name, cuisine, area FROM restaurants WHERE id = $1',
    [id]
  );
  if (restaurants.length === 0) {
    return Response.json({ error: 'Restaurant not found.' }, { status: 404 });
  }
  const restaurant = restaurants[0];

  // Average and count, computed fresh from the facts. AVG over zero rows is NULL.
  const stats = await sql.query(
    'SELECT AVG(rating) AS average, COUNT(*) AS total FROM reviews WHERE restaurant_id = $1',
    [id]
  );
  const average =
    stats[0].average == null ? null : Math.round(Number(stats[0].average) * 10) / 10;
  const total = Number(stats[0].total);

  // Newest review by created_at, and the rest (newest first), never the newest twice.
  const latestRows = await sql.query(
    'SELECT id, rating, comment, created_at FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC LIMIT 1',
    [id]
  );
  const latest =
    latestRows.length === 0
      ? null
      : {
          id: Number(latestRows[0].id),
          rating: Number(latestRows[0].rating),
          comment: latestRows[0].comment,
          createdAt: latestRows[0].created_at,
        };

  const olderRows = await sql.query(
    'SELECT id, rating, comment, created_at FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC OFFSET 1',
    [id]
  );
  const reviews = olderRows.map((row) => ({
    id: Number(row.id),
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: row.created_at,
  }));

  return Response.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating: average,
    totalReviews: total,
    latestReview: latest,
    reviews,
  });
}