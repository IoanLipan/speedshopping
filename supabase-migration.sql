-- SpeedShopping Database Migration for Supabase
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create necessity_items table
CREATE TABLE IF NOT EXISTS necessity_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT necessity_items_name_check CHECK (char_length(name) > 0)
);

-- Create supply_items table
CREATE TABLE IF NOT EXISTS supply_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC NOT NULL CHECK (quantity >= 0),
  unit TEXT NOT NULL,
  daily_consumption NUMERIC NOT NULL CHECK (daily_consumption >= 0),
  days_remaining INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 7,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT supply_items_name_check CHECK (char_length(name) > 0),
  CONSTRAINT supply_items_unit_check CHECK (char_length(unit) > 0)
);

-- Create price_history table (for price tracking feature)
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  scraped_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_necessity_items_user_id ON necessity_items(user_id);
CREATE INDEX IF NOT EXISTS idx_necessity_items_completed ON necessity_items(completed);
CREATE INDEX IF NOT EXISTS idx_necessity_items_created_at ON necessity_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_supply_items_user_id ON supply_items(user_id);
CREATE INDEX IF NOT EXISTS idx_supply_items_days_remaining ON supply_items(days_remaining);
CREATE INDEX IF NOT EXISTS idx_supply_items_created_at ON supply_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_price_history_item_id ON price_history(item_id);
CREATE INDEX IF NOT EXISTS idx_price_history_scraped_at ON price_history(scraped_at DESC);

CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON notification_settings(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE necessity_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own necessity items" ON necessity_items;
DROP POLICY IF EXISTS "Users can insert their own necessity items" ON necessity_items;
DROP POLICY IF EXISTS "Users can update their own necessity items" ON necessity_items;
DROP POLICY IF EXISTS "Users can delete their own necessity items" ON necessity_items;

DROP POLICY IF EXISTS "Users can view their own supply items" ON supply_items;
DROP POLICY IF EXISTS "Users can insert their own supply items" ON supply_items;
DROP POLICY IF EXISTS "Users can update their own supply items" ON supply_items;
DROP POLICY IF EXISTS "Users can delete their own supply items" ON supply_items;

DROP POLICY IF EXISTS "Users can view price history" ON price_history;
DROP POLICY IF EXISTS "Service can manage price history" ON price_history;

DROP POLICY IF EXISTS "Users can view their own notification settings" ON notification_settings;
DROP POLICY IF EXISTS "Users can manage their own notification settings" ON notification_settings;

-- Create RLS policies for necessity_items
CREATE POLICY "Users can view their own necessity items"
  ON necessity_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own necessity items"
  ON necessity_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own necessity items"
  ON necessity_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own necessity items"
  ON necessity_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for supply_items
CREATE POLICY "Users can view their own supply items"
  ON supply_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own supply items"
  ON supply_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supply items"
  ON supply_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own supply items"
  ON supply_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for price_history
-- Note: Price history can be viewed by anyone, but only the service role can insert
CREATE POLICY "Users can view price history"
  ON price_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service can manage price history"
  ON price_history FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for notification_settings
CREATE POLICY "Users can view their own notification settings"
  ON notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notification settings"
  ON notification_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a function to automatically update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update last_updated on supply_items
DROP TRIGGER IF EXISTS update_supply_items_last_updated ON supply_items;
CREATE TRIGGER update_supply_items_last_updated
  BEFORE UPDATE ON supply_items
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated_column();

-- Create a function to automatically set completed_at when completed is set to true
CREATE OR REPLACE FUNCTION update_completed_at_column()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
    NEW.completed_at = NOW();
  ELSIF NEW.completed = FALSE THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update completed_at on necessity_items
DROP TRIGGER IF EXISTS update_necessity_items_completed_at ON necessity_items;
CREATE TRIGGER update_necessity_items_completed_at
  BEFORE UPDATE ON necessity_items
  FOR EACH ROW
  EXECUTE FUNCTION update_completed_at_column();

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON necessity_items TO authenticated;
GRANT ALL ON supply_items TO authenticated;
GRANT SELECT ON price_history TO authenticated;
GRANT ALL ON notification_settings TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'SpeedShopping database migration completed successfully!';
  RAISE NOTICE 'Tables created: necessity_items, supply_items, price_history, notification_settings';
  RAISE NOTICE 'Row Level Security policies configured';
  RAISE NOTICE 'Triggers and functions created';
END $$;
