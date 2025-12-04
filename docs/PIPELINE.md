# Looma Image Processing Pipeline

## Overview

The **Unified Asset Ingestion Pipeline** is a single, category-agnostic pipeline that processes all asset types (websites, packaging, apps, fonts, etc.) through the same workflow. The pipeline handles image ingestion, embedding generation, concept creation, tagging, and hub detection.

## Pipeline Versions

### Pipeline 1.0 (Default)
- **Generates new concepts** from images using Gemini Vision API
- Tags images with **all concepts** (existing + newly created)
- Applies new concepts to **all existing images** (if similarity >= threshold)
- **Use case:** Expanding concept vocabulary, discovering new design patterns

### Pipeline 2.0 (`skipConceptGeneration: true`)
- **Does NOT generate new concepts** - only uses existing concepts
- Tags images with **existing concepts only**
- **Faster** - no Gemini/OpenAI API calls required
- **Use case:** Bulk ingestion, when concept vocabulary is stable, faster processing

## Pipeline Flow

### Entry Point: `POST /api/sites`

**Input:**
- `title`, `description`, `url`, `imageUrl` (optional), `author`, `tags` (legacy), `category` (defaults to 'website')
- `skipConceptGeneration` (optional, boolean): Set to `true` to use Pipeline 2.0

**Output:**
- Site record with associated image and tags

**Example (Pipeline 1.0 - default):**
```json
{
  "title": "Example Site",
  "url": "https://example.com",
  "category": "website"
}
```

**Example (Pipeline 2.0):**
```json
{
  "title": "Example Site",
  "url": "https://example.com",
  "category": "website",
  "skipConceptGeneration": true
}
```

---

## Step-by-Step Pipeline

### 1. **Screenshot Generation** (if no `imageUrl` provided)
- **Service:** Screenshot Service API (`SCREENSHOT_API_URL`)
- **Process:**
  - Generates idempotency key from URL
  - Requests screenshot with viewport (1200x900)
  - Polls status endpoint (up to 60s timeout)
  - Waits for full page load (~35-45 seconds):
    - Page load event
    - Network idle wait (up to 15s)
    - Page stabilization (10s)
    - Image loading (up to 10s per image)
    - Lazy-loaded content wait (3s)
    - Final 8-second wait before capture
- **Result:** Screenshot URL or continues without image (non-fatal)

### 2. **Site Deduplication Check**
- Normalizes URL (removes trailing slash)
- Checks for existing site with same URL
- **If exists:** Returns existing site (prevents duplicates)
- **If new:** Proceeds to creation

### 3. **Site Creation**
- Creates `Site` record in database
- Associates legacy tags (if provided)
- Sets `imageUrl` field (legacy, prefer `Image.url`)

### 4. **Image Processing** (if `imageUrl` exists)

#### 4a. **Image Fetch & Metadata**
- Fetches image from URL
- Extracts metadata: `width`, `height`, `bytes`
- Creates/updates `Image` record with:
  - `siteId`, `url`, `width`, `height`, `bytes`, `category`

#### 4b. **Image Canonicalization**
- **Function:** `canonicalizeImage()` from `@/lib/embeddings`
- **Process:**
  - Decodes image to sRGB color space
  - Removes alpha channel
  - Encodes as PNG
  - Computes SHA-256 `contentHash` for deduplication
- **Purpose:** Ensures identical images get same hash (reuse embeddings)

#### 4c. **CLIP Embedding Generation**
- **Model:** CLIP ViT-L/14 (768-dimensional vectors)
- **Check:** If embedding exists by `contentHash` → reuse
- **If new:**
  - Generates CLIP image embedding via `embedImageFromBuffer()`
  - Unit-normalizes vector (L2 norm = 1.0)
  - Stores in `ImageEmbedding` table with `contentHash`
- **Optimization:** Reuses embeddings for duplicate images (same `contentHash`)

### 5. **Concept Generation & Tagging** (if embedding exists)

**Pipeline Selection:**
- **Pipeline 1.0** (default): Generates new concepts + tags with all concepts
- **Pipeline 2.0** (`skipConceptGeneration: true`): Tags with existing concepts only (skips concept generation)

#### 5a. **Generate New Concepts** (`tagImage()`) - **Pipeline 1.0 Only**
- **Function:** `createNewConceptsFromImage()` in `tagging.ts`
- **Model:** Google Gemini 2.5 Flash (vision model)
- **Fallback:** OpenAI GPT-4o (if Gemini fails with 503/429)
- **Process:**
  - Analyzes image using vision model
  - Generates **at least 1 concept per category** from 12 categories:
    1. **Feeling / Emotion** (emotional + physical feelings)
    2. **Vibe / Mood** (atmospheric tone)
    3. **Philosophical / Existential** (abstract ideas)
    4. **Aesthetic / Formal** (compositional qualities)
    5. **Natural / Metaphysical** (natural/cosmic concepts)
    6. **Social / Cultural** (societal concepts)
    7. **Design Style** (aesthetic movements)
    8. **Color & Tone** (chromatic qualities)
    9. **Texture & Materiality** (tactile qualities)
    10. **Form & Structure** (structural principles)
    11. **Design Technique** (methods/mediums)
    12. **Industry** (business sectors - at least 2: overall + specific)
  - **For each concept:**
    - Generates **2-5 opposites** (90% binary rule: if A lists B, B must list A)
    - Generates synonyms and related terms (via AI or basic rules)
    - Checks for duplicates (exact match → skip, fuzzy match → merge)
    - Creates concept ID from normalized label
- **Storage:**
  - Saves to `seed_concepts.json` (source of truth)
  - Creates/updates `Concept` record in database
  - Generates concept embedding (768-dim vector)
  - Updates `concept-opposites.ts` TypeScript file

#### 5b. **Tag Image with All Concepts** (`tagImage()` or `tagImageWithoutNewConcepts()`)
- **Pipeline 1.0:** Uses `tagImage()` - tags with all concepts (existing + newly created)
- **Pipeline 2.0:** Uses `tagImageWithoutNewConcepts()` - tags with existing concepts only
- **Optimization:** Only fetches concept `id` and `embedding` (not labels/synonyms/related)
- **Process:**
  1. Computes cosine similarity between image embedding and **all concept embeddings**
  2. Sorts by similarity score (highest first)
  3. Filters concepts above `MIN_SCORE` threshold (0.18)
  4. Applies pragmatic tagging logic:
     - Stops when score drops by >30% (consecutive) OR >8% (total from max)
     - Respects `MAX_K` limit (700 concepts)
     - Ensures minimum 8 tags per image
  5. Creates `ImageTag` records with scores
- **Note:** Only directly matched concepts are tagged (synonyms not auto-added)

#### 5c. **Tag All Existing Images with New Concepts** - **Pipeline 1.0 Only**
- **Function:** `tagNewConceptsOnAllImages()` in `tag-new-concepts-on-all.ts`
- **Trigger:** Only runs if new concepts were created (not duplicates/merges)
- **Pipeline 2.0:** Skipped (no new concepts to apply)
- **Process:**
  - Loads new concepts from seed file
  - Generates embeddings for new concepts (if not already embedded)
  - For each existing image:
    - Computes cosine similarity with new concept embeddings
    - Creates `ImageTag` if similarity >= `MIN_SCORE` (0.15)
  - **Optimization:** Only processes images that match their site's `imageUrl` (main images only)
- **Purpose:** Ensures new concepts are immediately searchable across all images

### 6. **Hub Detection** (background, debounced)
- **Function:** `triggerHubDetectionForImages()` in `hub-detection-trigger.ts`
- **Type:** Incremental (only processes new image, checks against all images)
- **Debounce:** 5 minutes (batches multiple images)
- **Process:**
  - Runs 1,517 test queries (all concept labels + synthetic phrases)
  - For each query:
    - Embeds query text
    - Gets top 40 images via pgvector similarity search
    - Tracks which images appear frequently across queries
  - Calculates hub score: `count / total_queries`
  - Threshold: `(topN / totalImages) * 1.5` (statistical threshold)
  - Stores hub stats: `hubCount`, `hubScore`, `hubAvgCosineSimilarity`, `hubAvgCosineSimilarityMargin`
- **Purpose:** Identifies images that appear too frequently in search results (potential quality issues)

### 7. **Cache Invalidation**
- Clears search result cache (new image may affect search results)
- Keeps query embedding cache (embeddings don't change)

---

## Pipeline Characteristics

### **Idempotent**
- Duplicate URLs return existing site (no duplicates)
- Embeddings reused via `contentHash` deduplication
- Concepts deduplicated (exact match → skip, fuzzy → merge)

### **Resilient**
- Screenshot failures are non-fatal (site created without image)
- Embedding generation failures are non-fatal (image stored, can be tagged later)
- Concept generation failures are non-fatal (tags with existing concepts only)
- Hub detection failures are non-fatal (background optimization)

### **Optimized**
- **Memory:** Only fetches minimal fields from database (`id`, `label` for concepts, not synonyms/related)
- **Data Transfer:** Loads synonyms/related from seed file (already in memory)
- **Embeddings:** Reuses embeddings for duplicate images (`contentHash` matching)
- **Hub Detection:** Incremental (only processes new images), debounced (batches requests)
- **Tagging:** Uses pre-computed concept embeddings (fast cosine similarity)

### **Category-Agnostic**
- Single pipeline handles all categories (websites, packaging, apps, fonts, etc.)
- Category passed as parameter (`category` field)
- No separate pipeline needed for new categories

---

## Key Files

- **Entry Point:** `src/app/api/sites/route.ts` (POST handler - supports both pipelines)
- **Tagging Logic:** 
  - Pipeline 1.0: `src/jobs/tagging.ts` (`tagImage()`, `createNewConceptsFromImage()`)
  - Pipeline 2.0: `src/jobs/tagging.ts` (`tagImageWithoutNewConcepts()`)
- **New Concept Tagging:** `src/jobs/tag-new-concepts-on-all.ts` (Pipeline 1.0 only)
- **Hub Detection:** `src/jobs/hub-detection.ts`, `src/jobs/hub-detection-trigger.ts`
- **Embeddings:** `src/lib/embeddings.ts` (CLIP image embeddings)
- **Concept Generation:** `src/lib/gemini.ts` (Gemini vision API - Pipeline 1.0 only)
- **Concept Enrichment:** `src/lib/concept-enrichment.ts` (synonyms/related - Pipeline 1.0 only)
- **Concept Opposites:** `src/lib/concept-opposites.ts`, `src/lib/update-concept-opposites.ts`

---

## Data Flow Diagram

```
POST /api/sites
  │
  ├─→ Screenshot Service (if no imageUrl)
  │   └─→ Screenshot URL
  │
  ├─→ Site Deduplication Check
  │   └─→ Existing Site? → Return
  │
  ├─→ Create Site Record
  │
  ├─→ Fetch Image → Canonicalize → contentHash
  │
  ├─→ Check Embedding by contentHash
  │   ├─→ Exists? → Reuse
  │   └─→ New? → Generate CLIP Embedding
  │
  ├─→ tagImage(imageId)
  │   ├─→ createNewConceptsFromImage()
  │   │   ├─→ Gemini Vision API → Generate Concepts
  │   │   ├─→ Generate Opposites (2-5 per concept)
  │   │   ├─→ Generate Synonyms/Related (AI or basic)
  │   │   ├─→ Check Duplicates → Skip/Merge
  │   │   ├─→ Save to seed_concepts.json
  │   │   └─→ Create Concept Records + Embeddings
  │   │
  │   └─→ Tag with All Concepts
  │       ├─→ Fetch All Concept Embeddings (id + embedding only)
  │       ├─→ Compute Cosine Similarity
  │       ├─→ Apply Pragmatic Tagging Logic
  │       └─→ Create ImageTag Records
  │
  ├─→ tagNewConceptsOnAllImages(newConceptIds)
  │   ├─→ Load New Concepts from Seed File
  │   ├─→ Generate Embeddings (if needed)
  │   ├─→ For Each Existing Image:
  │   │   └─→ Compute Similarity → Create ImageTag if >= MIN_SCORE
  │
  ├─→ triggerHubDetectionForImages([imageId])
  │   └─→ Debounced (5 min) → Incremental Hub Detection
  │
  └─→ Clear Search Cache
```

---

## Performance Optimizations

### Pipeline 2.0 Benefits
- **No API calls:** Skips Gemini/OpenAI concept generation (saves API costs and latency)
- **Faster processing:** No concept generation, no tagging of all existing images
- **Lower memory:** No concept generation overhead
- **Use when:** Concept vocabulary is stable, bulk ingestion, faster processing needed

### Memory Reduction (Recent)
- **Before:** Fetched full concepts (id, label, synonyms, related) → ~52.91 MB/image
- **After:** Only fetch id + label, load synonyms/related from seed file → ~1.5 MB saved/image
- **Reduction:** ~85% vs actual, ~95% vs before optimization

### Embedding Reuse
- **contentHash** deduplication: Identical images share embeddings
- Saves expensive CLIP embedding generation

### Incremental Hub Detection
- Only processes new images (not all images)
- Debounced (batches multiple images)
- Uses pgvector queries (efficient index scans)

### Pre-computed Concept Embeddings
- Concepts embedded once, reused for all images
- Fast cosine similarity computation (no API calls)

---

## Error Handling

All steps are **non-fatal** except site creation:
- Screenshot failure → Site created without image
- Embedding failure → Image stored, can be tagged later
- Concept generation failure → Tags with existing concepts only
- Hub detection failure → Background job, doesn't affect pipeline
- Cache clearing failure → Optimization, doesn't affect pipeline

---

## Pipeline Comparison

| Feature | Pipeline 1.0 | Pipeline 2.0 |
|---------|--------------|--------------|
| Concept Generation | ✅ Yes (Gemini/OpenAI) | ❌ No |
| Tags with Existing Concepts | ✅ Yes | ✅ Yes |
| Tags with New Concepts | ✅ Yes | ❌ N/A |
| Applies New Concepts to All Images | ✅ Yes | ❌ N/A |
| Hub Detection | ✅ Yes | ✅ Yes |
| Cache Clearing | ✅ Yes | ✅ Yes |
| API Calls Required | Gemini/OpenAI | None (except CLIP) |
| Processing Speed | Slower (concept generation) | Faster (no concept generation) |
| Use Case | Expanding vocabulary | Stable vocabulary, bulk ingestion |

## Future Improvements

1. **Move tagging to background worker** (currently inline)
2. **Batch concept generation** (currently one image at a time) - Pipeline 1.0
3. **Optimize hub detection** (currently 1,517 queries per image)
4. **Add concept versioning** (track concept changes over time)
5. **Add pipeline monitoring** (track performance, errors, bottlenecks)
6. **Pipeline selection based on image count** (auto-select Pipeline 2.0 for bulk operations)

