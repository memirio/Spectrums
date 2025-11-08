/**
 * Synonym Coverage Checker
 * 
 * Identifies common query terms that should match concepts but don't.
 * This helps prevent ranking issues where users search for terms that
 * should match concepts but aren't in the synonyms list.
 * 
 * Usage:
 *   npx tsx scripts/check_synonym_coverage.ts [query-term]
 * 
 * Examples:
 *   npx tsx scripts/check_synonym_coverage.ts illustration
 *   npx tsx scripts/check_synonym_coverage.ts 3d
 */

import { prisma } from '../src/lib/prisma';
import 'dotenv/config';

interface ConceptMatch {
  conceptId: string;
  conceptLabel: string;
  matches: boolean;
  matchedBy: 'id' | 'label' | 'synonym' | null;
  synonyms: string[];
}

async function checkSynonymCoverage(queryTerm: string | null) {
  const concepts = await prisma.concept.findMany();
  const term = queryTerm?.toLowerCase().trim() || '';

  console.log('🔍 Synonym Coverage Check\n');
  console.log('=' .repeat(60));

  if (!term) {
    // Check common query terms
    const commonTerms = [
      'illustration', 'illustrations',
      '3d', '3-d', 'three dimensional', 'three-dimensional',
      'color', 'colorful', 'colour', 'colourful',
      'minimal', 'minimalistic', 'minimalist',
      'modern', 'contemporary',
      'retro', 'vintage',
      'bold', 'striking',
      'calm', 'peaceful',
      'ecommerce', 'e-commerce', 'online store',
      'portfolio', 'showcase',
      'animation', 'animated',
      'interactive',
      'grid', 'gridded',
    ];

    console.log('Checking common query terms against concept synonyms...\n');

    const missingMatches: Array<{ term: string; shouldMatch: string[] }> = [];

    for (const checkTerm of commonTerms) {
      const matches = findMatchingConcepts(concepts, checkTerm);
      const shouldMatch = getShouldMatchConcepts(concepts, checkTerm);

      if (matches.length === 0 && shouldMatch.length > 0) {
        missingMatches.push({
          term: checkTerm,
          shouldMatch: shouldMatch.map(c => c.id),
        });
      }
    }

    if (missingMatches.length > 0) {
      console.log('❌ Missing Synonym Matches:\n');
      for (const { term, shouldMatch } of missingMatches) {
        console.log(`  "${term}" should match:`);
        for (const conceptId of shouldMatch) {
          const concept = concepts.find(c => c.id === conceptId);
          if (concept) {
            console.log(`    - ${concept.id} (${concept.label})`);
            console.log(`      Current synonyms: ${(concept.synonyms as any)?.slice(0, 5).join(', ') || 'none'}...`);
          }
        }
        console.log('');
      }
    } else {
      console.log('✅ All common terms have synonym coverage!\n');
    }
  } else {
    // Check specific term
    console.log(`Checking term: "${term}"\n`);

    const matches = findMatchingConcepts(concepts, term);
    const shouldMatch = getShouldMatchConcepts(concepts, term);

    console.log('Matching Concepts:');
    if (matches.length === 0) {
      console.log('  ❌ No matches found\n');
    } else {
      for (const match of matches) {
        console.log(`  ✅ ${match.conceptId} (${match.conceptLabel})`);
        console.log(`     Matched by: ${match.matchedBy}`);
        console.log(`     Synonyms: ${match.synonyms.slice(0, 5).join(', ')}...`);
        console.log('');
      }
    }

    if (shouldMatch.length > 0 && matches.length === 0) {
      console.log('\n⚠️  This term SHOULD match these concepts:');
      for (const conceptId of shouldMatch) {
        const concept = concepts.find(c => c.id === conceptId);
        if (concept) {
          console.log(`  - ${concept.id} (${concept.label})`);
          console.log(`    Current synonyms: ${(concept.synonyms as any)?.slice(0, 10).join(', ') || 'none'}`);
          console.log(`    Action: Add "${term}" to synonyms\n`);
        }
      }
    }
  }

  await prisma.$disconnect();
}

function findMatchingConcepts(concepts: any[], term: string): ConceptMatch[] {
  const matches: ConceptMatch[] = [];

  for (const c of concepts) {
    const conceptId = c.id.toLowerCase();
    const label = c.label.toLowerCase();
    const synonyms = (c.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase());

    let matchedBy: 'id' | 'label' | 'synonym' | null = null;

    if (conceptId === term) {
      matchedBy = 'id';
    } else if (label === term) {
      matchedBy = 'label';
    } else if (synonyms.includes(term)) {
      matchedBy = 'synonym';
    }

    if (matchedBy) {
      matches.push({
        conceptId: c.id,
        conceptLabel: c.label,
        matches: true,
        matchedBy,
        synonyms: (c.synonyms as any) || [],
      });
    }
  }

  return matches;
}

function getShouldMatchConcepts(concepts: any[], term: string): any[] {
  // Heuristics for what concepts SHOULD match a term
  const shouldMatch: any[] = [];

  for (const c of concepts) {
    const conceptId = c.id.toLowerCase();
    const label = c.label.toLowerCase();

    // Check if concept ID or label is semantically similar to the term
    if (
      conceptId.includes(term) ||
      term.includes(conceptId) ||
      label.includes(term) ||
      term.includes(label.toLowerCase())
    ) {
      shouldMatch.push(c);
    }
  }

  return shouldMatch;
}

const queryTerm = process.argv[2] || null;
checkSynonymCoverage(queryTerm).catch(console.error);

