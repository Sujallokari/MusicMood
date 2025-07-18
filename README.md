# VibeStream - Music Playlist Application

A full-stack music playlist application that generates personalized playlists based on user moods.

## Features

- **User Authentication** - Secure login with Replit OAuth
- **Mood-Based Playlists** - Generate playlists based on your current mood
- **Dark Theme UI** - Modern Spotify-inspired design
- **Database Integration** - PostgreSQL with Drizzle ORM
- **Responsive Design** - Works on desktop and mobile
- **Music Player Interface** - Full playback controls
- **User Preferences** - Personalized recommendations

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS
- **Authentication**: Replit OAuth

## Quick Local Setup

### 1. One-Command Setup
```bash
npm install && npm run setup
```
This will:
- Install all dependencies
- Create `.env` file with secure SESSION_SECRET
- Show you exactly what to do next

### 2. Add Your Database
Edit `.env` file and replace `DATABASE_URL` with your database connection string.

**Free Database Options:**
- **Neon** (Recommended): https://neon.tech
- **Supabase**: https://supabase.com

### 3. Create Database Tables
```bash
npm run db:push
```

### 4. Start Application
```bash
npm run dev
```

That's it! Your app will be running at http://localhost:5000

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/          # Express backend
│   ├── db.ts           # Database connection
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data layer
│   └── replitAuth.ts   # Authentication
├── shared/          # Shared types and schema
└── README.md
```

## API Routes

- `GET /api/auth/user` - Get current user
- `GET /api/playlists` - Get user playlists
- `POST /api/playlists/generate` - Generate mood-based playlist
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/preferences` - Get user preferences

## Database Schema

- **users** - User profiles and authentication
- **playlists** - Music playlists with mood metadata
- **tracks** - Individual songs with metadata
- **playlist_tracks** - Many-to-many relationship
- **user_preferences** - User settings and preferences
- **sessions** - Authentication sessions

## Deployment

The app is configured for Replit deployment but can be deployed to any Node.js hosting platform.

## License

MIT License