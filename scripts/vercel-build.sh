#!/bin/bash
# Vercel build script that conditionally runs migrations

set -e

echo "🔨 Running Prisma generate..."
npx prisma generate

# Check if DATABASE_URL is set and not the dummy value
if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "postgresql://dummy:dummy@dummy:5432/dummy" ]; then
  echo "🔄 Applying database migrations..."
  npx prisma migrate deploy
else
  echo "⏭️  Skipping migrations: DATABASE_URL not set or is dummy value"
fi

echo "🏗️  Building Next.js application..."
next build

