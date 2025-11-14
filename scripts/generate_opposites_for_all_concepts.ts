/**
 * One-off script to generate opposites for concepts that are missing them
 * 
 * This script:
 * 1. Loads concepts from the database that don't have opposites
 * 2. For each concept, generates opposites using Gemini with retry logic
 * 3. Updates concept-opposites.ts and the database with the new opposites
 */

import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { generateOppositesForConcept } from '../src/lib/gemini';
import { updateConceptOpposites } from '../src/lib/update-concept-opposites';

async function generateWithRetry(conceptLabel: string, maxRetries: number = 3): Promise<string[]> {
  let delay = 2000; // Start with 2 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateOppositesForConcept(conceptLabel);
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error; // Re-throw on final failure
      }
      
      // Check if it's a retryable error (rate limit, overload, network)
      if (error.message?.includes('503') || 
          error.message?.includes('429') || 
          error.message?.includes('overloaded') ||
          error.message?.includes('quota') ||
          error.message?.includes('fetch failed')) {
        console.log(`    ⏳ Attempt ${attempt}/${maxRetries} failed, waiting ${delay/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Non-retryable error
      }
    }
  }
  
  return []; // Should never reach here
}

async function main() {
  console.log('📚 Loading concepts missing opposites from database...\n');
  
  // Load all concepts first, then filter for those missing opposites
  // (SQLite doesn't support checking for empty JSON arrays easily)
  const allConcepts = await prisma.concept.findMany({
    select: { id: true, label: true, opposites: true },
    orderBy: { label: 'asc' }
  });
  
  // Filter concepts that don't have opposites (null or empty array)
  const concepts = allConcepts.filter(c => {
    const opp = c.opposites as any;
    return opp === null || !Array.isArray(opp) || opp.length === 0;
  }).map(c => ({ id: c.id, label: c.label }));
  
  const totalConcepts = allConcepts.length;
  const withOpposites = allConcepts.filter(c => {
    const opp = c.opposites as any;
    return opp !== null && Array.isArray(opp) && opp.length > 0;
  }).length;
  
  console.log(`📊 Database status:`);
  console.log(`   Total concepts: ${totalConcepts}`);
  console.log(`   With opposites: ${withOpposites} (${((withOpposites/totalConcepts)*100).toFixed(1)}%)`);
  console.log(`   Missing opposites: ${concepts.length} (${((concepts.length/totalConcepts)*100).toFixed(1)}%)\n`);
  
  if (concepts.length === 0) {
    console.log('✅ All concepts already have opposites! Nothing to do.\n');
    await prisma.$disconnect();
    return;
  }
  
  console.log(`🔍 Generating opposites for ${concepts.length} concepts using Gemini...\n`);
  console.log('⚠️  This may take a while and will make many API calls to Gemini.\n');
  
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  
  // Process concepts in batches to avoid overwhelming the API
  const BATCH_SIZE = 5; // Smaller batches to reduce API load
  const DELAY_BETWEEN_BATCHES = 3000; // 3 seconds between batches
  
  for (let i = 0; i < concepts.length; i += BATCH_SIZE) {
    const batch = concepts.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(concepts.length / BATCH_SIZE)} (concepts ${i + 1}-${Math.min(i + BATCH_SIZE, concepts.length)})\n`);
    
    for (const concept of batch) {
      try {
        console.log(`  [${i + batch.indexOf(concept) + 1}/${concepts.length}] Generating opposites for "${concept.label}" (${concept.id})...`);
        
        // Generate opposites using Gemini with retry logic
        const opposites = await generateWithRetry(concept.label);
        
        if (opposites.length === 0) {
          console.log(`    ⚠️  No opposites generated for "${concept.label}" after retries`);
          skippedCount++;
          continue;
        }
        
        console.log(`    ✅ Generated ${opposites.length} opposites: ${opposites.join(', ')}`);
        
        // Update concept-opposites.ts and database
        await updateConceptOpposites(concept.id, opposites);
        
        successCount++;
        
        // Small delay between concepts to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error: any) {
        console.error(`    ❌ Error processing "${concept.label}" after retries: ${error.message}`);
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

