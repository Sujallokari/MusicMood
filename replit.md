# VibeStream - Music Playlist Application

## Overview

VibeStream is a full-stack music playlist application that generates personalized playlists based on user moods. The application features a React frontend with a modern dark theme, Express.js backend with PostgreSQL database, and Replit authentication integration.

## System Architecture

### Full-Stack Monorepo Structure
- **Frontend**: React with TypeScript, Vite build system
- **Backend**: Express.js with TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OAuth integration
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state

### Directory Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared types and database schema
├── components.json  # shadcn/ui configuration
├── drizzle.config.ts # Database configuration
└── vite.config.ts   # Frontend build configuration
```

## Key Components

### Frontend Architecture
- **React Router**: Using Wouter for client-side routing
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme variables
- **Data Fetching**: TanStack Query with custom query client
- **State Management**: React hooks and context for local state

### Backend Architecture
- **API Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Authentication**: Passport.js with OpenID Connect for Replit Auth
- **Session Management**: Express sessions with PostgreSQL store
- **Storage Interface**: Abstract storage layer with in-memory fallback

### Database Schema
- **Users**: Authentication and profile data
- **Playlists**: User-created playlists with mood and genre metadata
- **Tracks**: Music track information with Spotify integration
- **Sessions**: Authentication session storage
- **User Preferences**: Personalization settings

## Data Flow

1. **Authentication Flow**: 
   - Users authenticate via Replit OAuth
   - Sessions stored in PostgreSQL with express-session
   - User data synchronized on login

2. **Playlist Generation**:
   - User selects mood via mood selector component
   - Backend generates playlist based on mood and preferences
   - Tracks fetched and stored in database
   - Frontend updates via TanStack Query

3. **Music Playback**:
   - Mock music player interface implemented
   - Designed for future Spotify Web API integration
   - Track metadata displayed with playback controls

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OAuth provider
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS for responsive design
- **Build Tools**: Vite for fast development and optimized builds

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast backend compilation
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Database**: Connects to Neon PostgreSQL instance
- **Port Configuration**: Frontend proxies to backend on port 5000

### Production Build
- **Frontend**: Static build output served by Express
- **Backend**: Compiled to single JavaScript bundle
- **Database**: PostgreSQL connection with SSL in production
- **Deployment**: Configured for Replit autoscale deployment

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OAuth provider endpoint

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 25, 2025. Initial setup