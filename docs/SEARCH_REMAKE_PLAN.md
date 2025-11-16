# Search Remake Plan

## Stage 0: Keep What's Good

### ✅ Keep These Components

1. **CLIP Image Embeddings**
   - Primary search mechanism: Direct cosine similarity between query embedding and image embeddings
   - Stored in: `ImageEmbedding.vector` (768-dim, L2-normalized)
   - Model: `Xenova/clip-vit-large-patch14`

2. **Concept Graph (Synonyms/Related/Opposites)**
   - Used for query expansion and interpretation
   - Stored in: `Concept.synonyms`, `Concept.related`, `Concept.opposites` (JSON arrays)
   - Also in: `src/lib/concept-opposites.ts` (TypeScript mapping)
   - Purpose: Map query terms to concepts, expand synonyms, apply opposite penalties

3. **ImageTag Table (Soft Evidence)**
   - Currently: Hard evidence (required for boosting)
   - New: Soft evidence (optional signal, not required)
   - Stored in: `ImageTag` table (`imageId`, `conceptId`, `score`)
   - Purpose: Provide additional signal when available, but don't penalize images without tags

### 🔧 Simplify: Concept Embedding Generation

**Current Usage:**
- Image tagging: Compare image embeddings to concept embeddings (cosine similarity)
- Search: Not directly used (concepts matched by label/synonyms, then ImageTag scores used)

**New Approach:**
- Concept embeddings only used for:
  1. **Initial concept seeding** (one-time setup)
  2. **New concept validation** (optional quality check)
  3. **Legacy support** (keep for backward compatibility, but don't rely on it)

- **Remove from:**
  - Image tagging pipeline (use alternative method)
  - Search ranking (already not used, but ensure it stays that way)

## Implementation Plan

### Phase 1: Analyze Current Dependencies

**Files that use concept embeddings:**
- `src/jobs/tagging.ts` - Uses concept embeddings for image tagging
- `scripts/process_completed_screenshots.ts` - Uses concept embeddings for tagging
- `scripts/sync_and_retag_all.ts` - Uses concept embeddings for re-tagging
- `src/app/api/sites/route.ts` - Uses concept embeddings for inline tagging
- `src/jobs/tag-new-concepts-on-all.ts` - Uses concept embeddings for new concept tagging

**Files that DON'T use concept embeddings:**
- `src/app/api/search/route.ts` - Already uses CLIP zero-shot + concept graph + ImageTag

### Phase 2: Make ImageTag "Soft Evidence"

**Current behavior:**
- Images without tags get lower scores
- Tag matching is required for boosting

**New behavior:**
- Images without tags: Use pure CLIP zero-shot score
- Images with tags: Add soft boost (small multiplier, not required)
- Don't penalize images without tags

### Phase 3: Alternative Tagging Method

**Current:**
- Compare image embedding to concept embeddings
- Tag if cosine similarity >= threshold

**Options for new approach:**
1. **CLIP zero-shot tagging**: Embed concept labels directly, compare to image
2. **Hybrid approach**: Use concept graph to expand labels, then CLIP zero-shot
3. **Keep concept embeddings but make them optional**: Generate on-demand, cache results

**Recommendation:** Option 2 (Hybrid)
- Use concept graph to expand concept labels with synonyms
- Embed expanded labels: `"website UI with a {label} visual style"` + synonyms
- Compare to image embedding
- More flexible, doesn't require pre-computed concept embeddings

### Phase 4: Update Search to Use Soft Evidence

**Current search logic:**
- Base score: CLIP zero-shot (query embedding vs image embedding)
- Boost: If image has matching tags (hard requirement)
- Penalty: If image has opposite tags

**New search logic:**
- Base score: CLIP zero-shot (primary, always used)
- Soft boost: If image has matching tags (small multiplier, optional)
- Penalty: If image has opposite tags (keep as-is)
- Concept graph: Used for query expansion (keep as-is)

## Implementation Status

1. ✅ Document current state (this file)
2. ✅ Update search to treat ImageTag as soft evidence
3. ✅ Design new tagging method (zero-shot CLIP with concept graph expansion)
4. ✅ Implement new tagging method (`src/lib/tagging-zero-shot.ts`)
5. ✅ Update main tagging pipeline (`src/jobs/tagging.ts`)
6. ✅ Update key scripts (`src/app/api/sites/route.ts`, `scripts/process_completed_screenshots.ts`)
7. ✅ Make concept embeddings optional (keep for validation/legacy)
8. ✅ **CLIP-FIRST RETRIEVAL**: Simplified search to use CLIP as primary semantic signal

## Concept Embeddings Status

**Concept embeddings are now OPTIONAL:**
- ✅ Not required for tagging (uses zero-shot CLIP instead)
- ✅ Not required for search (uses CLIP zero-shot + concept graph)
- ✅ Still stored in database for:
  - Legacy support (backward compatibility)
  - Validation (can check if embeddings are corrupted)
  - Future use cases (if needed)

**New tagging approach:**
- Uses `tagImageWithZeroShot()` from `src/lib/tagging-zero-shot.ts`
- Expands concept labels with synonyms
- Embeds expanded labels directly: `"website UI with a {term} visual style"`
- Compares to image embeddings (no pre-computed concept embeddings needed)

## CLIP-First Retrieval (Latest)

**Search is now CLIP-first:**
- **Primary signal**: CLIP cosine similarity between query embedding and image embeddings
- **Query embedding**: Computed directly from user text (e.g., "love", "3d dashboard", "fun mobile app")
- **Ranking**: Pure cosine similarity - CLIP handles abstract queries surprisingly well
- **No complex logic**: Removed concept matching, ImageTag boosting, etc. - just pure CLIP retrieval

**Benefits:**
- Simpler codebase
- Better handling of abstract queries ("love", "fun", etc.)
- Faster (no concept graph lookups needed)
- CLIP is surprisingly good with abstractions

**Example queries that work well:**
- "love" - finds images with loving/warm/affectionate vibes
- "3d dashboard" - finds 3D dashboard designs
- "fun mobile app" - finds fun, playful mobile app designs
- "minimalist portfolio" - finds minimalist portfolio sites

