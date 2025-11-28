#!/usr/bin/env tsx
/**
 * Setup Supabase Storage Policies
 * 
 * Creates RLS policies to allow public uploads and reads for the Images bucket.
 * Run this once before migrating images.
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupPolicies() {
  console.log('🔐 Setting up Supabase Storage policies...\n')

  const policies = [
    {
      name: 'Allow public uploads',
      sql: `CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'Images')`
    },
    {
      name: 'Allow public reads',
      sql: `CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT TO public USING (bucket_id = 'Images')`
    },
    {
      name: 'Allow public updates',
      sql: `CREATE POLICY "Allow public updates" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'Images')`
    }
  ]

  for (const policy of policies) {
    try {
      console.log(`📝 Creating policy: ${policy.name}...`)
      await prisma.$executeRawUnsafe(policy.sql)
      console.log(`   ✅ Policy created`)
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`   ⏭️  Policy already exists`)
      } else {
        console.error(`   ❌ Error: ${error.message}`)
      }
    }
  }

  console.log('\n✅ Policies setup complete!')
  console.log('   You can now run the image migration script.')
}

setupPolicies()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

