-- Every insert is guarded: "add exactly this row only if it isn't there already."
-- That makes this file safe to run again and again without creating duplicates.

-- Restaurants.
INSERT INTO restaurants (name, cuisine, area)
SELECT 'Bombay Sandwich Co.', 'Indian', 'Bandra, Mumbai'
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Bombay Sandwich Co.');

INSERT INTO restaurants (name, cuisine, area, photo_url)
SELECT 'Ludhiana Burrito', 'Indian', 'Sector 32, Delhi', 'https://images.unsplash.com/photo-1731090389603-d63060ee08a6?w=1200&q=80&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Ludhiana Burrito');

INSERT INTO restaurants (name, cuisine, area, photo_url)
SELECT 'Kong City', 'Chinese', 'CST, Mumbai', 'https://images.unsplash.com/photo-1750602920132-2146f0345e21?w=1200&q=80&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Kong City');

-- Reviews: Bombay Sandwich Co.
INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 5, 'Double decker Sandwich is unreal', NOW() - INTERVAL '8 days'
FROM restaurants r WHERE r.name = 'Bombay Sandwich Co.'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'Double decker Sandwich is unreal');

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 4, 'Good, but slow service', NOW() - INTERVAL '6 days'
FROM restaurants r WHERE r.name = 'Bombay Sandwich Co.'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'Good, but slow service');

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 4, 'Solid. Would repeat.', NOW() - INTERVAL '2 days'
FROM restaurants r WHERE r.name = 'Bombay Sandwich Co.'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'Solid. Would repeat.');

-- Reviews: Ludhiana Burrito
INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 4, 'Paneer tikka wrap with that desi tadka - a proper Indian mashup', NOW() - INTERVAL '7 days'
FROM restaurants r WHERE r.name = 'Ludhiana Burrito'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'Paneer tikka wrap with that desi tadka - a proper Indian mashup');

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 5, 'The masala chole burrito is unreal. Best fusion in Sector 32!', NOW() - INTERVAL '4 days'
FROM restaurants r WHERE r.name = 'Ludhiana Burrito'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'The masala chole burrito is unreal. Best fusion in Sector 32!');

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 3, 'Nice idea, decent food, but the wrap arrived a bit soggy', NOW() - INTERVAL '1 day'
FROM restaurants r WHERE r.name = 'Ludhiana Burrito'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'Nice idea, decent food, but the wrap arrived a bit soggy');

-- Reviews: Kong City
INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 4, 'Schezwan noodles are properly spicy and the chilli paneer is great', NOW() - INTERVAL '9 days'
FROM restaurants r WHERE r.name = 'Kong City'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'Schezwan noodles are properly spicy and the chilli paneer is great');

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 5, 'Hunan chicken and fried rice combo hits just right. Very consistent.', NOW() - INTERVAL '3 days'
FROM restaurants r WHERE r.name = 'Kong City'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'Hunan chicken and fried rice combo hits just right. Very consistent.');

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 3, 'Food is good but the service was slow on a busy Saturday', NOW() - INTERVAL '1 day'
FROM restaurants r WHERE r.name = 'Kong City'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE comment = 'Food is good but the service was slow on a busy Saturday');

-- Fill photo_url on databases where those two restaurants already existed
-- (the guarded INSERTs above skip them). Running again is harmless: they
-- already have the same URL.
UPDATE restaurants
SET photo_url = 'https://images.unsplash.com/photo-1731090389603-d63060ee08a6?w=1200&q=80&auto=format&fit=crop'
WHERE name = 'Ludhiana Burrito';

UPDATE restaurants
SET photo_url = 'https://images.unsplash.com/photo-1750602920132-2146f0345e21?w=1200&q=80&auto=format&fit=crop'
WHERE name = 'Kong City';