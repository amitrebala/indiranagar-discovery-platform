-- Add more curated journeys for rotation
INSERT INTO journeys (title, description, gradient, icon, estimated_time, vibe_tags) VALUES
-- Morning journeys
('Early Bird Special', 'Catch the neighborhood waking up with sunrise spots and morning rituals', 'from-yellow-400 to-orange-500', 'map', '3 hours', ARRAY['morning', 'peaceful', 'photographer']),
('Breakfast Champion', 'Ultimate breakfast crawl through Amit''s favorite morning spots', 'from-red-400 to-pink-500', 'map', '4 hours', ARRAY['foodie', 'breakfast', 'coffee']),

-- Cultural journeys  
('Heritage Walk', 'Discover the historical gems and cultural landmarks', 'from-indigo-500 to-purple-600', 'compass', '3 hours', ARRAY['cultural', 'historical', 'educational']),
('Art & Soul', 'Gallery hopping and creative spaces tour', 'from-pink-500 to-rose-600', 'compass', '5 hours', ARRAY['artistic', 'creative', 'inspiring']),

-- Food-focused journeys
('Street Food Safari', 'Amit''s guide to the best street food vendors', 'from-green-500 to-teal-600', 'map', '4 hours', ARRAY['foodie', 'street-food', 'adventurous']),
('Craft Beer Trail', 'Microbreweries and gastropubs circuit', 'from-amber-600 to-yellow-600', 'compass', '5 hours', ARRAY['drinks', 'social', 'evening']),

-- Wellness journeys
('Wellness Wednesday', 'Yoga studios, healthy cafes, and peaceful parks', 'from-cyan-500 to-blue-600', 'home', '4 hours', ARRAY['wellness', 'healthy', 'mindful']),
('Nature Escape', 'Green spaces and tranquil spots in the urban jungle', 'from-green-600 to-emerald-600', 'home', '3 hours', ARRAY['nature', 'peaceful', 'relaxing']),

-- Shopping & lifestyle
('Retail Therapy', 'Boutiques, bookstores, and unique shopping finds', 'from-purple-500 to-pink-500', 'map', '5 hours', ARRAY['shopping', 'lifestyle', 'trendy']),
('Sunday Funday', 'Perfect lazy Sunday with brunches and chill spots', 'from-blue-500 to-indigo-600', 'home', '6 hours', ARRAY['relaxed', 'brunch', 'social']),

-- Evening journeys
('Date Night Special', 'Romantic spots for the perfect evening', 'from-red-500 to-pink-600', 'compass', '4 hours', ARRAY['romantic', 'evening', 'special']),
('Night Owl Circuit', 'Late-night haunts and 24-hour spots', 'from-gray-700 to-gray-900', 'map', '5 hours', ARRAY['nightlife', 'late-night', 'social']),

-- Seasonal specials
('Monsoon Magic', 'Best spots to enjoy the rainy season', 'from-blue-600 to-indigo-700', 'compass', '3 hours', ARRAY['seasonal', 'monsoon', 'cozy']),
('Summer Chill', 'Beat the heat with AC havens and cold treats', 'from-cyan-400 to-blue-500', 'home', '4 hours', ARRAY['seasonal', 'summer', 'refreshing']);

-- Update the existing journeys to ensure consistency
UPDATE journeys SET updated_at = NOW();