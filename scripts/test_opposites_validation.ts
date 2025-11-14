#!/usr/bin/env tsx
/**
 * Test script to verify the automatic opposites generation for missing concepts
 */

import 'dotenv/config';
import { generateOppositesForConcept } from '../src/lib/gemini';

async function testOppositesGeneration() {
  const testConcepts = [
    { label: 'Balance', category: 'Aesthetic / Formal' },
    { label: 'Luxury', category: 'Industry' },
    { label: 'Modular', category: 'Form & Structure' },
    { label: 'Horology', category: 'Industry' },
  ];

  console.log('🧪 Testing automatic opposites generation for concepts...\n');

  for (const { label, category } of testConcepts) {
    console.log(`Testing: "${label}" (${category})`);
    try {
      const opposites = await generateOppositesForConcept(label, category);
      if (opposites.length > 0) {
        console.log(`  ✅ Generated ${opposites.length} opposites: [${opposites.join(', ')}]`);
      } else {
        console.log(`  ❌ No opposites generated`);
      }
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('✅ Test complete!');
}

testOppositesGeneration().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});

