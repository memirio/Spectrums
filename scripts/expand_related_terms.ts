/**
 * Expand Related Terms Script
 * 
 * Expands the "related" array for all concepts by 100% (doubles the number of related terms).
 * This helps improve search ranking by providing more semantic connections between concepts.
 * 
 * Usage:
 *   npx tsx scripts/expand_related_terms.ts [--dry-run]
 * 
 * Options:
 *   --dry-run: Preview changes without writing to file
 *   --category=<category>: Only expand concepts in a specific category
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Concept {
  id: string;
  label: string;
  synonyms?: string[];
  related?: string[];
  category?: string;
}

function expandRelatedTerms(concepts: Concept[], dryRun: boolean = false): Concept[] {
  const expanded = concepts.map(concept => {
    const currentRelated = concept.related || [];
    const targetCount = currentRelated.length * 2; // Double the related terms
    
    if (currentRelated.length === 0) {
      console.log(`⚠️  ${concept.id}: No related terms to expand`);
      return concept;
    }
    
    // Strategy: Generate related terms by:
    // 1. Adding variations of existing related terms (plural, hyphenated, etc.)
    // 2. Using concept synonyms as related terms (cross-pollination)
    // 3. Using category-based associations
    // 4. Using semantic similarities based on concept relationships
    
    const expandedRelated = new Set<string>([...currentRelated]);
    
    // Add variations of existing related terms
    for (const related of currentRelated) {
      const lower = related.toLowerCase();
      
      // Plural forms
      if (!lower.endsWith('s') && !lower.endsWith('y') && !lower.endsWith('ing')) {
        const plural = related + 's';
        if (expandedRelated.size < targetCount) {
          expandedRelated.add(plural);
        }
      }
      
      // Hyphenated versions
      if (!lower.includes('-')) {
        const hyphenated = lower.replace(/\s+/g, '-');
        if (hyphenated !== lower && expandedRelated.size < targetCount) {
          expandedRelated.add(hyphenated);
        }
      }
      
      // Spaced versions (if hyphenated)
      if (lower.includes('-')) {
        const spaced = lower.replace(/-/g, ' ');
        if (expandedRelated.size < targetCount) {
          expandedRelated.add(spaced);
        }
      }
    }
    
    // Add synonyms as related terms (cross-pollination)
    const synonyms = concept.synonyms || [];
    for (const synonym of synonyms) {
      if (expandedRelated.size < targetCount && !expandedRelated.has(synonym)) {
        expandedRelated.add(synonym);
      }
    }
    
    // Category-based associations
    if (concept.category) {
      const categoryConcepts = concepts.filter(c => 
        c.category === concept.category && 
        c.id !== concept.id
      );
      
      for (const categoryConcept of categoryConcepts) {
        if (expandedRelated.size < targetCount) {
          // Add category concept label as related
          if (categoryConcept.label && !expandedRelated.has(categoryConcept.label.toLowerCase())) {
            expandedRelated.add(categoryConcept.label.toLowerCase());
          }
          
          // Add category concept synonyms
          const catSynonyms = categoryConcept.synonyms || [];
          for (const syn of catSynonyms.slice(0, 2)) {
            if (expandedRelated.size < targetCount && !expandedRelated.has(syn.toLowerCase())) {
              expandedRelated.add(syn.toLowerCase());
            }
          }
        }
      }
    }
    
    // Semantic relationships based on concept ID patterns
    // Example: "colorful" might relate to "vibrant", "bright", etc.
    const semanticMap: Record<string, string[]> = {
      'colorful': ['vibrant', 'bright', 'saturated', 'rainbow', 'multicolor'],
      'minimalistic': ['clean', 'simple', 'sparse', 'bare', 'minimal'],
      'modern': ['contemporary', 'current', 'trendy', 'fresh', 'latest'],
      'retro': ['vintage', 'nostalgic', 'classic', 'old-school'],
      'playful': ['fun', 'whimsical', 'lighthearted', 'cheerful'],
      'strict': ['rigid', 'formal', 'authoritative', 'disciplined'],
      '3d': ['cgi', 'volumetric', 'three-dimensional', 'rendered', '3d-modeling'],
      'animated': ['motion', 'dynamic', 'moving', 'lively'],
      'grid-based': ['grid', 'systematic', 'structured', 'organized'],
      'illustration-led': ['artistic', 'creative', 'hand-drawn', 'visual'],
    };
    
    if (semanticMap[concept.id]) {
      for (const semantic of semanticMap[concept.id]) {
        if (expandedRelated.size < targetCount && !expandedRelated.has(semantic.toLowerCase())) {
          expandedRelated.add(semantic.toLowerCase());
        }
      }
    }
    
    // Generic semantic expansion based on label words
    const labelWords = concept.label.toLowerCase().split(/[-_\s]+/);
    for (const word of labelWords) {
      if (word.length > 3) {
        // Find concepts with similar labels
        const similar = concepts.filter(c => 
          c.id !== concept.id &&
          (c.label.toLowerCase().includes(word) || c.id.includes(word))
        );
        
        for (const sim of similar.slice(0, 2)) {
          if (expandedRelated.size < targetCount) {
            const simLabel = sim.label.toLowerCase();
            if (!expandedRelated.has(simLabel)) {
              expandedRelated.add(simLabel);
            }
          }
        }
      }
    }
    
    const expandedArray = Array.from(expandedRelated);
    const newCount = expandedArray.length;
    const oldCount = currentRelated.length;
    
    if (newCount > oldCount) {
      console.log(`✅ ${concept.id}: ${oldCount} → ${newCount} related terms (+${newCount - oldCount})`);
    } else {
      console.log(`⚠️  ${concept.id}: Could not expand (${oldCount} → ${newCount})`);
    }
    
    return {
      ...concept,
      related: expandedArray,
    };
  });
  
  return expanded;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const categoryArg = args.find(arg => arg.startsWith('--category='));
  const category = categoryArg ? categoryArg.split('=')[1] : null;
  
  const conceptsPath = join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
  
  console.log('🔍 Expanding Related Terms\n');
  console.log('=' .repeat(60));
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be written\n');
  }
  
  if (category) {
    console.log(`📁 Filtering by category: ${category}\n`);
  }
  
  // Read concepts
  const content = readFileSync(conceptsPath, 'utf-8');
  const concepts: Concept[] = JSON.parse(content);
  
  // Filter by category if specified
  const filteredConcepts = category
    ? concepts.filter(c => c.category === category)
    : concepts;
  
  if (filteredConcepts.length === 0) {
    console.log(`❌ No concepts found${category ? ` in category "${category}"` : ''}`);
    process.exit(1);
  }
  
  console.log(`📊 Processing ${filteredConcepts.length} concepts...\n`);
  
  // Calculate stats before expansion
  const avgBefore = filteredConcepts.reduce((sum, c) => sum + (c.related?.length || 0), 0) / filteredConcepts.length;
  
  // Expand related terms
  const expanded = expandRelatedTerms(filteredConcepts, dryRun);
  
  // Calculate stats after expansion
  const avgAfter = expanded.reduce((sum, c) => sum + (c.related?.length || 0), 0) / expanded.length;
  
  // If category filtering, merge back with non-filtered concepts
  const finalConcepts = category
    ? concepts.map(c => {
        const expandedC = expanded.find(e => e.id === c.id);
        return expandedC || c;
      })
    : expanded;
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Summary:');
  console.log(`  Concepts processed: ${filteredConcepts.length}`);
  console.log(`  Average related terms before: ${avgBefore.toFixed(1)}`);
  console.log(`  Average related terms after: ${avgAfter.toFixed(1)}`);
  console.log(`  Increase: ${((avgAfter / avgBefore - 1) * 100).toFixed(1)}%`);
  
  if (!dryRun) {
    // Write back to file
    writeFileSync(conceptsPath, JSON.stringify(finalConcepts, null, 2));
    console.log(`\n✅ Updated ${conceptsPath}`);
    console.log('\n💡 Next step: Re-seed concepts to update embeddings');
    console.log('   npm run seed:concepts');
  } else {
    console.log('\n💡 Run without --dry-run to apply changes');
  }
}

main().catch(console.error);

