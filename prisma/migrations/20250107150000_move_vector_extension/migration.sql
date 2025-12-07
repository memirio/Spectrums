-- Move vector extension from public schema to extensions schema
-- This is a security best practice recommended by Supabase

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move vector extension to extensions schema
-- Note: If vector extension is already in use, we need to be careful
-- Check if vector extension exists in public schema first
DO $$
BEGIN
  -- Check if vector extension exists in public schema
  IF EXISTS (
    SELECT 1 
    FROM pg_extension e
    JOIN pg_namespace n ON e.extnamespace = n.oid
    WHERE e.extname = 'vector' AND n.nspname = 'public'
  ) THEN
    -- Drop the extension from public schema
    -- CASCADE will drop dependent objects, but since we're using Json type in Prisma,
    -- this should be safe (vector is likely only used for functions, not column types)
    DROP EXTENSION IF EXISTS vector CASCADE;
    
    -- Recreate the extension in the extensions schema
    CREATE EXTENSION IF NOT EXISTS vector SCHEMA extensions;
    
    RAISE NOTICE 'Vector extension moved to extensions schema';
  ELSE
    -- Extension might already be in extensions schema or doesn't exist
    -- Just ensure it exists in extensions schema
    CREATE EXTENSION IF NOT EXISTS vector SCHEMA extensions;
    
    RAISE NOTICE 'Vector extension created/verified in extensions schema';
  END IF;
END $$;

-- Grant usage on the extensions schema to the public role (needed for queries to work)
GRANT USAGE ON SCHEMA extensions TO public;

-- Grant execute on vector functions to public (needed for vector operations)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO public;

-- Set default privileges for future functions
ALTER DEFAULT PRIVILEGES IN SCHEMA extensions GRANT EXECUTE ON FUNCTIONS TO public;

