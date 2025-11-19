# Database Migration Instructions

## IMPORTANT: Fix "Got 1" Button

The "Got 1" button was not working because the database was missing the `acquired_quantity` and `times_added_to_cart` columns.

### To Fix This Issue:

1. **Log in to your Supabase Dashboard**
   - Go to https://supabase.com
   - Navigate to your SpeedShopping project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the Migration**
   - Open the file: `supabase-migration-acquired-quantity.sql`
   - Copy all the SQL content
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

4. **Verify the Migration**
   - You should see a success message
   - The `necessity_items` table will now have:
     - `acquired_quantity` column (tracks how many items you've gotten)
     - `times_added_to_cart` column (tracks cart additions)

5. **Test the "Got 1" Button**
   - Refresh your app
   - Click "Got 1" on any necessity item
   - The acquired quantity should now increment correctly!

## What This Migration Does

```sql
-- Adds acquired_quantity column
ALTER TABLE necessity_items
  ADD COLUMN IF NOT EXISTS acquired_quantity INTEGER NOT NULL DEFAULT 0 CHECK (acquired_quantity >= 0);

-- Adds times_added_to_cart column
ALTER TABLE necessity_items
  ADD COLUMN IF NOT EXISTS times_added_to_cart INTEGER NOT NULL DEFAULT 0 CHECK (times_added_to_cart >= 0);

-- Creates index for better performance
CREATE INDEX IF NOT EXISTS idx_necessity_items_acquired_quantity ON necessity_items(acquired_quantity);
```

## Other Improvements in This Update

### 1. Analytics Toggle Now Works
- The day/week/month/year toggle in Analytics now properly refetches data
- Fixed by adding a watcher that triggers when the period changes

### 2. Default Household Necessities
- New users automatically get 20 common household items added to their shopping list
- Items include:
  - Toilet Paper, Hand Soap, Dish Soap, Laundry Detergent
  - Eggs, Milk, Bread, Coffee, Rice, Pasta
  - Shampoo, Body Wash, Toothpaste
  - And more!
- Users can easily remove or modify these items

### 3. Bigger Text for Important Info
- **Quantities**: Increased from 13px to 24px (bold)
- **Prices**: Increased from 18px to 32px (bold)
- **Buttons**: Increased from 13px to 16px with bigger padding
- **Progress Bar**: Increased from 8px to 12px height
- **Icons**: Increased from 16px to 20px

### 4. Enhanced Tinder-Like Experience
- Swipe left = "Got it!" (marks item as acquired)
- Swipe right = "Need more" (increases quantity needed)
- Visual feedback during swipes
- Swipe hint shows on first use
- Works on both mobile (touch) and desktop (mouse)

## Files Changed

### Backend
- No backend changes needed

### Frontend
- `frontend/src/views/AnalyticsView.vue` - Added watcher for period changes
- `frontend/src/stores/auth.ts` - Auto-add default items for new users
- `frontend/src/data/defaultNecessities.ts` - NEW: List of default household items
- `frontend/src/components/SwipeableShoppingCard.vue` - Bigger text for quantities and prices

### Database
- `supabase-migration-acquired-quantity.sql` - NEW: Adds missing columns

## Need Help?

If you encounter any issues:
1. Check that the migration ran successfully in Supabase
2. Clear your browser cache and refresh
3. Check the browser console for any errors
4. Verify your Supabase connection is working
