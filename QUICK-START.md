# VibeStream - Quick Start Guide

## Super Simple Local Setup (5 minutes)

### Step 1: Download & Setup
```bash
# After downloading the project
npm install && npm run setup
```

### Step 2: Get a Free Database
Choose one:

**Option A: Neon (Recommended)**
1. Go to https://neon.tech
2. Sign up (free)
3. Create new project
4. Copy connection string

**Option B: Supabase**
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Go to Settings → Database
5. Copy connection string

### Step 3: Add Database to .env
Open `.env` file and replace:
```
DATABASE_URL=your_actual_connection_string_here
```

Example:
```
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname
```

### Step 4: Create Tables & Run
```bash
npm run db:push
npm run dev
```

Open http://localhost:5000 - Done! 🎉

## What You Get

- ✅ Complete music playlist app
- ✅ User authentication
- ✅ Dark theme UI
- ✅ Mood-based playlists
- ✅ Database persistence
- ✅ Responsive design

## Need Help?

The `npm run setup` command automatically generates your SESSION_SECRET and creates the .env file. You just need to add your database connection string.

## Database Connection Examples

```bash
# Neon
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname

# Supabase  
DATABASE_URL=postgresql://postgres.xxx:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Local PostgreSQL
DATABASE_URL=postgresql://myuser:mypass@localhost:5432/vibestream
```