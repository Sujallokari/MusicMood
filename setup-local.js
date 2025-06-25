#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

console.log('🚀 Setting up VibeStream for local development...\n');

// Generate a secure session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');

// Create .env file with generated session secret
const envContent = `# VibeStream Environment Configuration
# Generated automatically by setup script

# Database Configuration
# Replace this with your actual PostgreSQL connection string
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Session Secret (automatically generated)
SESSION_SECRET=${sessionSecret}

# Instructions:
# 1. Replace DATABASE_URL with your actual database connection string
# 2. Keep SESSION_SECRET as is (randomly generated for security)
# 3. Run 'npm run db:push' after setting up your database
`;

// Write .env file
fs.writeFileSync('.env', envContent);

console.log('✅ Created .env file with secure session secret');
console.log('✅ Generated random SESSION_SECRET automatically');

console.log('\n📋 Next Steps:');
console.log('1. Edit .env file and replace DATABASE_URL with your database connection');
console.log('2. Run: npm run db:push (after setting up database)');
console.log('3. Run: npm run dev');

console.log('\n💾 Database Options:');
console.log('• Free Neon: https://neon.tech (Recommended)');
console.log('• Free Supabase: https://supabase.com');
console.log('• Local PostgreSQL');

console.log('\n📁 Example connection strings:');
console.log('Neon:     postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname');
console.log('Supabase: postgresql://postgres.xxx:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres');
console.log('Local:    postgresql://myuser:mypass@localhost:5432/vibestream');

console.log('\n🎉 Setup complete! Your SESSION_SECRET is ready to use.');