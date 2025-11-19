-- SpeedShopping Database Migration - Add Acquired Quantity Tracking
-- This migration adds the missing acquired_quantity and times_added_to_cart columns
-- that are needed for the "Got 1" button functionality

-- Add acquired_quantity column to track how many items the user has obtained
ALTER TABLE necessity_items
  ADD COLUMN IF NOT EXISTS acquired_quantity INTEGER NOT NULL DEFAULT 0 CHECK (acquired_quantity >= 0);

-- Add times_added_to_cart column to track cart additions
ALTER TABLE necessity_items
  ADD COLUMN IF NOT EXISTS times_added_to_cart INTEGER NOT NULL DEFAULT 0 CHECK (times_added_to_cart >= 0);

-- Create index for better query performance when filtering by acquired status
CREATE INDEX IF NOT EXISTS idx_necessity_items_acquired_quantity ON necessity_items(acquired_quantity);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'SpeedShopping acquired quantity tracking migration completed!';
  RAISE NOTICE 'Added fields: acquired_quantity, times_added_to_cart';
  RAISE NOTICE 'The "Got 1" button will now work correctly!';
END $$;
