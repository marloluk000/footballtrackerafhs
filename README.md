# AFHS Football Inventory Tracker

A modern, real-time inventory management system for American Fork High School Football team equipment. Built with Next.js, React, TypeScript, and Firebase.

## Features

- 📱 **Cross-Device Sync** - Real-time data synchronization across all devices using Firebase Firestore
- 🔍 **Smart Search** - Search players by name or jersey number
- ✅ **Equipment Tracking** - Complete checklist for all equipment items
- 📊 **Progress Tracking** - Visual progress indicators for each player
- ➕ **Easy Player Management** - Add new players with duplicate numbers support
- 🎨 **Modern UI** - Beautiful, responsive design that works on all devices
- 📲 **PWA Support** - Install as an app on iOS/Android devices
- 🔄 **Auto-Save** - Changes are saved automatically to the cloud

## Equipment Categories

The system tracks the following equipment for each player:

### Jerseys & Pants
- Game Jersey (Red, Black, White)
- Game Pants (Red, Black, White)
- Practice Jersey (Red, Black, White, Yellow)
- Belt (Red, Black, White)

### Protective Gear
- Helmet
- Guardian
- Shoulder Pads
- Girdle
- Knee Pads
- Practice Pants

### Other Items
- Win in the Dark (book)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Firebase account (free tier works great!)

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable Firestore Database:
   - Go to "Build" → "Firestore Database"
   - Click "Create Database"
   - Start in **production mode** or **test mode**
   - Choose your preferred region
4. Get your Firebase configuration:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Copy the configuration values

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploying to Production

#### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add your environment variables in Vercel project settings
5. Deploy!

Your app will be live at `https://your-project.vercel.app`

#### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `.next` folder to Netlify

## Usage Guide

### Adding a Player

1. Click the "Add Player" button in the header
2. Fill in the player details:
   - Number (required)
   - Name (required)
   - Grade, Position, Height, Weight (optional)
3. Click "Add Player"

**Note:** Duplicate jersey numbers are allowed to accommodate multiple players with the same number.

### Managing Equipment

1. Search for a player using the search bar (by name or number)
2. Click the "View" button next to the player
3. Check off equipment items as they are distributed
4. Click "Save Changes"

Changes are automatically synced across all devices!

### Tracking Progress

- The progress bar shows completion percentage for each player
- Green checkmark = All equipment distributed
- Equipment count shows completed/total items

## PWA Installation

### iOS (iPhone/iPad)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android
1. Open the app in Chrome
2. Tap the three dots menu
3. Tap "Add to Home Screen"
4. Tap "Add"

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install"

## Firebase Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{playerId} {
      // Allow read access to all
      allow read: if true;
      
      // Allow write access (you can add authentication here)
      allow write: if true;
    }
  }
}
```

**Important:** For better security, implement Firebase Authentication and restrict write access to authenticated users only.

## Initial Data

The app comes pre-loaded with all current American Fork High School football players. On first launch, the system will automatically populate the Firebase database with the complete roster.

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Icons:** Lucide React
- **Deployment:** Vercel (recommended)

## Support

For issues or questions, contact your team administrator.

## License

Created for American Fork High School Football Team.

# footballtrackerafhs

