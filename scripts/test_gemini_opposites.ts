#!/usr/bin/env tsx
/**
 * Test script to verify Gemini generates opposites in the initial call
 */

import 'dotenv/config';
import { generateAbstractConceptsFromImage } from '../src/lib/gemini';
import { prisma } from '../src/lib/prisma';

async function test() {
  // Get a random image
  const image = await prisma.image.findFirst({
    orderBy: { id: 'desc' },
    include: { site: true }
  });

  if (!image) {
    console.error('No images found');
    process.exit(1);
  }

  console.log('🧪 Testing Gemini with opposites in initial call...\n');
  console.log('📸 Image:', image.id);
  console.log('🌐 Site:', image.site?.title);
  console.log('🔗 URL:', image.url);
  console.log('');

  // Fetch image
  const response = await fetch(image.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const imageBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(imageBuffer);

  console.log('📥 Image size:', buffer.length, 'bytes');
  console.log('');

  // Retry logic with exponential backoff
  let retries = 3;
  let delay = 2000; // Start with 2 seconds
  let concepts;
  
  while (retries > 0) {
    try {
      console.log(`🤖 Calling Gemini API... (${4 - retries}/4 attempts)\n`);
      concepts = await generateAbstractConceptsFromImage(buffer);
      break; // Success!
    } catch (error: any) {
      retries--;
      if (retries === 0) {
        throw error; // Re-throw on final failure
      }
      if (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('429')) {
        console.log(`⏳ API overloaded, waiting ${delay/1000}s before retry...\n`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Non-retryable error
      }
    }
  }
  
  try {

    console.log('✅ Success! Received concepts with opposites:\n');
    
    let totalConcepts = 0;
    let totalOpposites = 0;
    let conceptsWithOpposites = 0;

    for (const [category, conceptList] of Object.entries(concepts!)) {
      console.log(`📁 ${category}:`);
      for (const { concept, opposites } of conceptList) {
        totalConcepts++;
        if (opposites.length > 0) {
          conceptsWithOpposites++;
          totalOpposites += opposites.length;
          console.log(`  ✅ "${concept}" → opposites: [${opposites.join(', ')}]`);
        } else {
          console.log(`  ⚠️  "${concept}" → no opposites`);
        }
      }
      console.log('');
    }

    console.log('📊 Summary:');
    console.log(`  Total concepts: ${totalConcepts}`);
    console.log(`  Concepts with opposites: ${conceptsWithOpposites} (${((conceptsWithOpposites / totalConcepts) * 100).toFixed(1)}%)`);
    console.log(`  Total opposites: ${totalOpposites}`);
    console.log(`  Average opposites per concept: ${(totalOpposites / totalConcepts).toFixed(2)}`);
    console.log('');

    if (conceptsWithOpposites === totalConcepts) {
      console.log('✅ Perfect! All concepts have opposites in the initial call!');
    } else if (conceptsWithOpposites > 0) {
      console.log('⚠️  Some concepts are missing opposites. This might be expected for some edge cases.');
    } else {
      console.log('❌ No opposites were generated. Check the prompt format.');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('503') || error.message.includes('overloaded')) {
      console.log('\n💡 The API is overloaded. Please try again in a few seconds.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();

