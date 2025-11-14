/**
 * One-off script to generate opposites for all existing concepts using Gemini
 * 
 * This script:
 * 1. Loads all concepts from the database
 * 2. For each concept, generates opposites using Gemini
 * 3. Updates concept-opposites.ts with the new opposites
 */

import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { generateOppositesForConcept } from '../src/lib/gemini';
import { updateConceptOpposites } from '../src/lib/update-concept-opposites';

async function main() {
  console.log('📚 Loading all concepts from database...\n');
  
  const concepts = await prisma.concept.findMany({
    select: { id: true, label: true },
    orderBy: { label: 'asc' }
  });
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`);
  console.log('🔍 Generating opposites for each concept using Gemini...\n');
  console.log('⚠️  This may take a while and will make many API calls to Gemini.\n');
  
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  
  // Process concepts in batches to avoid overwhelming the API
  const BATCH_SIZE = 10;
  const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds
  
  for (let i = 0; i < concepts.length; i += BATCH_SIZE) {
    const batch = concepts.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(concepts.length / BATCH_SIZE)} (concepts ${i + 1}-${Math.min(i + BATCH_SIZE, concepts.length)})\n`);
    
    for (const concept of batch) {
      try {
        console.log(`  Generating opposites for "${concept.label}" (${concept.id})...`);
        
        // Generate opposites using Gemini (category is optional)
        const opposites = await generateOppositesForConcept(concept.label);
        
        if (opposites.length === 0) {
          console.log(`    ⚠️  No opposites generated for "${concept.label}"`);
          skippedCount++;
          continue;
        }
        
        console.log(`    ✅ Generated ${opposites.length} opposites: ${opposites.join(', ')}`);
        
        // Update concept-opposites.ts and database
        await updateConceptOpposites(concept.id, opposites);
        
        successCount++;
        
        // Small delay between concepts to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error: any) {
        console.error(`    ❌ Error processing "${concept.label}": ${error.message}`);
        errorCount++;
        // Continue with next concept
      }
    }
    
    // Delay between batches
    if (i + BATCH_SIZE < concepts.length) {
      console.log(`\n  ⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...\n`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  console.log('\n✅ Completed processing all concepts!\n');
  console.log(`📊 Summary:`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Skipped (no opposites): ${skippedCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${concepts.length}\n`);
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Script failed:', e);
  process.exit(1);
});

