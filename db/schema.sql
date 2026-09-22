CREATE TABLE IF NOT EXISTS restaurants (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  cuisine   TEXT NOT NULL,
  area      TEXT NOT NULL,
  photo_url TEXT
);

-- Fresh databases already have photo_url (it's in the CREATE above).
-- This line adds the column to databases created before it existed.
-- IF NOT EXISTS makes it safe to run every single time.
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS photo_url TEXT;

CREATE TABLE IF NOT EXISTS reviews (
  id            SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);