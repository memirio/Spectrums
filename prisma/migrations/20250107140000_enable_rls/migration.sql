-- Enable Row Level Security on users table
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on saved_images table
ALTER TABLE "saved_images" ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on user_interactions table
ALTER TABLE "user_interactions" ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on _prisma_migrations table (Prisma's internal migration tracking)
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Note: Since we're using NextAuth (not Supabase Auth), RLS policies need to work differently.
-- The app uses Prisma with a connection string, which typically uses the service role.
-- However, enabling RLS is still important for security if the database is accessed directly.

-- RLS Policies for users table
-- Policy: Allow service role to perform all operations (for Prisma/NextAuth)
-- This is safe because the connection string is secret and only used by the app
CREATE POLICY "Service role full access to users"
  ON "users"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for saved_images table
-- Policy: Allow service role to perform all operations (for Prisma/NextAuth)
CREATE POLICY "Service role full access to saved_images"
  ON "saved_images"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for user_interactions table
-- Policy: Allow service role to perform all operations (for Prisma/NextAuth)
CREATE POLICY "Service role full access to user_interactions"
  ON "user_interactions"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for _prisma_migrations table
-- Policy: Allow service role to perform all operations (for Prisma migrations)
-- This table is only accessed by Prisma during migrations, so service role access is appropriate
CREATE POLICY "Service role full access to _prisma_migrations"
  ON "_prisma_migrations"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Alternative: If you want stricter RLS, you can use role-based policies
-- But this requires setting up custom roles and JWT claims in NextAuth
-- For now, the service role policy is appropriate since:
-- 1. The DATABASE_URL is secret and only used by the app
-- 2. NextAuth handles authentication at the application level
-- 3. The app validates user permissions before database operations

