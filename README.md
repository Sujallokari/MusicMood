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

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file with:
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
REPL_ID=your_repl_id
```

### 3. Database Setup
```bash
# Push schema to database
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```

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