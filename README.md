# SpeedShopping - Smart Inventory & Shopping Management

A Vue.js + Capacitor mobile and web app for managing your household inventory and shopping needs.

## Features

- **Supply List**: Track items you have with consumption rates and auto-decrementing countdown
- **Necessity List**: Shopping todo list for items you need to buy
- **Smart Notifications**: Get reminded when you're running low on items (mobile + email)
- **Spending Analytics**: Track spending daily/weekly/monthly/yearly
- **Undo/Redo**: Full edit history with undo stack
- **Price Tracking**: Real-time price scraping and monitoring (Premium feature)
- **Direct Cart**: Add items directly to online shopping carts

## Tech Stack

- **Frontend**: Vue 3 + Vite + TypeScript + Tailwind CSS + Capacitor
- **Backend**: Node.js + Express + TypeScript
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **Mobile**: Capacitor (iOS + Android)

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Run development servers (frontend + backend)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
speedshopping/
├── frontend/          # Vue 3 + Capacitor app
├── backend/           # Node.js + Express API
└── package.json       # Root package with workspaces
```

## Development

- Frontend runs on: http://localhost:5173
- Backend API runs on: http://localhost:3000

## Mobile Deployment

```bash
cd frontend
npm run build
npx cap sync
npx cap open ios     # For iOS
npx cap open android # For Android
```
