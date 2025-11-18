# SpeedShopping Database Migration Guide

## Critical: Run Database Migration First!

Before using the updated application, you **MUST** run the database schema update to add missing fields.

### Step 1: Run the Migration SQL

1. Log into your [Supabase Dashboard](https://app.supabase.com/)
2. Select your SpeedShopping project
3. Go to the **SQL Editor** (from the left sidebar)
4. Open the file `supabase-migration-update.sql` from your project directory
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **Run** to execute the migration

### Step 2: Verify the Migration

After running the migration, verify that the new columns exist:

```sql
-- Check supply_items table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'supply_items';

-- Check necessity_items table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'necessity_items';
```

You should see these new columns:
- **supply_items**: `price`, `currency`, `product_url`, `add_to_cart_url`
- **necessity_items**: `quantity`, `price`, `currency`, `product_url`, `add_to_cart_url`, `priority`

## What Changed?

### Backend Services
- ✅ Fixed supply service to handle price, currency, and URL fields
- ✅ Fixed necessity service to handle quantity, price, priority fields
- ✅ Updated analytics to calculate real spending data

### Frontend Fixes
- ✅ Analytics now fetches and displays real data instead of mock data
- ✅ Fixed authentication persistence (no more redirect to login on refresh)
- ✅ Dialogs no longer close on outside click
- ✅ Dialogs now confirm before closing if form has unsaved data
- ✅ Renamed "Shopping List" to "Necessity List" throughout the app
- ✅ Implemented consistent color scheme:
  - **Supply**: Blue
  - **Necessity**: Purple
  - **Alerts**: Red
  - **Analytics**: Green
  - **Success**: Green

### Database Schema
- Added `price`, `currency`, `product_url`, `add_to_cart_url` to `supply_items`
- Added `quantity`, `price`, `currency`, `product_url`, `add_to_cart_url`, `priority` to `necessity_items`
- Made `unit` field nullable in `supply_items`

## Known Issues Fixed

1. ✅ **500 error when adding supply items** - Fixed missing database fields
2. ✅ **NaN in prices** - Fixed missing price/quantity fields
3. ✅ **Login redirect on refresh** - Fixed auth state loading
4. ✅ **Fake analytics data** - Now shows real calculated data
5. ✅ **Dialog UX issues** - Improved with confirmations

## Running the Application

After migrating, start the application:

```bash
# Install dependencies (if not already done)
npm install

# Start both frontend and backend
npm run dev

# Or separately:
npm run dev:frontend
npm run dev:backend
```

## Color Coding Reference

The app now uses consistent colors for better UX:

- 🔵 **Blue (Primary)**: Supply/Inventory items
- 🟣 **Purple**: Necessity items (one-time purchases)
- 🔴 **Red**: Alerts, low stock warnings
- 🟢 **Green**: Analytics, success states, positive values
- 🟠 **Orange**: (reserved for future features)
- ⚫ **Gray**: Settings, neutral elements

## Need Help?

If you encounter any issues:
1. Check that the migration was successful
2. Verify your Supabase connection in `.env`
3. Check browser console for errors
4. Check backend logs for API errors
