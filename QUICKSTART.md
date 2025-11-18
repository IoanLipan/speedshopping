# SpeedShopping - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Firebase account (free tier is fine)

## Setup Steps

### 1. Clone and Install

```bash
cd speedshopping
npm install
```

### 2. Firebase Setup (5 minutes)

#### Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "SpeedShopping" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication

1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Click "Email/Password"
4. Enable it and click "Save"

#### Enable Firestore

1. Click "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (we'll secure it later)
4. Choose a location
5. Click "Enable"

#### Get Firebase Config

1. Click the gear icon → "Project settings"
2. Scroll to "Your apps" → Click web icon (</>)
3. Register app as "SpeedShopping Web"
4. Copy the configuration

#### Get Firebase Admin SDK

1. Still in Project Settings → "Service accounts"
2. Click "Generate new private key"
3. Save the JSON file

### 3. Configure Frontend

```bash
# Copy example env file
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env` and paste your Firebase config:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Configure Backend

```bash
# Copy example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your Firebase Admin SDK info:

```env
PORT=3000
NODE_ENV=development

# From the service account JSON file:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Optional: Email notifications (use any SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=SpeedShopping <noreply@speedshopping.app>
```

**Note:** For the private key, keep it on one line with `\n` for line breaks.

### 5. Run the App

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### 6. Create Your First Account

1. Open http://localhost:5173
2. Click "Sign up"
3. Enter email and password
4. Click "Sign Up"
5. You're in!

## First Steps

### Add Your First Supply Item

1. Click "Supply List"
2. Click "+ Add Item"
3. Fill in:
   - Name: "Cottage Cheese"
   - Quantity: 10
   - Daily Consumption: 1
   - Price: 3.99
   - Low Stock Threshold: 3
4. Click "Add"

The app will show you have 10 days of cottage cheese remaining!

### Add Your First Shopping Item

1. Click "Shopping List"
2. Click "+ Add Item"
3. Fill in:
   - Name: "Toilet Paper"
   - Quantity: 2
   - Price: 15.99
   - Priority: High
4. Click "Add"

### View Analytics

Click "Analytics" to see your spending breakdown.

## Testing the Countdown System

The countdown runs automatically at midnight, but you can test it manually:

```bash
cd backend
npm run countdown
```

This will:
1. Decrement all items by their daily consumption
2. Update days remaining
3. Send notifications for low stock items

## Next Steps

- Add product URLs for easy reordering
- Set up email notifications (configure SMTP in backend/.env)
- Try the undo/redo functionality
- Enable edit mode to batch edit items
- Check out FEATURES.md for detailed feature documentation

## Troubleshooting

### Frontend won't connect to backend
- Make sure backend is running on port 3000
- Check that VITE_API_URL is set correctly

### Authentication errors
- Verify Firebase config is correct
- Check that Authentication is enabled in Firebase Console
- Make sure you're using the correct Firebase config for frontend vs backend

### Database errors
- Verify Firestore is enabled
- Check that security rules allow read/write in test mode
- Look at browser console for detailed errors

### Email notifications not working
- Verify SMTP credentials
- For Gmail, create an App Password: https://support.google.com/accounts/answer/185833
- Check backend logs for error messages

## Need Help?

- Read the full [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Review [FEATURES.md](FEATURES.md) for feature details

## Mobile Development

To run on mobile:

```bash
cd frontend
npm run build
npx cap add ios      # For iOS
npx cap add android  # For Android
npx cap sync
npx cap open ios     # Opens Xcode
npx cap open android # Opens Android Studio
```

Enjoy using SpeedShopping! 🛒
