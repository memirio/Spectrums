# Setting Up Supabase (PostgreSQL)

This guide will help you migrate from SQLite to Supabase PostgreSQL for a shared database across all developers.

## Step 0: Backup Your Database ⚠️

**IMPORTANT**: Before migrating, create a backup of your SQLite database:

```bash
# Create a timestamped backup
npx tsx scripts/backup_database.ts

# Or manually copy the database
cp prisma/dev-new.db prisma/dev-new.db.backup-$(date +%Y%m%d-%H%M%S)
```

This ensures you can restore your data if anything goes wrong during migration.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `looma` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to you/your team
   - **Pricing Plan**: Free tier is fine for development
4. Click "Create new project"
5. Wait ~2 minutes for the project to be provisioned

## Step 2: Get Your Connection String

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you set when creating the project
6. The final connection string should look like:
   ```
   postgresql://postgres:your-actual-password@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```

## Step 3: Update Prisma Schema

The schema has been updated to use PostgreSQL. Make sure `prisma/schema.prisma` has:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 4: Update Environment Variables

Add/update your `.env` file:

```bash
# Supabase PostgreSQL connection string
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# ... rest of your env vars
```

**Note**: The `?pgbouncer=true&connection_limit=1` parameters help with connection pooling in serverless environments.

## Step 5: Run Migrations

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to Supabase (creates all tables)
npx prisma db push

# Or use migrations (recommended for production):
# npx prisma migrate dev --name init
```

## Step 6: Migrate Existing Data (Optional)

If you have existing SQLite data you want to migrate:

```bash
# Export from SQLite
npx tsx scripts/export_sqlite_data.ts

# Import to Supabase
npx tsx scripts/import_to_supabase.ts
```

Or use the migration script:

```bash
npx tsx scripts/migrate_to_supabase.ts
```

## Step 7: Verify Setup

```bash
# Open Prisma Studio (should connect to Supabase)
npx prisma studio

# Or check via script
npx tsx scripts/check_supabase_connection.ts
```

## Troubleshooting

### Connection Issues

- **"Connection refused"**: Check your Supabase project is active and the connection string is correct
- **"Password authentication failed"**: Verify the password in your connection string matches your Supabase project password
- **"Too many connections"**: Add `?pgbouncer=true&connection_limit=1` to your connection string

### Migration Issues

- **"Table already exists"**: Run `npx prisma db push --force-reset` (⚠️ **WARNING**: This deletes all data!)
- **"Column does not exist"**: Make sure you ran `npx prisma generate` after updating the schema

### Performance

- Supabase free tier has connection limits. Use connection pooling (`pgbouncer=true`) for better performance
- Consider upgrading to Pro tier for production workloads

## Switching Back to SQLite

If you need to switch back to SQLite temporarily:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```bash
   DATABASE_URL="file:./prisma/dev-new.db"
   ```

3. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```

## Next Steps

- Share the Supabase connection string with your team (securely!)
- Consider using Supabase's built-in authentication if you need user accounts
- Use Supabase's real-time features for live updates
- Set up database backups in Supabase dashboard

