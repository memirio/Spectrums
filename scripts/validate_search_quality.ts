/**
 * Search Quality Validator
 * 
 * Tests common search queries and verifies that:
 * 1. Tagged images rank appropriately (direct hits should rank high)
 * 2. Query terms match concepts via synonyms
 * 3. Search results are consistent with expectations
 * 
 * Usage:
 *   npx tsx scripts/validate_search_quality.ts
 */

import { prisma } from '../src/lib/prisma';
import 'dotenv/config';

interface TestCase {
  query: string;
  expectedDirectHits: number; // Minimum number of images that should have direct hits
  expectedTopRanked?: string[]; // Sites that should rank in top 5
  minScore?: number; // Minimum score for top result
}

const testCases: TestCase[] = [
  {
    query: 'illustration',
    expectedDirectHits: 5,
    expectedTopRanked: ['ponpon-mania.com', 'quantamagazine.org'],
    minScore: 1.0,
  },
  {
    query: '3d',
    expectedDirectHits: 3,
    expectedTopRanked: ['techunt.fr', 'toptier.relats.com', 'apple.com/airpods-pro'],
    minScore: 1.0,
  },
  {
    query: 'colorful',
    expectedDirectHits: 10,
    minScore: 0.5,
  },
  {
    query: 'minimalistic',
    expectedDirectHits: 10,
    minScore: 0.5,
  },
  {
    query: 'animated',
    expectedDirectHits: 5,
    minScore: 0.5,
  },
  {
    query: 'ecommerce',
    expectedDirectHits: 5,
    minScore: 0.5,
  },
];

async function validateSearchQuality() {
  console.log('🔍 Search Quality Validation\n');
  console.log('=' .repeat(60));

  const results = [];

  for (const testCase of testCases) {
    console.log(`\n📝 Testing query: "${testCase.query}"`);

    try {
      const response = await fetch(`http://localhost:3002/api/search?q=${encodeURIComponent(testCase.query)}`);
      if (!response.ok) {
        console.log(`  ❌ API request failed: ${response.status}`);
        results.push({ query: testCase.query, passed: false, error: `HTTP ${response.status}` });
        continue;
      }

      const data = await response.json();
      const images = data.images || [];

      // Count direct hits
      const directHits = images.filter((img: any) => img.directHitsCount > 0);
      const directHitsCount = directHits.length;

      // Check if expected sites are in top results
      const topSites = images.slice(0, 5).map((img: any) => img.siteUrl || '');
      const expectedInTop = testCase.expectedTopRanked?.every(expected => 
        topSites.some(url => url.includes(expected))
      );

      // Check minimum score
      const topScore = images[0]?.score || 0;
      const minScoreMet = !testCase.minScore || topScore >= testCase.minScore;

      // Overall pass/fail
      const passed = 
        directHitsCount >= testCase.expectedDirectHits &&
        (!testCase.expectedTopRanked || expectedInTop) &&
        minScoreMet;

      console.log(`  Direct hits: ${directHitsCount}/${testCase.expectedDirectHits} ✅`);
      if (testCase.expectedTopRanked) {
        console.log(`  Expected sites in top 5: ${expectedInTop ? '✅' : '❌'}`);
        if (!expectedInTop) {
          console.log(`    Expected: ${testCase.expectedTopRanked.join(', ')}`);
          console.log(`    Got: ${topSites.join(', ')}`);
        }
      }
      console.log(`  Top score: ${topScore.toFixed(4)} ${minScoreMet ? '✅' : '❌'}`);
      console.log(`  Overall: ${passed ? '✅ PASS' : '❌ FAIL'}`);

      if (!passed) {
        console.log(`\n  Top 5 results:`);
        images.slice(0, 5).forEach((img: any, idx: number) => {
          console.log(`    ${idx + 1}. ${img.siteUrl} (score: ${img.score?.toFixed(4)}, hits: ${img.directHitsCount})`);
        });
      }

      results.push({
        query: testCase.query,
        passed,
        directHitsCount,
        expectedDirectHits: testCase.expectedDirectHits,
        expectedInTop,
        minScoreMet,
        topScore,
      });
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({ query: testCase.query, passed: false, error: error.message });
    }
  }

  // Summary
  console.log(`\n\n📊 Summary`);
  console.log('=' .repeat(60));
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  console.log(`  Tests passed: ${passed}/${total} (${((passed / total) * 100).toFixed(1)}%)`);

  if (passed < total) {
    console.log(`\n  ❌ Failed tests:`);
    results.filter(r => !r.passed).forEach(r => {
      console.log(`    - "${r.query}": ${r.error || 'Failed validation criteria'}`);
    });
  } else {
    console.log(`\n  ✅ All tests passed!`);
  }

  await prisma.$disconnect();
}

validateSearchQuality().catch(console.error);

