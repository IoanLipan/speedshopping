# Database Seeding & Quick-Add Features Guide

This guide explains how to use the database seeding script and the new Quick-Add feature for common household items.

## Table of Contents
1. [Database Seeding](#database-seeding)
2. [Quick-Add Feature](#quick-add-feature)
3. [Customizing Templates](#customizing-templates)

---

## Database Seeding

### Overview
The `seed-database.sql` file contains pre-configured common household items that can be bulk-inserted into your database. This saves you from manually entering dozens of items.

### What's Included

The seeding script includes **50+ common items** across multiple categories:

**Food & Kitchen:**
- Eggs, Milk, Cottage Cheese, Bread, Butter, Cheese, Yogurt
- Pasta, Rice, Flour, Olive Oil, Salt, Sugar
- Coffee, Tea, Orange Juice
- Chicken Breast, Ground Beef

**Household & Cleaning:**
- Toilet Paper, Paper Towels, Dish Sponge
- Dish Soap, Laundry Detergent, Fabric Softener
- All-Purpose Cleaner, Trash Bags, Dishwasher Tablets

**Personal Care:**
- Shampoo, Conditioner, Body Wash
- Toothpaste, Tissues, Deodorant, Hand Soap

**Produce:**
- Apples, Bananas, Tomatoes, Potatoes
- Onions, Carrots, Lettuce, Cucumbers

**Condiments:**
- Ketchup, Mayonnaise, Mustard, Soy Sauce, Vinegar

### How to Use the Seeding Script

#### Step 1: Get Your User ID

First, you need to find your user ID from Supabase. You can do this in two ways:

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Find your email and copy the UUID in the "id" column

**Option B: Via SQL Query**
Run this query in the Supabase SQL Editor:
```sql
SELECT id FROM auth.users WHERE email = 'your-email@example.com';
```

#### Step 2: Update the SQL Script

1. Open `seed-database.sql`
2. Find all instances of `'YOUR_USER_ID_HERE'`
3. Replace with your actual user ID (UUID format)
   - Example: `'12345678-1234-1234-1234-123456789abc'`

**Find & Replace:**
- Find: `'YOUR_USER_ID_HERE'`
- Replace with: `'your-actual-user-id-here'`

#### Step 3: Run the Script

**Via Supabase Dashboard:**
1. Go to SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the entire contents of `seed-database.sql`
4. Click "Run"

**Via psql CLI:**
```bash
psql -h your-db-host -U postgres -d postgres -f seed-database.sql
```

#### Step 4: Verify the Data

Run these queries to confirm the data was inserted:

```sql
-- Check supply items count
SELECT COUNT(*) FROM supply_items WHERE user_id = 'your-user-id';

-- Check necessity items count
SELECT COUNT(*) FROM necessity_items WHERE user_id = 'your-user-id';

-- View all supply items by category
SELECT * FROM supply_items
WHERE user_id = 'your-user-id'
ORDER BY category, name;
```

---

## Quick-Add Feature

### Overview
The Quick-Add feature allows you to instantly add common household items to your inventory without filling out a form. Just click an icon!

### How to Use

#### In Supply List View:

1. Navigate to the **Supply List** page
2. Look for the "⚡ Quick Add Common Items" section
3. Click to expand it
4. **Filter by category** (optional):
   - Select from dropdown: Food, Household, Personal Care, Produce, Beverages, Pantry, etc.
   - Or leave on "All Categories" to see everything
5. **Click any item** to instantly add it to your inventory
   - Items are added with sensible default values
   - You can edit the details later if needed

#### In Shopping List (Necessity View):

1. Navigate to the **Shopping List** page
2. Look for the "⚡ Quick Add Common Items" section
3. Click to expand it
4. **Filter by category** (optional):
   - Kitchen, Household, Personal Care, Electronics, Stationery
5. **Click any item** to add it to your shopping list

### Features

- **Visual Icons**: Each item has an emoji icon for easy recognition
- **Default Values**: Pre-configured with reasonable quantities and consumption rates
- **Category Filtering**: Quickly find items by category
- **One-Click Add**: No forms to fill out - just click and it's added
- **Editable**: All quick-added items can be edited afterwards

### What Gets Added

When you click a quick-add item, here's what gets populated:

**For Supply Items:**
- Name (e.g., "Toilet Paper")
- Default quantity (e.g., 12 rolls)
- Unit (e.g., "rolls")
- Daily consumption rate (e.g., 1 roll/day)
- Low stock threshold (e.g., alert when 4 rolls remaining)
- Category (e.g., "Household")
- Notes (e.g., "3-ply toilet paper")

**For Necessity Items:**
- Name
- Default quantity
- Category
- Priority (set to "medium" by default)
- Notes

**Note:** Price and URLs are set to defaults (0 and empty) - you can add these later by editing the item.

---

## Customizing Templates

### Adding Your Own Templates

You can customize the available quick-add items by editing:
```
frontend/src/data/productTemplates.ts
```

### Adding a New Supply Item Template

```typescript
{
  name: 'Your Item Name',
  category: 'Category Name',
  defaultQuantity: 10,
  unit: 'pieces',
  defaultDailyConsumption: 1,
  defaultLowStockThreshold: 3,
  notes: 'Any notes about this item',
  icon: '🛒', // Choose an emoji icon
}
```

### Adding a New Necessity Item Template

```typescript
{
  name: 'Your Item Name',
  category: 'Category Name',
  defaultQuantity: 1,
  unit: 'piece',
  defaultDailyConsumption: 0,
  defaultLowStockThreshold: 0,
  notes: 'Any notes about this item',
  icon: '📦',
}
```

### Available Categories

**Supply Items:**
- Food
- Beverages
- Pantry
- Household
- Personal Care
- Produce
- Condiments

**Necessity Items:**
- Kitchen
- Household
- Personal Care
- Electronics
- Stationery

You can create new categories by simply using a new category name in your template.

### Finding Emoji Icons

- Use your system's emoji picker (usually Win + . on Windows or Cmd + Ctrl + Space on Mac)
- Or visit [Emojipedia](https://emojipedia.org/)
- Choose emojis that visually represent the item

---

## Tips & Best Practices

### For Seeding:
1. **Customize quantities** based on your household size
2. **Adjust daily consumption** to match your actual usage
3. **Remove items you don't use** before running the script
4. **Add your local items** by editing the SQL file
5. **Run verification queries** to ensure data loaded correctly

### For Quick-Add:
1. **Use it for common items** you buy regularly
2. **Edit items after adding** to set accurate prices and URLs
3. **Customize the templates** to match your shopping habits
4. **Filter by category** to find items faster
5. **Add your own templates** for items you frequently purchase

### Data Management:
1. Quick-add is great for initial setup
2. Edit items to add product URLs for price tracking
3. Update daily consumption rates based on actual usage
4. Set low stock thresholds that work for your shopping frequency

---

## Troubleshooting

### "Failed to add item"
- Check your internet connection
- Verify you're logged in
- Check browser console for detailed errors

### "Items not showing after seeding"
- Verify you used the correct user_id
- Check that the SQL script ran without errors
- Refresh the page
- Check the browser's network tab for API errors

### "Templates not loading"
- Clear your browser cache
- Check the browser console for errors
- Verify the productTemplates.ts file is properly formatted

---

## Summary

You now have two powerful ways to populate your inventory:

1. **Bulk Seeding**: Use `seed-database.sql` to add 50+ items at once
2. **Quick-Add**: Click icons in the UI to add items one-by-one

Both methods save significant time compared to manually filling out forms for each item!

Enjoy your streamlined inventory management! 🚀
