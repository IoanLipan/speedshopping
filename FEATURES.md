# SpeedShopping - Feature Documentation

## Core Features

### 1. Supply List (Inventory Management)

Track items you have in stock with intelligent consumption-based countdown.

**Features:**
- Add items with quantity, daily consumption rate, and price
- Automatic calculation of days remaining
- Low stock threshold alerts
- Auto-decrementing countdown (daily job)
- Product links for easy reordering
- Direct "Add to Cart" links
- Category organization
- Search and filter functionality
- Edit mode for bulk management

**Use Case:**
```
Item: Cottage Cheese
Quantity: 10 containers
Daily Consumption: 1 container/day
Days Remaining: 10 days (auto-calculated)
Low Stock Threshold: 3 days
→ App will notify you when you have 3 days or less remaining
```

### 2. Necessity List (Shopping List)

Manage your shopping list with priority-based organization.

**Features:**
- Add items you need to buy
- Set priority levels (low, medium, high)
- Track total estimated cost
- Mark items as complete
- Product links for reference
- Direct "Add to Cart" functionality
- Category organization
- Filter by priority
- Show/hide completed items

**Use Case:**
```
Item: Toilet Paper
Quantity: 2 packs
Priority: High
Price: $15.99 each
Total: $31.98
→ Appears at top of list, contributes to total shopping cost
```

### 3. Undo/Redo System

Full edit history with ability to undo and redo changes.

**Features:**
- Tracks all create, update, and delete operations
- Unlimited undo/redo (up to 50 actions)
- Preserves state for both supply and necessity items
- Visual indicators for undo/redo availability

**Use Case:**
```
1. Delete item by mistake
2. Click "Undo" button
3. Item is restored with all data
```

### 4. Edit Mode

Clean interface that hides editing controls until needed.

**Features:**
- Toggle between view and edit modes
- Prevents accidental modifications
- Shows additional item details (notes, etc.)
- Quick access to edit and delete functions

### 5. Spending Analytics

Comprehensive spending insights across different time periods.

**Features:**
- Daily, weekly, monthly, and yearly spending views
- Spending breakdown by category
- Spending breakdown by item
- Visual progress bars
- Automatic calculation based on consumption rates
- Includes both inventory and shopping list items

**Calculations:**
```
Supply Items: Daily consumption × price × 365 = yearly cost
Necessity Items: One-time purchase cost
Total: Combined spending across all items
```

### 6. Auto-Decrementing Countdown System

Automated daily job that decrements inventory based on consumption.

**Features:**
- Runs daily at midnight
- Decrements quantity by daily consumption rate
- Recalculates days remaining
- Triggers low stock notifications
- Updates timestamp for tracking

**Technical Details:**
- Cron job scheduled via node-cron
- Can be run manually for testing
- Processes all users' supply items
- Atomic updates per item

### 7. Notification System

Multi-channel notifications for low stock alerts.

**Features:**
- Email notifications with item details
- Push notifications (mobile)
- Configurable low stock threshold
- Rich HTML emails with direct links
- Batch notifications for multiple low stock items

**Email Example:**
```
Subject: ⚠️ Low Stock Alert - SpeedShopping

You have 3 items running low:
- Cottage Cheese: 2 days remaining [View Product] [Add to Cart]
- Eggs: 1 day remaining [View Product] [Add to Cart]
- Milk: 3 days remaining [View Product] [Add to Cart]
```

### 8. Price Scraping (Premium Feature)

Automated price monitoring for tracked products.

**Features:**
- Scrapes current price from product URLs
- Stores price history
- Price change alerts via email
- Supports multiple e-commerce platforms
- Visual price trends

**Supported Sites:**
- Amazon
- General e-commerce sites with standard markup
- Customizable selectors for specific sites

**Technical Details:**
- Uses Cheerio for HTML parsing
- Axios for HTTP requests
- Multiple price selector patterns
- Rate limiting to avoid blocking
- Price history stored in Firestore

### 9. Direct Add-to-Cart Links

One-click shopping for tracked items.

**Features:**
- Store direct cart links for items
- Quick access from both supply and necessity lists
- Opens in new tab for seamless shopping
- Supports any e-commerce platform

**Use Case:**
```
Running low on cottage cheese?
1. Get low stock notification
2. Click "Add to Cart" link
3. Product is added to your preferred store's cart
4. Complete checkout
```

### 10. Firebase Authentication

Secure, easy-to-use authentication system.

**Features:**
- Email/password authentication
- Secure token-based API authentication
- User session management
- Protected routes
- Easy registration and login

### 11. Cross-Platform Support

Works seamlessly across devices.

**Platforms:**
- Web (any modern browser)
- iOS (via Capacitor)
- Android (via Capacitor)
- Progressive Web App (PWA)

**Features:**
- Responsive design for all screen sizes
- Native mobile features (notifications, haptics)
- Offline support (coming soon)
- Sync across devices

## User Workflows

### Workflow 1: Setting Up Your Inventory

1. Sign up / Log in
2. Go to Supply List
3. Click "+ Add Item"
4. Enter item details:
   - Name: "Cottage Cheese"
   - Quantity: 10
   - Daily Consumption: 1
   - Price: $3.99
   - Low Stock Threshold: 3 days
5. Optionally add product URL and add-to-cart link
6. Save item
7. Item shows "10 days remaining"

### Workflow 2: Getting Low Stock Alerts

1. Countdown job runs daily at midnight
2. Item quantity is decreased by daily consumption
3. Days remaining is recalculated
4. When days remaining ≤ threshold:
   - Email notification sent
   - Push notification sent (mobile)
5. User clicks notification
6. Adds item to necessity list or orders directly

### Workflow 3: Shopping List Management

1. Go to Necessity List
2. Add items you need to buy
3. Set priorities (high for urgent items)
4. View total estimated cost
5. Click "Add to Cart" links to shop
6. Mark items as complete when purchased
7. View analytics to track spending

### Workflow 4: Price Monitoring (Premium)

1. Add product URL to item
2. Enable price monitoring
3. System scrapes price daily
4. Price changes are detected
5. Email alert sent if price changes
6. View price history chart
7. Buy when price drops

## Technical Architecture

### Frontend Stack
- Vue 3 with Composition API
- Vite (build tool)
- TypeScript
- Tailwind CSS
- Pinia (state management)
- Vue Router
- Capacitor (mobile)

### Backend Stack
- Node.js + Express
- TypeScript
- Firebase Admin SDK
- Firestore (database)
- Nodemailer (email)
- Node-cron (scheduling)
- Cheerio (web scraping)

### Database Schema

**Collections:**
1. `supplyItems` - Inventory items
2. `necessityItems` - Shopping list items
3. `priceHistory` - Price tracking data
4. `notificationSettings` - User notification preferences

### Security

- Firebase Authentication for user management
- JWT token-based API authentication
- Firestore security rules
- Environment variables for secrets
- CORS protection
- Input validation

## Future Enhancements

Potential features for future versions:

1. **Barcode Scanning** - Scan products to add them
2. **Recipe Integration** - Calculate consumption based on recipes
3. **Shared Lists** - Family/household sharing
4. **Budget Tracking** - Set spending limits
5. **Store Comparison** - Compare prices across stores
6. **Subscription Tracking** - Manage recurring purchases
7. **Waste Reduction** - Track expired items
8. **Smart Suggestions** - AI-powered shopping recommendations
9. **Voice Commands** - "Add milk to shopping list"
10. **Offline Mode** - Full offline functionality with sync

## Monetization Strategy

### Free Tier
- Basic inventory management
- Shopping list
- Manual price entry
- Email notifications
- Up to 50 items

### Premium Tier ($4.99/month)
- Unlimited items
- Automated price scraping
- Price drop alerts
- Price history charts
- Priority support
- Advanced analytics
- Export data (CSV, PDF)

### Business Tier ($19.99/month)
- Everything in Premium
- Multi-user accounts
- Team collaboration
- API access
- White-label option
- Custom integrations
