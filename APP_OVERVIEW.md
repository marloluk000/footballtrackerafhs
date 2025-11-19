# AFHS Football Equipment Inventory Tracker - Comprehensive Overview

## What It Is
A web application for tracking football equipment inventory for American Fork High School. Coaches and staff can track which equipment items each player has returned, with grade-specific requirements and real-time synchronization across all devices.

## Core Features

### Player Management
- ✅ **113 players** tracked across 3 class periods
  - Period 1 (Sec 001): 38 students
  - Period 2 (Sec 002): 35 students
  - Period 5 (Sec 005): 40 students
- ✅ **Player Information Tracked:**
  - Name
  - Student ID (searchable but hidden from view)
  - Jersey Number (optional)
  - Grade (Freshman, Sophomore, Junior, Senior, or Unknown)
  - Position
  - Height
  - Weight
  - Class Period
- ✅ Add new players manually
- ✅ Real-time sync across all devices via Firebase Cloud Firestore

### Equipment Tracking

#### Standard Equipment Items Available
- **Jerseys:**
  - Red Jersey
  - Black Jersey
  - White Jersey
  - Sophomore Red Jersey (only visible/required for sophomores)
- **Pants:**
  - Red Pants
  - Black Pants
  - White Pants
- **Protective Equipment:**
  - Helmet
  - Guardian
  - Shoulder Pads
  - Girdle
  - Knee Pads
- **Additional Items:**
  - Practice Pants
  - Belt
  - Book: "Win in the Dark"
- **Custom Equipment Items:**
  - Add any additional items that were returned (allows tracking beyond standard 14 items)
  - Examples: Extra jerseys, additional pads, etc.
  - Counts toward progress (e.g., 15/14, 16/14)

#### Grade-Specific Equipment Requirements

**Sophomores (So.) - 11 Required Items:**
1. Jersey - Sophomore Red
2. Jersey - White
3. Pants - Red
4. Helmet
5. Guardian
6. Shoulder Pads
7. Girdle
8. Knee Pads
9. Practice Pants
10. Belt
11. Win in the Dark (Book)

**All Other Grades (Freshman, Junior, Senior) - 15 Required Items:**
1. Jersey - Red
2. Jersey - Sophomore Red (tracked but not required for non-sophomores)
3. Jersey - Black
4. Jersey - White
5. Pants - Red
6. Pants - Black
7. Pants - White
8. Helmet
9. Guardian
10. Shoulder Pads
11. Girdle
12. Knee Pads
13. Practice Pants
14. Belt
15. Win in the Dark (Book)

#### Special Features
- ✅ **"Never Received" Tracking:**
  - Collapsible dropdown at bottom of equipment checklist
  - Mark items that player never received in the first place
  - These items don't count against progress or appear in missing reports
  - Useful for tracking equipment that was never issued

### Filtering & Search
- ✅ **Search Functionality:**
  - Search by player name
  - Search by jersey number
  - Search by student ID (hidden but searchable)
- ✅ **Filter Options:**
  - Filter by grade (Freshman, Sophomore, Junior, Senior, or All Grades)
  - Filter by class period (Period 1, Period 2, Period 5, or All Periods)
  - Filter by position (text search)
- ✅ **Sorting:**
  - Automatically sorts by period first, then alphabetically by name
  - Unknown grade players shown separately when specific grade filter is active
  - Unknown grade players mixed alphabetically when "All Grades" is selected

### Progress Tracking
- ✅ **Visual Progress Indicators:**
  - Progress bar showing completion percentage
  - Displays completed/total items (e.g., "12/14", "11/11" for sophomores)
  - Green checkmark when 100% complete
- ✅ **Grade-Specific Calculations:**
  - Sophomores: Tracks only their 11 required items
  - Other grades: Tracks all 15 required items
  - Custom items added to both completed and total count
- ✅ **Smart Tracking:**
  - Items marked "Never Received" excluded from progress
  - Only counts items relevant to player's grade

### Reports & Export

#### Missing Equipment Report
- ✅ Lists all players with missing equipment
- ✅ Sorted by number of missing items (most missing first)
- ✅ Shows exactly which items are missing for each player
- ✅ Copy-to-clipboard feature for contacting players
- ✅ Pre-formatted message ready to send
- ✅ Excludes items marked "Never Received"
- ✅ Grade-specific: Only shows items required for that player's grade

#### CSV Export
- ✅ Export all player data to CSV file
- ✅ Includes: Name, Student ID, Jersey Number, Grade, Position, Height, Weight, Equipment Status
- ✅ Useful for record-keeping and analysis

### User Interface Features
- ✅ Modern, responsive design (works on mobile, tablet, desktop)
- ✅ Color-coded progress indicators
- ✅ Easy-to-use checkboxes for equipment tracking
- ✅ Collapsible sections for "Never Received" items
- ✅ Real-time updates (changes sync instantly across devices)
- ✅ Loading progress indicator during initial data setup

## Technical Details
- **Framework**: Next.js 16 (React)
- **Database**: Firebase Cloud Firestore
- **Hosting**: Vercel (free tier)
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Analytics**: Vercel Analytics
- **Real-time Sync**: Firebase onSnapshot listeners

## Access & Deployment
- **Web-based**: Works on any device with a browser
- **PWA Support**: Can be installed as Progressive Web App on mobile devices
- **Real-time Sync**: All changes sync instantly across all devices
- **Cloud Storage**: All data stored securely in Firebase Cloud Firestore
- **No Installation Required**: Access via web browser at Vercel URL

## Data Management
- **Initialization**: Automatically adds missing players from roster
- **Updates**: Automatically updates existing players with new fields (e.g., period)
- **Backup**: All data stored in Firebase (automatically backed up)
- **Export**: CSV export available for local backups
