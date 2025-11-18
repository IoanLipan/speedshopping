# SpeedShopping Deployment Guide

## Prerequisites

Before deploying, make sure you have:

1. Node.js 18+ installed
2. Firebase project created
3. (For mobile) Android Studio (Android) or Xcode (iOS) installed

## Initial Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password provider)
4. Enable Firestore Database
5. (Optional) Enable Firebase Cloud Messaging for push notifications

#### Frontend Configuration

1. Copy `frontend/.env.example` to `frontend/.env`
2. Fill in your Firebase configuration:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### Backend Configuration

1. Download your Firebase Admin SDK service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file

2. Copy `backend/.env.example` to `backend/.env`
3. Fill in the configuration:

```env
PORT=3000
NODE_ENV=development

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Email configuration (for Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=SpeedShopping <noreply@speedshopping.app>
```

**Note:** For Gmail, create an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

### 3. Firestore Security Rules

Set up security rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Supply Items
    match /supplyItems/{itemId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.userId;
    }

    // Necessity Items
    match /necessityItems/{itemId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.userId;
    }

    // Price History
    match /priceHistory/{priceId} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write
    }

    // Notification Settings
    match /notificationSettings/{userId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == userId;
    }
  }
}
```

## Development

### Run Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:
npm run dev:frontend  # Runs on http://localhost:5173
npm run dev:backend   # Runs on http://localhost:3000
```

### Run Countdown Job Manually

```bash
cd backend
npm run countdown
```

## Production Deployment

### Backend Deployment

#### Option 1: Deploy to Google Cloud Run

```bash
cd backend
gcloud run deploy speedshopping-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Option 2: Deploy to Heroku

```bash
cd backend
heroku create speedshopping-api
git push heroku main
```

#### Option 3: Deploy to any VPS

1. Build the backend:
```bash
cd backend
npm run build
```

2. Upload `dist` folder and `package.json` to your server
3. Install production dependencies: `npm install --production`
4. Run with PM2: `pm2 start dist/server.js --name speedshopping`
5. Set up a cron job for the countdown task

### Frontend Deployment

#### Option 1: Deploy to Vercel

```bash
cd frontend
npm install -g vercel
vercel
```

#### Option 2: Deploy to Netlify

```bash
cd frontend
npm run build
# Upload 'dist' folder to Netlify
```

#### Option 3: Deploy to Firebase Hosting

```bash
cd frontend
npm run build
firebase init hosting
firebase deploy
```

## Mobile Deployment

### iOS Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Add iOS platform:
```bash
npx cap add ios
npx cap sync ios
```

3. Open in Xcode:
```bash
npx cap open ios
```

4. Configure signing & capabilities in Xcode
5. Archive and upload to App Store Connect

### Android Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Add Android platform:
```bash
npx cap add android
npx cap sync android
```

3. Open in Android Studio:
```bash
npx cap open android
```

4. Build → Generate Signed Bundle / APK
5. Upload to Google Play Console

### Push Notifications Setup

1. **iOS:**
   - Enable Push Notifications capability in Xcode
   - Upload APNs certificate to Firebase Console

2. **Android:**
   - Firebase Cloud Messaging is automatically configured

## Environment Variables

Make sure to set these environment variables in production:

### Frontend
- `VITE_API_URL` - Your backend API URL
- All Firebase configuration variables

### Backend
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to 'production'
- Firebase Admin SDK credentials
- Email configuration for notifications

## Monitoring & Maintenance

### Set up Cron Job for Countdown

On your production server, add a cron job to run the countdown daily:

```bash
# Edit crontab
crontab -e

# Add this line (runs at midnight daily)
0 0 * * * cd /path/to/backend && npm run countdown
```

### Logs

- Backend logs are output to console
- Use PM2 or similar process manager to capture logs
- Consider integrating with logging services like LogRocket or Sentry

## Troubleshooting

### Firebase Connection Issues
- Verify your Firebase configuration
- Check Firestore security rules
- Ensure service account has proper permissions

### Email Notifications Not Sending
- Verify SMTP credentials
- For Gmail, ensure "Less secure app access" is enabled or use App Password
- Check spam folder

### Mobile Build Issues
- Ensure all Capacitor plugins are installed
- Run `npx cap sync` after any changes
- Check platform-specific logs in Xcode/Android Studio

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] Firebase security rules are properly configured
- [ ] CORS is configured for production domains only
- [ ] API authentication is enforced on all routes
- [ ] HTTPS is enabled in production
- [ ] Rate limiting is implemented (recommended)
- [ ] Input validation is implemented

## Support

For issues or questions:
- Check the main README.md
- Review Firebase documentation
- Check Capacitor documentation for mobile issues
