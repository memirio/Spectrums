# Embedding Corruption Prevention

## Problem

In November 2025, we discovered that **74.5% of concepts (1095/1469) had corrupted embeddings** due to inconsistent embedding generation methods.

### Root Cause

Two different embedding generation methods were used:

1. **OLD Method** (caused corruption):
   - Format: `"{label}. Synonyms: {synonyms}. Related: {related}."`
   - Single prompt per concept
   - Used in: `scripts/seed_concepts.ts`

2. **NEW Method** (correct):
   - Format: `"website UI with a {term} visual style"`
   - Multiple prompts (one per token: label + synonyms + related), then averaged
   - Used in: `src/concepts/seed.ts`, `src/jobs/tagging.ts`

### Impact

- Concepts generated with OLD method had similarity ~0.5-0.8 with fresh embeddings (expected ~1.0)
- This caused poor tag matching (e.g., "colorful" had 0.01 average score instead of 0.25+)
- 1095 concepts needed regeneration

## Solution

### Centralized Embedding Generation

All concept embeddings are now generated using a **centralized function**:

```typescript
import { generateConceptEmbedding } from '@/lib/concept-embeddings'

const embedding = await generateConceptEmbedding(
  label,
  synonyms,
  related
)
```

This ensures:
- ✅ Consistent method across all code paths
- ✅ Same prompt format: `"website UI with a {term} visual style"`
- ✅ Multiple prompts averaged and normalized
- ✅ Prevents future corruption

### Updated Files

All embedding generation now uses the centralized function:

- ✅ `src/jobs/tagging.ts` - Pipeline for new concepts
- ✅ `src/jobs/tag-new-concepts-on-all.ts` - Batch tagging
- ✅ `src/concepts/seed.ts` - Main seed script
- ⚠️ `scripts/seed_concepts.ts` - **DEPRECATED** (still uses old method, but warns)

### Validation

The `validateConceptEmbedding()` function can check if an embedding is corrupted:

```typescript
import { validateConceptEmbedding } from '@/lib/concept-embeddings'

const similarity = await validateConceptEmbedding(
  label,
  synonyms,
  related,
  storedEmbedding
)

if (similarity < 0.9) {
  // Embedding is corrupted - regenerate it
}
```

## Prevention Checklist

When adding new code that generates concept embeddings:

- [ ] Use `generateConceptEmbedding()` from `@/lib/concept-embeddings`
- [ ] Never use the old single-prompt format
- [ ] Test with `validateConceptEmbedding()` if regenerating existing concepts
- [ ] Document any deviations from the standard method

## Regeneration

To regenerate corrupted concepts:

```bash
# Regenerate all corrupted concepts
npx tsx scripts/regenerate_corrupted_concepts.ts

# Resume if interrupted
npx tsx scripts/regenerate_corrupted_concepts.ts --resume
```

## References

- Analysis: `scripts/analyze_concept_corruption.ts`
- Regeneration: `scripts/regenerate_corrupted_concepts.ts`
- Centralized function: `src/lib/concept-embeddings.ts`

