# Supabase Quick Start

## Step 0: Backup Your Database ⚠️

**IMPORTANT**: Backup your SQLite database before migrating:

```bash
npx tsx scripts/backup_database.ts
```

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `spectrums`
   - **Database Password**: (save this password!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
4. Click **"Create new project"**
5. Wait ~2 minutes

## Step 2: Get Connection String

1. In Supabase dashboard → **Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Click **"URI"** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password

Example:
```
postgresql://postgres:your-actual-password@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## Step 3: Update .env

Add this to your `.env` file:

```bash
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
```

## Step 4: Run Setup

```bash
npx tsx scripts/setup_supabase.ts
```

This will:
- ✅ Check your connection
- ✅ Update Prisma schema to PostgreSQL
- ✅ Generate Prisma client
- ✅ Create all tables in Supabase

## Step 5: Migrate Data (Optional)

If you have existing SQLite data:

```bash
npx tsx scripts/migrate_to_supabase.ts
```

## Step 6: Seed Concepts

```bash
npx tsx scripts/seed_concepts.ts
```

## Done! 🎉

Your database is now on Supabase. Share the connection string with your team (securely!).

**Note**: Make sure to add `?pgbouncer=true&connection_limit=1` to your connection string for better performance in serverless environments.
