-- ============================================
-- SpeedShopping Database Seeding Script
-- ============================================
-- This script populates your database with common household items
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user_id from Supabase auth
-- You can find your user_id by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';
-- ============================================

-- Set your user ID here (replace with actual UUID from auth.users)
-- Example: \set user_id '12345678-1234-1234-1234-123456789abc'

-- ============================================
-- SUPPLY ITEMS (Recurring Consumables)
-- ============================================

INSERT INTO supply_items (user_id, name, category, quantity, unit, daily_consumption, low_stock_threshold, notes) VALUES

-- Kitchen & Food Items
('YOUR_USER_ID_HERE', 'Eggs', 'Food', 12, 'pieces', 2, 6, 'Large eggs'),
('YOUR_USER_ID_HERE', 'Milk', 'Food', 2, 'liters', 0.5, 1, 'Fresh whole milk'),
('YOUR_USER_ID_HERE', 'Cottage Cheese', 'Food', 500, 'grams', 100, 250, 'Low-fat cottage cheese'),
('YOUR_USER_ID_HERE', 'Bread', 'Food', 1, 'loaf', 0.25, 0.5, 'Whole wheat bread'),
('YOUR_USER_ID_HERE', 'Butter', 'Food', 250, 'grams', 20, 100, 'Salted butter'),
('YOUR_USER_ID_HERE', 'Cheese', 'Food', 400, 'grams', 50, 150, 'Cheddar cheese'),
('YOUR_USER_ID_HERE', 'Yogurt', 'Food', 1000, 'grams', 150, 300, 'Plain yogurt'),
('YOUR_USER_ID_HERE', 'Coffee', 'Beverages', 500, 'grams', 20, 100, 'Ground coffee'),
('YOUR_USER_ID_HERE', 'Tea', 'Beverages', 50, 'bags', 2, 10, 'Black tea bags'),
('YOUR_USER_ID_HERE', 'Orange Juice', 'Beverages', 2, 'liters', 0.3, 0.5, 'Fresh squeezed'),
('YOUR_USER_ID_HERE', 'Pasta', 'Pantry', 1000, 'grams', 100, 300, 'Spaghetti'),
('YOUR_USER_ID_HERE', 'Rice', 'Pantry', 2000, 'grams', 150, 500, 'Long grain white rice'),
('YOUR_USER_ID_HERE', 'Olive Oil', 'Pantry', 1000, 'ml', 15, 200, 'Extra virgin olive oil'),
('YOUR_USER_ID_HERE', 'Salt', 'Pantry', 1000, 'grams', 5, 200, 'Table salt'),
('YOUR_USER_ID_HERE', 'Sugar', 'Pantry', 1000, 'grams', 20, 250, 'White granulated sugar'),
('YOUR_USER_ID_HERE', 'Flour', 'Pantry', 2000, 'grams', 50, 500, 'All-purpose flour'),
('YOUR_USER_ID_HERE', 'Tomato Sauce', 'Pantry', 3, 'jars', 0.5, 1, '500ml jars'),
('YOUR_USER_ID_HERE', 'Canned Tomatoes', 'Pantry', 5, 'cans', 0.5, 2, '400g cans'),
('YOUR_USER_ID_HERE', 'Chicken Breast', 'Food', 1000, 'grams', 200, 300, 'Fresh chicken breast'),
('YOUR_USER_ID_HERE', 'Ground Beef', 'Food', 500, 'grams', 150, 200, 'Lean ground beef'),

-- Cleaning & Household
('YOUR_USER_ID_HERE', 'Toilet Paper', 'Household', 12, 'rolls', 1, 4, '3-ply toilet paper'),
('YOUR_USER_ID_HERE', 'Paper Towels', 'Household', 6, 'rolls', 0.5, 2, 'Absorbent paper towels'),
('YOUR_USER_ID_HERE', 'Dish Sponge', 'Household', 4, 'pieces', 0.25, 1, 'Non-scratch dish sponges'),
('YOUR_USER_ID_HERE', 'Dish Soap', 'Household', 1000, 'ml', 30, 200, 'Liquid dish soap'),
('YOUR_USER_ID_HERE', 'Laundry Detergent', 'Household', 3000, 'ml', 50, 500, 'Liquid laundry detergent'),
('YOUR_USER_ID_HERE', 'All-Purpose Cleaner', 'Household', 750, 'ml', 20, 150, 'Multi-surface cleaner'),
('YOUR_USER_ID_HERE', 'Trash Bags', 'Household', 30, 'bags', 1, 10, '50L trash bags'),
('YOUR_USER_ID_HERE', 'Dishwasher Tablets', 'Household', 40, 'tablets', 1, 10, 'All-in-one dishwasher tablets'),
('YOUR_USER_ID_HERE', 'Fabric Softener', 'Household', 1500, 'ml', 30, 300, 'Liquid fabric softener'),
('YOUR_USER_ID_HERE', 'Hand Soap', 'Personal Care', 500, 'ml', 15, 100, 'Antibacterial hand soap'),

-- Personal Care
('YOUR_USER_ID_HERE', 'Shampoo', 'Personal Care', 400, 'ml', 10, 100, 'Daily shampoo'),
('YOUR_USER_ID_HERE', 'Conditioner', 'Personal Care', 400, 'ml', 10, 100, 'Hair conditioner'),
('YOUR_USER_ID_HERE', 'Body Wash', 'Personal Care', 500, 'ml', 15, 100, 'Moisturizing body wash'),
('YOUR_USER_ID_HERE', 'Toothpaste', 'Personal Care', 150, 'ml', 3, 30, 'Fluoride toothpaste'),
('YOUR_USER_ID_HERE', 'Tissues', 'Personal Care', 5, 'boxes', 0.3, 1, 'Facial tissues'),
('YOUR_USER_ID_HERE', 'Deodorant', 'Personal Care', 1, 'stick', 0.02, 0.2, 'Roll-on deodorant'),

-- Fruits & Vegetables (adjust seasonally)
('YOUR_USER_ID_HERE', 'Apples', 'Produce', 2000, 'grams', 200, 500, 'Fresh apples'),
('YOUR_USER_ID_HERE', 'Bananas', 'Produce', 1500, 'grams', 200, 400, 'Fresh bananas'),
('YOUR_USER_ID_HERE', 'Tomatoes', 'Produce', 1000, 'grams', 150, 300, 'Fresh tomatoes'),
('YOUR_USER_ID_HERE', 'Potatoes', 'Produce', 3000, 'grams', 300, 1000, 'White potatoes'),
('YOUR_USER_ID_HERE', 'Onions', 'Produce', 1500, 'grams', 100, 500, 'Yellow onions'),
('YOUR_USER_ID_HERE', 'Carrots', 'Produce', 1000, 'grams', 100, 300, 'Fresh carrots'),
('YOUR_USER_ID_HERE', 'Lettuce', 'Produce', 2, 'heads', 0.3, 0.5, 'Iceberg lettuce'),
('YOUR_USER_ID_HERE', 'Cucumbers', 'Produce', 3, 'pieces', 0.5, 1, 'Fresh cucumbers'),

-- Condiments & Sauces
('YOUR_USER_ID_HERE', 'Ketchup', 'Condiments', 500, 'ml', 10, 100, 'Tomato ketchup'),
('YOUR_USER_ID_HERE', 'Mayonnaise', 'Condiments', 400, 'ml', 10, 100, 'Regular mayonnaise'),
('YOUR_USER_ID_HERE', 'Mustard', 'Condiments', 300, 'ml', 5, 50, 'Yellow mustard'),
('YOUR_USER_ID_HERE', 'Soy Sauce', 'Condiments', 500, 'ml', 10, 100, 'Light soy sauce'),
('YOUR_USER_ID_HERE', 'Vinegar', 'Condiments', 750, 'ml', 10, 150, 'White vinegar');


-- ============================================
-- NECESSITY ITEMS (One-time purchases)
-- ============================================

INSERT INTO necessity_items (user_id, name, category, completed, notes) VALUES

-- Kitchen Items
('YOUR_USER_ID_HERE', 'New Cutting Board', 'Kitchen', false, 'Bamboo cutting board'),
('YOUR_USER_ID_HERE', 'Kitchen Knife Set', 'Kitchen', false, 'Professional chef knives'),
('YOUR_USER_ID_HERE', 'Food Storage Containers', 'Kitchen', false, 'Glass containers with lids'),
('YOUR_USER_ID_HERE', 'Baking Tray', 'Kitchen', false, 'Non-stick baking tray'),

-- Household Items
('YOUR_USER_ID_HERE', 'Vacuum Cleaner Bags', 'Household', false, 'Compatible with current model'),
('YOUR_USER_ID_HERE', 'Light Bulbs', 'Household', false, 'LED 60W equivalent, warm white'),
('YOUR_USER_ID_HERE', 'Batteries (AA)', 'Household', false, 'Pack of 12'),
('YOUR_USER_ID_HERE', 'Extension Cord', 'Household', false, '3-meter extension cord'),

-- Personal Items
('YOUR_USER_ID_HERE', 'New Toothbrush', 'Personal Care', false, 'Soft bristles'),
('YOUR_USER_ID_HERE', 'Bath Towels', 'Personal Care', false, 'Set of 2 large towels'),

-- Miscellaneous
('YOUR_USER_ID_HERE', 'Phone Charger Cable', 'Electronics', false, '2-meter USB-C cable'),
('YOUR_USER_ID_HERE', 'Notebook', 'Stationery', false, 'A5 lined notebook'),
('YOUR_USER_ID_HERE', 'Pens', 'Stationery', false, 'Pack of 10 black pens');


-- ============================================
-- Verification Queries
-- ============================================
-- After running the script, verify the data was inserted:
-- SELECT COUNT(*) FROM supply_items WHERE user_id = 'YOUR_USER_ID_HERE';
-- SELECT COUNT(*) FROM necessity_items WHERE user_id = 'YOUR_USER_ID_HERE';
-- SELECT * FROM supply_items WHERE user_id = 'YOUR_USER_ID_HERE' ORDER BY category, name;
-- SELECT * FROM necessity_items WHERE user_id = 'YOUR_USER_ID_HERE' ORDER BY category, name;
