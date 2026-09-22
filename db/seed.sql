INSERT INTO restaurants (name, cuisine, area) VALUES
  ('Bombay Sandwich Co.', 'Indian', 'Bandra, Mumbai');

INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES
  (1, 5, 'Double decker Sandwich is unreal', NOW() - INTERVAL '8 days'),
  (1, 4, 'Good, but slow service',           NOW() - INTERVAL '6 days'),
  (1, 4, 'Solid. Would repeat.',             NOW() - INTERVAL '2 days');