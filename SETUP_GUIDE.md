# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Node.js
If you don't have Node.js installed:
- Go to https://nodejs.org/
- Download and install the LTS version
- Verify installation: `node --version`

### Step 2: Set Up Firebase

1. **Create a Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add Project"
   - Enter "AFHS-Football-Inventory" as the project name
   - Disable Google Analytics (optional)
   - Click "Create Project"

2. **Enable Firestore Database**
   - In your Firebase project, click "Build" → "Firestore Database"
   - Click "Create database"
   - Select "Start in test mode" (you can secure it later)
   - Choose "us-central" (or your preferred region)
   - Click "Enable"

3. **Get Your Firebase Config**
   - Click the gear icon ⚙️ → "Project settings"
   - Scroll down to "Your apps"
   - Click the "</>" (web) icon
   - Register your app (name it "AFHS Inventory")
   - Copy the configuration object

### Step 3: Configure the Application

1. **Open Terminal/Command Prompt**
   ```bash
   cd /tmp/afhs-inventory
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   (This will take 2-3 minutes)

3. **Create Environment File**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Edit .env.local**
   - Open `.env.local` in a text editor
   - Paste your Firebase configuration values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=afhs-football-inventory.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=afhs-football-inventory
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=afhs-football-inventory.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### Step 4: Run the App

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

🎉 **You're done!** The app will automatically load all 90+ players on first launch.

---

## 📱 Deploy to Production

### Option 1: Deploy to Vercel (Easiest - Free)

1. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com/
   - Sign up for free

2. **Push Your Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/afhs-inventory.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com/
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Add your environment variables (from .env.local)
   - Click "Deploy"

Your app will be live at: `https://your-project.vercel.app`

### Option 2: Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 📲 Install as an App

### iPhone/iPad
1. Open the deployed website in Safari
2. Tap the Share button (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

### Android
1. Open the website in Chrome
2. Tap the three dots menu
3. Tap "Add to Home Screen"
4. Tap "Add"

---

## 🔐 Secure Your Database (Important for Production!)

1. Go to Firebase Console → Firestore Database → Rules
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{playerId} {
      allow read: if true;  // Anyone can read
      allow write: if request.auth != null;  // Only authenticated users can write
    }
  }
}
```

3. Set up Firebase Authentication (optional but recommended):
   - Go to "Build" → "Authentication"
   - Click "Get Started"
   - Enable "Email/Password" or "Google" sign-in
   - Add user accounts for your coaches

---

## 💡 Tips

- **Backup Your Data:** Export your Firestore data regularly from Firebase Console
- **Test on Mobile:** The app is optimized for mobile devices
- **Offline Support:** The app will work offline and sync when back online
- **Multiple Users:** Multiple people can use the app simultaneously
- **Search is Fast:** Type player numbers or names to quickly find them

---

## ❓ Troubleshooting

### "Firebase error" or "Permission denied"
- Check your Firebase rules (see "Secure Your Database" above)
- Make sure Firestore is enabled in your Firebase project

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` folder and `.next` folder, then run `npm install`

### Changes not showing up
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check that all users are using the same Firebase project

### App won't install on phone
- Make sure you're using HTTPS (required for PWA)
- Try a different browser (Safari on iOS, Chrome on Android)

---

## 📞 Need Help?

Check the full README.md for more detailed information, or contact your web administrator.

