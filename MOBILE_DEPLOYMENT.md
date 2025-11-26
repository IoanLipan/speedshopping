# 📱 SpeedShopping - Mobile Deployment Guide

This guide will help you deploy the SpeedShopping app to Android and iOS devices.

## ✅ Prerequisites

The app is already configured with:
- ✅ Capacitor 5.x installed
- ✅ Android platform added (`frontend/android/`)
- ✅ iOS platform added (`frontend/ios/`)
- ✅ Mobile plugins configured (StatusBar, Keyboard, Haptics, Notifications)

## 🏗️ Build the App

Before deploying to mobile, you need to build the web assets:

```bash
# From the project root
npm install

# Build the frontend
npm run build
```

## 📱 Deploy to Android

### Requirements
- Android Studio installed
- Java JDK 11 or higher
- Android SDK

### Steps

1. **Sync the latest build with Capacitor:**
   ```bash
   npx cap sync android
   ```

2. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

3. **In Android Studio:**
   - Connect your Android device or start an emulator
   - Click the "Run" button (green play icon)
   - Select your device/emulator
   - The app will install and launch!

### Building Release APK/AAB

1. In Android Studio: `Build` → `Generate Signed Bundle / APK`
2. Choose APK or AAB
3. Create or select your signing keystore
4. Build release version
5. Find the output in `frontend/android/app/build/outputs/`

## 🍎 Deploy to iOS

### Requirements
- macOS computer
- Xcode 14+ installed
- Apple Developer account (for device deployment)
- CocoaPods installed: `sudo gem install cocoapods`

### Steps

1. **Install iOS dependencies:**
   ```bash
   cd frontend/ios/App
   pod install
   cd ../../..
   ```

2. **Sync the latest build with Capacitor:**
   ```bash
   npx cap sync ios
   ```

3. **Open in Xcode:**
   ```bash
   npx cap open ios
   ```

4. **In Xcode:**
   - Select your development team in Signing & Capabilities
   - Connect your iPhone/iPad or select a simulator
   - Click the "Run" button (play icon)
   - The app will install and launch!

### Building for App Store

1. In Xcode: `Product` → `Archive`
2. Once archived, click "Distribute App"
3. Follow the wizard to upload to App Store Connect
4. Submit for review in App Store Connect

## 🔄 Development Workflow

When you make changes to the frontend code:

```bash
# 1. Build the web assets
npm run build

# 2. Sync with mobile platforms
npx cap sync

# 3. Re-run in Android Studio or Xcode
```

## 🎨 Mobile Features Included

### ✅ Already Implemented

- **Status Bar Management**: Dark mode status bar configured
- **Keyboard Handling**: Automatic keyboard show/hide detection
- **Haptic Feedback**: Touch feedback on swipe gestures
- **Touch Targets**: Minimum 48px touch targets for accessibility
- **Safe Areas**: Proper padding for notches and home indicators
- **Responsive Design**: Mobile-optimized layouts
- **Swipe Gestures**: Native-feeling swipe interactions
- **Modern UI**: Glassmorphism effects and smooth animations

### 📦 Configured Plugins

```typescript
// Already configured in capacitor.config.ts
- @capacitor/app - App lifecycle events
- @capacitor/status-bar - Status bar styling
- @capacitor/keyboard - Keyboard management
- @capacitor/haptics - Touch feedback
- @capacitor/local-notifications - Local notifications
- @capacitor/push-notifications - Push notifications
```

## 📝 Configuration Files

### `frontend/capacitor.config.ts`
```typescript
{
  appId: 'com.speedshopping.app',
  appName: 'SpeedShopping',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#0ea5e9',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
}
```

## 🔧 Troubleshooting

### Android Issues

**Build fails:**
```bash
# Clean and rebuild
cd frontend/android
./gradlew clean
cd ../..
npx cap sync android
```

**App not updating:**
```bash
# Clear cache and reinstall
npx cap sync android --force
```

### iOS Issues

**CocoaPods errors:**
```bash
cd frontend/ios/App
pod deintegrate
pod install
cd ../../..
```

**Signing issues:**
- Ensure you have a valid Apple Developer account
- Check Bundle Identifier in Xcode matches your app ID
- Verify signing certificates are installed

## 🚀 Performance Tips

1. **Optimize images** before building
2. **Enable minification** in vite.config.ts (already configured)
3. **Use code splitting** for lazy loading (already implemented)
4. **Test on real devices** for accurate performance metrics

## 📊 App Size

Current build sizes (approximate):
- **Web build**: ~350KB (gzipped)
- **Android APK**: ~15-20MB
- **iOS App**: ~20-25MB

## 🔐 Environment Variables

Make sure to configure your environment variables:

```bash
# Create .env file in frontend/
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Testing

### Test on Emulators
- **Android**: Use Android Studio AVD Manager
- **iOS**: Use Xcode Simulator

### Test on Real Devices
- **Android**: Enable USB debugging, connect via USB
- **iOS**: Register device in Apple Developer, connect via USB

## 🎯 Next Steps

1. **Test thoroughly** on both platforms
2. **Configure app icons** in Android Studio and Xcode
3. **Add splash screens** for better UX
4. **Set up CI/CD** for automated builds
5. **Submit to app stores** when ready!

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com)
- [iOS Developer Guide](https://developer.apple.com/documentation)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

## 🆘 Need Help?

- Check [Capacitor Community](https://github.com/capacitor-community)
- Review [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)
- Open an issue in this repository

---

**Congratulations! Your app is ready for mobile deployment! 🎉**
