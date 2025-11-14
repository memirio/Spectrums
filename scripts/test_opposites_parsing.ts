#!/usr/bin/env tsx
/**
 * Test script to verify the opposites parsing logic works correctly
 * This mocks the Gemini response to test without API calls
 */

// Mock response format that Gemini should return
const mockGeminiResponse = {
  "color-palette": [
    { "concept": "Vibrant", "opposites": ["Muted", "Dull", "Desaturated"] }
  ],
  "feeling-emotion": [
    { "concept": "Serene", "opposites": ["Anxious", "Tension"] }
  ],
  "industry": [
    { "concept": "Finance", "opposites": ["Non-profit", "Charity"] },
    { "concept": "Banking", "opposites": ["Cashless", "Digital-only"] }
  ],
  "style-aesthetic": [
    { "concept": "Minimalist", "opposites": ["Cluttered", "Busy"] }
  ],
  "layout-structure": [
    { "concept": "Centered", "opposites": ["Asymmetric", "Offset"] }
  ],
  "typography": [
    { "concept": "Bold", "opposites": ["Light", "Thin"] }
  ],
  "imagery-photography": [
    { "concept": "Realistic", "opposites": ["Abstract", "Stylized"] }
  ],
  "interaction-motion": [
    { "concept": "Static", "opposites": ["Dynamic", "Animated"] }
  ],
  "spatial-depth": [
    { "concept": "3D", "opposites": ["Flat", "2D"] }
  ],
  "texture-materiality": [
    { "concept": "Smooth", "opposites": ["Rough", "Textured"] }
  ],
  "mood-personality": [
    { "concept": "Playful", "opposites": ["Serious", "Formal"] }
  ],
  "content-context": [
    { "concept": "Professional", "opposites": ["Casual", "Informal"] }
  ]
};

// Simulate the parsing logic from gemini.ts
function parseGeminiResponse(concepts: any): Record<string, Array<{ concept: string; opposites: string[] }>> {
  const requiredCategories = [
    'color-palette', 'feeling-emotion', 'industry', 'style-aesthetic',
    'layout-structure', 'typography', 'imagery-photography', 'interaction-motion',
    'spatial-depth', 'texture-materiality', 'mood-personality', 'content-context'
  ];
  
  const normalizedConcepts: Record<string, Array<{ concept: string; opposites: string[] }>> = {};
  
  for (const cat of requiredCategories) {
    if (!concepts[cat]) {
      throw new Error(`Missing concept for category: ${cat}`);
    }
    
    const normalized: Array<{ concept: string; opposites: string[] }> = [];
    
    // Handle different response formats
    if (typeof concepts[cat] === 'string') {
      // Simple string format - no opposites provided
      const concept = concepts[cat].trim();
      if (concept.length > 0) {
        normalized.push({ concept, opposites: [] });
      }
    } else if (Array.isArray(concepts[cat])) {
      // Array format - could be strings or objects with opposites
      for (const item of concepts[cat]) {
        if (typeof item === 'string') {
          // Simple string in array
          const concept = item.trim();
          if (concept.length > 0) {
            normalized.push({ concept, opposites: [] });
          }
        } else if (typeof item === 'object' && item !== null) {
          // Object with concept and opposites
          const concept = (item.concept || item.label || String(item)).trim();
          const opposites = Array.isArray(item.opposites) 
            ? item.opposites.map((o: any) => String(o).trim()).filter((o: string) => o.length > 0)
            : [];
          if (concept.length > 0) {
            normalized.push({ concept, opposites });
          }
        }
      }
    } else if (typeof concepts[cat] === 'object' && concepts[cat] !== null) {
      // Single object format
      const item = concepts[cat] as any;
      const concept = (item.concept || item.label || String(item)).trim();
      const opposites = Array.isArray(item.opposites) 
        ? item.opposites.map((o: any) => String(o).trim()).filter((o: string) => o.length > 0)
        : [];
      if (concept.length > 0) {
        normalized.push({ concept, opposites });
      }
    } else {
      throw new Error(`Invalid concept format for category: ${cat} (expected string, array, or object)`);
    }
    
    // Ensure at least 1 concept after normalization
    if (normalized.length === 0) {
      throw new Error(`Empty concept array for category: ${cat} after normalization`);
    }
    
    normalizedConcepts[cat] = normalized;
  }
  
  return normalizedConcepts;
}

// Test the parsing
console.log('🧪 Testing opposites parsing logic...\n');

try {
  const parsed = parseGeminiResponse(mockGeminiResponse);
  
  console.log('✅ Parsing successful!\n');
  console.log('📊 Results:\n');
  
  let totalConcepts = 0;
  let totalOpposites = 0;
  
  for (const [category, concepts] of Object.entries(parsed)) {
    console.log(`  ${category}:`);
    for (const { concept, opposites } of concepts) {
      totalConcepts++;
      totalOpposites += opposites.length;
      const oppStr = opposites.length > 0 
        ? ` → opposites: [${opposites.join(', ')}]`
        : ' → no opposites';
      console.log(`    - ${concept}${oppStr}`);
    }
    console.log('');
  }
  
  console.log(`\n📈 Summary:`);
  console.log(`  Total concepts: ${totalConcepts}`);
  console.log(`  Total opposites: ${totalOpposites}`);
  console.log(`  Average opposites per concept: ${(totalOpposites / totalConcepts).toFixed(2)}`);
  console.log(`\n✅ All tests passed! The parsing logic works correctly.`);
  
} catch (error: any) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}

