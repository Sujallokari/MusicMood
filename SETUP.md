# Environment Setup for VibeStream

## .env File Location

Create the `.env` file in the **root directory** of your project (same level as package.json).

```
/home/runner/workspace/.env  (or just .env in the root)
```

## Required Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Session Secret
SESSION_SECRET=your_random_secret_key_here
```

## Database Connection Examples

### Neon (Recommended Free Option)
```
DATABASE_URL=postgresql://user:pass@ep-example-123.us-east-1.aws.neon.tech/neondb
```

### Supabase
```
DATABASE_URL=postgresql://postgres.yourproject:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Local PostgreSQL
```
DATABASE_URL=postgresql://myuser:mypass@localhost:5432/vibestream
```

## Setup Steps

1. Create `.env` file in root directory
2. Add your database connection string
3. Generate a random session secret
4. Save the file
5. Application will automatically use these settings

## For Download/Local Development

When you download this project:
1. Run `npm install` to install dependencies
2. Create `.env` file with your database credentials
3. Run `npm run db:push` to create database tables
4. Run `npm run dev` to start the application