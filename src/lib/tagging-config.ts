/**
 * Centralized configuration for auto-tagging and search ranking
 */

// Auto-tagging constants
export const TAG_CONFIG = {
  // Maximum concepts to tag per image (not a target - only tag if truly relevant)
  // Pragmatic approach: take top concepts with significant scores, not just fill to MAX_K
  MAX_K: 700,
  
  // Minimum cosine similarity score to create an ImageTag (absolute floor)
  // Increased from 0.12 to 0.15 for more selective, pragmatic tagging
  // With 183 concepts above 0.12, we were forcing 20 tags per image
  // With 0.15, we get ~12-15 relevant tags per image (more pragmatic)
  MIN_SCORE: 0.15,
  
  // Relative threshold: minimum percentage drop allowed between consecutive tags
  // Stops tagging when score drops by more than this percentage (e.g., 0.10 = 10%)
  // Prevents including weak tags just to fill up to MAX_K
  // Uses percentage instead of absolute gap to account for varying score ranges
  MIN_SCORE_DROP_PCT: 0.10, // 10% drop indicates significantly less relevant
  
  // Fallback: if no concepts pass MIN_SCORE, keep this many anyway
  FALLBACK_K: 6,
} as const

// Search ranking constants
export const SEARCH_CONFIG = {
  // Multiplier for concept tag boosts in search ranking (subtle - 5% max)
  // Applied when query terms match seeded concepts
  CONCEPT_BOOST_MULTIPLIER: 0.05,
  
  // Maximum boost per concept match (as percentage of base score)
  MAX_BOOST_PERCENT: 0.05,
} as const

// Embedding model
export const EMBEDDING_MODEL = 'clip-ViT-L/14' as const

