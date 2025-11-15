/**
 * Centralized configuration for auto-tagging and search ranking
 */

// Auto-tagging constants
export const TAG_CONFIG = {
  // Maximum concepts to tag per image (not a target - only tag if truly relevant)
  // Pragmatic approach: take top concepts with significant scores, not just fill to MAX_K
  MAX_K: 700,
  
  // Minimum cosine similarity score to create an ImageTag (absolute floor)
  // Raised to 0.20 to improve tagging accuracy - only tag images that truly contain the concept
  MIN_SCORE: 0.20,
  
  // Relative threshold: minimum percentage drop allowed between consecutive tags
  // Reduced from 0.10 (10%) to 0.30 (30%) to be less aggressive
  // Only stops tagging when score drops by more than 30% (much more lenient)
  // Prevents including weak tags just to fill up to MAX_K
  // Uses percentage instead of absolute gap to account for varying score ranges
  MIN_SCORE_DROP_PCT: 0.30, // 30% drop indicates significantly less relevant (reduced from 10%)
  
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

