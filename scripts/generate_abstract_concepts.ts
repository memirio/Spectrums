#!/usr/bin/env tsx
// scripts/generate_abstract_concepts.ts
import { generateAbstractConceptsFromImages } from '../src/jobs/generate_abstract_concepts'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await generateAbstractConceptsFromImages()
    console.log('\n✅ Abstract concept generation completed!')
    console.log('📝 Next step: Run `npx tsx src/concepts/seed.ts` to embed the new concepts')
  } catch (error) {
    console.error('❌ Error generating abstract concepts:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

