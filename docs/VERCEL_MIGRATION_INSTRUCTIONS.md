# Running Database Migration on Vercel

## Migration: Add User Authentication

This migration adds the `users` and `saved_images` tables for user authentication and saved images functionality.

## Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI if you haven't:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project (if not already linked):
   ```bash
   vercel link
   ```

4. Run the migration using Vercel's environment:
   ```bash
   vercel env pull .env.vercel
   # Then run the migration with the Vercel environment
   DATABASE_URL=$(grep DATABASE_URL .env.vercel | cut -d '=' -f2-) npm run migrate:apply
   ```

## Option 2: Using Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Ensure `DATABASE_URL` is set
4. Go to the Deployments tab
5. Click on the latest deployment
6. Open the "Functions" tab or use the "Shell" option (if available)
7. Run:
   ```bash
   npm run migrate:apply
   ```

## Option 3: Manual SQL Execution (Supabase Dashboard)

If Vercel CLI doesn't work, you can run the migration manually:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `prisma/migrations/20250107130000_add_user_authentication/migration.sql`
4. Click "Run" to execute the migration

## Option 4: Add to Build Process (Not Recommended for Production)

You could add migration to the build, but this is risky. Instead, run migrations manually before deploying.

## After Migration

1. Ensure `NEXTAUTH_SECRET` is set in Vercel environment variables
2. Generate a secret if needed:
   ```bash
   openssl rand -base64 32
   ```
3. Add it to Vercel: Settings → Environment Variables → Add `NEXTAUTH_SECRET`

## Verify Migration

After running the migration, verify the tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'saved_images');
```

