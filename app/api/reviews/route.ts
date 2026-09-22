import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { restaurantId, rating, comment } = (body ?? {}) as {
    restaurantId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  // Check 1: rating must be a whole number from 1 to 5
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json(
      { error: 'Rating must be a whole number between 1 and 5.' },
      { status: 400 }
    );
  }

  // Check 2: comment must be non-empty after trimming whitespace
  if (typeof comment !== 'string' || comment.trim().length === 0) {
    return Response.json({ error: 'Comment must not be empty.' }, { status: 400 });
  }

  // Check 3: the restaurant must actually exist (a database lookup)
  const restaurants = await sql.query('SELECT id FROM restaurants WHERE id = $1', [restaurantId]);
  if (restaurants.length === 0) {
    return Response.json({ error: 'No restaurant with that id exists.' }, { status: 400 });
  }

  // All checks passed: insert exactly one row and let the database assign id and created_at
  const inserted = await sql.query(
    'INSERT INTO reviews (restaurant_id, rating, comment) VALUES ($1, $2, $3) RETURNING id',
    [restaurantId, rating, comment.trim()]
  );

  return Response.json({ success: true, reviewId: Number(inserted[0].id) }, { status: 201 });
}