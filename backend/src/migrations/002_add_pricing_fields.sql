-- SpeedShopping Database Schema Update
-- This migration adds missing fields to the existing tables

-- Add missing fields to necessity_items table
ALTER TABLE necessity_items
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS product_url TEXT,
  ADD COLUMN IF NOT EXISTS add_to_cart_url TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high'));

-- Add missing fields to supply_items table
ALTER TABLE supply_items
  ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS product_url TEXT,
  ADD COLUMN IF NOT EXISTS add_to_cart_url TEXT;

-- Make unit nullable (since it wasn't being used in the frontend)
ALTER TABLE supply_items
  ALTER COLUMN unit DROP NOT NULL;

-- Update existing records to have default unit if null
UPDATE supply_items SET unit = 'units' WHERE unit IS NULL;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'SpeedShopping database schema updated successfully!';
  RAISE NOTICE 'Added fields: quantity, price, currency, product_url, add_to_cart_url, priority';
END $$;
