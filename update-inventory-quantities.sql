-- ============================================
-- Update Inventory Quantities Script
-- ============================================
-- This script updates inventory quantities to more realistic levels
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user_id from Supabase auth
-- You can find your user_id by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';
-- ============================================

-- ============================================
-- UPDATE SUPPLY ITEMS QUANTITIES
-- ============================================

-- Kitchen & Food Items (Various stock levels)
UPDATE supply_items SET quantity = 6 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Eggs';  -- Running low
UPDATE supply_items SET quantity = 0.8 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Milk';  -- Critical!
UPDATE supply_items SET quantity = 150 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Cottage Cheese';  -- Low
UPDATE supply_items SET quantity = 0.5 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Bread';  -- Critical
UPDATE supply_items SET quantity = 180 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Butter';  -- Good
UPDATE supply_items SET quantity = 220 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Cheese';  -- Low
UPDATE supply_items SET quantity = 450 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Yogurt';  -- Good

-- Beverages (Mixed levels)
UPDATE supply_items SET quantity = 85 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Coffee';  -- Running low
UPDATE supply_items SET quantity = 8 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Tea';  -- Critical
UPDATE supply_items SET quantity = 1.2 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Orange Juice';  -- Good

-- Pantry Items (Varied levels)
UPDATE supply_items SET quantity = 450 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Pasta';  -- Good
UPDATE supply_items SET quantity = 680 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Rice';  -- Low
UPDATE supply_items SET quantity = 350 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Olive Oil';  -- Good
UPDATE supply_items SET quantity = 850 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Salt';  -- Excellent
UPDATE supply_items SET quantity = 420 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Sugar';  -- Good
UPDATE supply_items SET quantity = 720 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Flour';  -- Low
UPDATE supply_items SET quantity = 1 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Tomato Sauce';  -- Critical
UPDATE supply_items SET quantity = 2 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Canned Tomatoes';  -- Low

-- Fresh Meat (Low stock - perishable)
UPDATE supply_items SET quantity = 320 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Chicken Breast';  -- Good
UPDATE supply_items SET quantity = 180 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Ground Beef';  -- Running low

-- Cleaning & Household (Various levels)
UPDATE supply_items SET quantity = 4 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Toilet Paper';  -- Critical
UPDATE supply_items SET quantity = 3 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Paper Towels';  -- Good
UPDATE supply_items SET quantity = 2 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Dish Sponge';  -- Good
UPDATE supply_items SET quantity = 280 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Dish Soap';  -- Low
UPDATE supply_items SET quantity = 1850 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Laundry Detergent';  -- Good
UPDATE supply_items SET quantity = 220 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'All-Purpose Cleaner';  -- Good
UPDATE supply_items SET quantity = 12 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Trash Bags';  -- Low
UPDATE supply_items SET quantity = 8 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Dishwasher Tablets';  -- Critical
UPDATE supply_items SET quantity = 680 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Fabric Softener';  -- Good
UPDATE supply_items SET quantity = 150 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Hand Soap';  -- Good

-- Personal Care (Mixed stock levels)
UPDATE supply_items SET quantity = 220 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Shampoo';  -- Good
UPDATE supply_items SET quantity = 185 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Conditioner';  -- Good
UPDATE supply_items SET quantity = 280 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Body Wash';  -- Good
UPDATE supply_items SET quantity = 45 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Toothpaste';  -- Good
UPDATE supply_items SET quantity = 2 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Tissues';  -- Low
UPDATE supply_items SET quantity = 0.5 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Deodorant';  -- Good

-- Fruits & Vegetables (Generally lower - perishable)
UPDATE supply_items SET quantity = 680 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Apples';  -- Low
UPDATE supply_items SET quantity = 520 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Bananas';  -- Low
UPDATE supply_items SET quantity = 380 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Tomatoes';  -- Good
UPDATE supply_items SET quantity = 1850 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Potatoes';  -- Good
UPDATE supply_items SET quantity = 920 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Onions';  -- Good
UPDATE supply_items SET quantity = 450 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Carrots';  -- Good
UPDATE supply_items SET quantity = 1 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Lettuce';  -- Low
UPDATE supply_items SET quantity = 2 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Cucumbers';  -- Good

-- Condiments & Sauces (Various levels)
UPDATE supply_items SET quantity = 180 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Ketchup';  -- Good
UPDATE supply_items SET quantity = 220 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Mayonnaise';  -- Good
UPDATE supply_items SET quantity = 85 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Mustard';  -- Low
UPDATE supply_items SET quantity = 280 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Soy Sauce';  -- Good
UPDATE supply_items SET quantity = 480 WHERE user_id = 'YOUR_USER_ID_HERE' AND name = 'Vinegar';  -- Good

-- ============================================
-- Verification Query
-- ============================================
-- After running this script, verify the updates:
-- SELECT name, quantity, unit, daily_consumption,
--        ROUND(quantity::numeric / NULLIF(daily_consumption, 0), 1) as days_remaining,
--        low_stock_threshold,
--        CASE
--          WHEN ROUND(quantity::numeric / NULLIF(daily_consumption, 0), 1) <= low_stock_threshold THEN 'CRITICAL'
--          WHEN ROUND(quantity::numeric / NULLIF(daily_consumption, 0), 1) <= low_stock_threshold * 2 THEN 'LOW'
--          WHEN ROUND(quantity::numeric / NULLIF(daily_consumption, 0), 1) <= low_stock_threshold * 3 THEN 'GOOD'
--          ELSE 'EXCELLENT'
--        END as stock_status
-- FROM supply_items
-- WHERE user_id = 'YOUR_USER_ID_HERE'
-- ORDER BY days_remaining ASC;
