# Looma — Design Discovery by Abstract Concepts

Looma is a web application that lets users discover great website designs by searching for abstract visual concepts (e.g., "playful", "austere", "measurement", "3d", "gradient"). Users can stack multiple concepts to refine results. Screenshots are automatically captured and tagged using CLIP embeddings, enabling zero-shot semantic search.

## Features

- **Zero-shot semantic search**: Search with any text query, ranked by CLIP image-text similarity
- **Abstract query expansion**: Automatically expands abstract queries (e.g., "euphoric", "serene") into concrete visual descriptions for better CLIP matching
- **Concept-based boosting**: 94+ seeded design concepts provide subtle ranking improvements
- **Learned reranker (in development)**: Small MLP model that learns from user interactions to improve search relevance (requires ~1000+ interactions to train)
- **Multi-concept stacking**: Combine multiple terms like "playful gradient 3d"
- **Automatic tagging**: New screenshots are embedded & auto-tagged on ingest
- **Screenshot service**: Automated website screenshot capture with cookie banner removal
- **Interactive gallery**: Responsive grid with beautiful UI and concept chips
- **Submission form**: Easy site submission with automatic screenshot generation

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: SQLite via Prisma 6
- **Embeddings**: @xenova/transformers (CLIP ViT-L/14)
- **Concept Generation**: Google Gemini 1.5 Flash (vision-language model)
- **Query Expansion**: Groq API (llama-3.3-70b-versatile) for abstract query expansion
- **Image Processing**: Sharp
- **Screenshot Service**: Playwright (Chromium) with BullMQ queue

---

## Quick Start

### Prerequisites

- **Node.js 18+** (Node 22 recommended)
- **npm** (or pnpm/yarn)
- **Docker Desktop** (optional, for screenshot service with MinIO)

### 1. Clone & Install

```bash
git clone <repository-url>
cd Looma
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="file:./dev-new.db"

# Concept Generation (required for auto-tagging)
GEMINI_API_KEY="your-google-gemini-api-key"

# Query Expansion (required for abstract query expansion)
# Uses Groq API (OpenAI-compatible) for fast, low-latency query expansion
GROQ_API_KEY="your-groq-api-key"

# Screenshot Service (optional - only needed if using local screenshot service)
SCREENSHOT_API_URL=http://localhost:3001
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates database if it doesn't exist)
npx prisma migrate dev

# Optional: Open Prisma Studio to explore the database
npx prisma studio
```

### 4. Seed Design Concepts

Seed the 94+ design concepts used for auto-tagging and search ranking:

```bash
npx tsx scripts/seed_concepts.ts
```

This will:
- Load concepts from `src/concepts/seed_concepts.json` (94 concepts across 7 categories)
- Generate CLIP text embeddings for each concept
- Store them in the database

**Expected output:**
```
[seed] Processing 94 concepts...
[seed] Force mode: OFF (preserve existing)
  created   playful              synonyms: 6 related: 4 dim:768 norm:1.000 [0.1234, 0.5678, ...]
  created   minimalistic         synonyms: 5 related: 4 dim:768 norm:1.000 [0.2345, 0.6789, ...]
  ...
[seed] Summary:
  Created:  94
  Updated:  0
  Skipped:  0
  Total:    94
```

### 5. Production Pipeline (Add Photo Pipeline)

The production pipeline automatically processes new sites when added via the API or submission form. This is the complete "add-photo pipeline" that runs for every new site submission:

#### Step-by-Step Process

1. **Duplicate Prevention**
   - Normalizes URL (removes trailing slashes)
   - Checks for existing sites with the same URL
   - Returns existing site if found (prevents duplicates)

2. **Screenshot Capture** (if no `imageUrl` provided)
   - Calls screenshot service API with idempotency key
   - Waits for full page load (~35-45 seconds total):
     - Page load event
     - Network idle wait (up to 15s)
     - Page stabilization (10s)
     - Image loading (up to 10s per image)
     - Lazy-loaded content wait (3s)
     - **Final 8-second wait** before capture (ensures content is fully loaded)
   - Polls status endpoint if screenshot is queued (up to 60s timeout)
   - Returns screenshot URL or continues without image if generation fails

3. **Site Creation**
   - Creates `Site` record in database
   - Associates any provided tags

4. **Image Processing** (if `imageUrl` exists)
   - Fetches image from URL
   - Creates/updates `Image` record with metadata (width, height, bytes)
   - Uses upsert to handle duplicate images for same site

5. **Image Canonicalization**
   - Decodes image to sRGB color space
   - Removes alpha channel
   - Encodes as PNG
   - Computes SHA-256 `contentHash` for deduplication

6. **CLIP Embedding Generation**
   - Checks if embedding exists by `contentHash` (reuses if found)
   - If not found, generates CLIP image embedding (768-dim vector)
   - Stores embedding in `ImageEmbedding` table with `contentHash`
   - Unit-normalizes vector (L2 norm = 1.0)

7. **First Round: Concept Scoring & Tagging (Existing Concepts)**
   - Computes cosine similarity between image embedding and all seeded concept embeddings
   - Sorts concepts by similarity score (highest first)
   - Filters concepts above `MIN_SCORE` threshold (0.18)
   - Applies dynamic cutoff logic:
     - Stops when score drops by more than `MIN_SCORE_DROP_PCT` (30%)
     - Respects `MAX_K` limit (700 concepts)
     - Ensures minimum 8 tags per image for coverage
   - Creates `ImageTag` records with scores (using existing concepts only)
   - **Note**: Images are tagged only with directly matched concepts. Synonyms are not automatically added as tags.
   - Removes old tags that are no longer in top-K

8. **Gemini Concept Generation**
   - Analyzes image using Google Gemini 1.5 Flash vision model
   - Generates new abstract concepts (at least 1 per category from 12 categories):
     - Feeling/Emotion, Vibe/Mood, Philosophical/Existential, Aesthetic/Formal, Natural/Metaphysical, Social/Cultural, Design Style, Color & Tone, Texture & Materiality, Form & Structure, Design Technique, Industry
   - Creates new concepts in `seed_concepts.json` and database
   - Merges duplicates (exact matches) and synonyms (fuzzy matches) into existing concepts

9. **Second Round: Concept Scoring & Tagging (All Concepts)**
   - Re-computes cosine similarity between image embedding and **all concepts** (existing + newly created)
   - Re-applies pragmatic tagging logic with updated concept list
   - Updates `ImageTag` records (may add tags for newly created concepts if they score high)

10. **New Concept Auto-Tagging**
    - Applies newly created concepts to **all existing images** in the database
    - Only tags images where similarity score >= `MIN_SCORE` (0.15)
    - Ensures new concepts are immediately searchable across all images

#### Pipeline Characteristics

- **Idempotent**: Duplicate URLs return existing site instead of creating duplicates
- **Resilient**: Screenshot failures are non-fatal (site created without image)
- **Efficient**: Reuses embeddings by content hash (deduplication)
- **Automatic**: All steps run automatically when site is submitted
- **Non-blocking**: Gemini concept generation and new concept tagging are non-fatal (warnings logged, but request succeeds)

#### Pipeline Triggers

The pipeline is automatically triggered by:
- **Web UI**: Submit button in header → submission form → POST `/api/sites`
- **API**: Direct POST request to `/api/sites` endpoint
- **Scripts**: `npx tsx scripts/add_site.ts <url> [title]`

**Adding a Site via Script:**

```bash
# Add a single site
npx tsx scripts/add_site.ts <url> [title]

# Examples
npx tsx scripts/add_site.ts https://lusion.co/
npx tsx scripts/add_site.ts https://example.com "Example Site"
```

**Adding a Site via API:**

```bash
curl -X POST http://localhost:3002/api/sites \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Site Name",
    "url": "https://example.com",
    "description": "",
    "imageUrl": "",
    "author": "",
    "tags": []
  }'
```

**Adding a Site via UI:**

Use the "Submit" button in the header to open the submission form. The pipeline automatically triggers when you submit.

### 6. Start the Development Server

```bash
npm run dev
```

The app will start on `http://localhost:3000` (or next available port). Check the terminal output for the exact URL.

### 6. (Optional) Start Screenshot Service

If you want automatic screenshot generation, start the screenshot service:

```bash
cd screenshot-service
docker-compose up -d
```

This starts:
- **API server** (port 3001)
- **Queue worker** (processes screenshot jobs)
- **Redis** (job queue)
- **MinIO** (S3-compatible storage on port 9000)

The screenshot service is optional. You can submit sites with existing `imageUrl` values without it.

---

## Adding Your First Sites

### Method 1: Via Web UI

1. Open `http://localhost:3000` in your browser
2. Click "Submit Site"
3. Enter:
   - **Title**: Site name
   - **URL**: Website URL (e.g., `https://stripe.com`)
   - **Author**: Optional author/company name
4. Click submit

The system will:
- Generate a screenshot (if screenshot service is running)
- Create an Image record
- Generate CLIP embeddings
- Auto-tag with top 3-5 matching concepts

### Method 2: Via API

```bash
curl -X POST "http://localhost:3000/api/sites" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Stripe",
    "url": "https://stripe.com",
    "author": "Stripe",
    "description": "",
    "imageUrl": "",
    "tags": []
  }'
```

### Method 3: Bulk Add Sites

Create a script or use the API to add multiple sites:

```bash
# Example: Add sites from a list
npx tsx scripts/add_sites.ts
```

---

## Using the Search

### Basic Search

1. Open the app in your browser
2. Type any search term in the search box (e.g., "playful", "3d", "minimalist")
3. Press Enter or Tab to add it as a chip
4. Add multiple concepts to combine them (e.g., "playful gradient 3d")
5. Results are ranked by CLIP cosine similarity + subtle concept boosts

### How Search Works

- **Zero-shot CLIP search**: Your query is embedded as text and compared directly with image embeddings via cosine similarity
- **Abstract query expansion**: For abstract queries (e.g., "euphoric", "serene", "bold"), the system automatically expands them into concrete visual descriptions that CLIP can better match. See [Query Expansion](#query-expansion) below for details.
- **Light tag-based reranking**: Images with matching concept tags get a subtle 5% boost; opposite tags get a 3% penalty (only applied to top 200 results)
- **Hub penalty system**: Images that appear disproportionately frequently across queries are automatically detected and penalized to prevent "hub effect" (see [Hub Detection](#hub-detection--penalty-system) below)
- **Learned reranker (future)**: Once enough interaction data is collected (~1000+ interactions), a small MLP model will replace the hand-crafted ranking formula. See [Learned Reranker](#learned-reranker-future-enhancement) below for details.
- **No hard cutoffs**: All images are ranked and returned (no filtering)

**For detailed search logic documentation**, including tag matching weights, multi-term query handling, and opposite tag penalties, see:
- [Search Logic Documentation](./docs/SEARCH_LOGIC.md) — Complete guide to ranking algorithm, weights, and penalties

### Query Expansion

For abstract queries (emotional, mood-based, or abstract visual concepts), the system uses **query expansion** to improve search relevance. Abstract queries are automatically detected and expanded into concrete visual descriptions that CLIP can better match.

**How it works:**
1. **Detection**: The system detects if a query is abstract (e.g., "euphoric", "serene", "bold", "elegant")
2. **Expansion**: Abstract queries are expanded into 4-6 concrete visual descriptions (e.g., "euphoric" → "bright and pastel color palette with soft gradients", "rounded shapes with shimmering effects")
3. **Embedding**: Each expansion is embedded with CLIP, then averaged and normalized to create the query vector
4. **Matching**: Images are ranked by cosine similarity to this expanded query embedding

**Storage Strategy:**
- **Curated expansions**: Hand-crafted expansions stored in `src/lib/query-expansions.json` (versioned, reviewable)
- **Groq-generated expansions**: LLM-generated expansions cached in SQLite `QueryExpansion` table (efficient, analyzable)
- **Hybrid lookup**: System checks curated JSON first, then database cache, then generates new expansions if needed

**Example expansions:**
- **"euphoric"** → "bright and pastel color palette with soft gradients", "rounded shapes with shimmering effects", "vibrant splashes of color on neutral backgrounds"
- **"serene"** → "soft blue and pale green color palette", "gentle natural textures with muted colors", "calming atmospheric effects with light gradients"
- **"bold"** → "thick black lines and geometric shapes", "bold sans-serif fonts in dark colors", "high contrast color schemes with deep shadows"

**Configuration:**
- Requires `GROQ_API_KEY` environment variable
- Uses Groq API (OpenAI-compatible) with `llama-3.3-70b-versatile` model
- Automatically tries multiple models if one is blocked
- Expansions are cached in database to avoid repeated LLM calls

**Adding curated expansions:**
Edit `src/lib/query-expansions.json` to add hand-crafted expansions for common abstract terms. These take precedence over LLM-generated expansions.

---

## Scripts & Developer Tools

All scripts are run from the project root using `npx tsx`.

### Concept Management

```bash
# Seed all concepts (first time setup)
npx tsx scripts/seed_concepts.ts

# Re-seed with --force (re-embeds all concepts)
npx tsx scripts/seed_concepts.ts --force

# List all concepts with stats
npx tsx scripts/list_concepts.ts

# Check similarity: which concepts match a query phrase?
npx tsx scripts/check_concept_similarity.ts "playful gradient 3d"

# Sync opposites from seed_concepts.json to concept-opposites.ts and re-tag all images
npx tsx scripts/sync_and_retag_all.ts
```

### Site & Image Management

```bash
# Add a new site (production pipeline)
npx tsx scripts/add_site.ts <url> [title]

# Check how many sites are in the database
npx tsx scripts/check_sites.ts

# Check tagging status for all images
npx tsx scripts/check_tagging_status.ts

# Retag the most recent image (useful for testing)
npx tsx scripts/retag_latest.ts

# Backfill tagging for images without tags
npx tsx scripts/backfill_tagging.ts
```

### Embedding & Search Testing

```bash
# Test image embedding (uses a test image)
npx tsx scripts/smoke.ts

# Test text vs image similarity
npx tsx scripts/test_clip_image.ts <image-url-or-path>

# Test zero-shot search ranking
npx tsx scripts/test_zero_shot_search.ts

# Self-test: verify embeddings are deterministic
npx tsx scripts/selftest_same_image.ts <image-url-or-path>

# Print metadata for last 20 images
npx tsx scripts/print_last20.ts
```

### Screenshot Service (if using)

```bash
# Generate screenshots for all sites without images
npx tsx scripts/generate-screenshots-for-existing-sites.ts

# Regenerate all screenshots
npx tsx scripts/regenerate-all-screenshots.ts

# Retry failed screenshots
npx tsx scripts/retry-failed-screenshots.ts
```

### Hub Detection & Penalty System

The system automatically detects "hub" images that appear disproportionately frequently in search results and applies penalties to prevent them from dominating results.

**Run hub detection:**
```bash
# Detect hubs with default settings (topN=40, threshold=1.5x expected)
npx tsx scripts/detect_hub_images.ts --clear

# Custom threshold (stricter = 2.0x, more lenient = 1.2x)
npx tsx scripts/detect_hub_images.ts --clear --threshold-multiplier=2.0

# Test penalty effects
npx tsx scripts/test_hub_penalty.ts --query="dark" --top-n=20

# Check hub statistics
npx tsx scripts/check_image_counts.ts
npx tsx scripts/check_negative_margins.ts
```

**How it works:**
- Runs 1,517 test queries and tracks how often each image appears in top 40 results
- Only images that appear **more frequently than statistically expected** are labeled as hubs
- Applies percentage-based penalties directly to cosine similarity scores (baseScore)
- Penalty combines margin-based (how much above query average) and frequency-based (how often it appears) components
- Hubs with negative margins (performing below average) get reduced frequency penalties (50% reduction)
- Each hub gets a unique penalty based on its margin and frequency, capped at 20% of base score

**For complete documentation**, see:
- [Hub Detection System](./docs/HUB_DETECTION_SYSTEM.md) — Complete guide to hub detection, penalties, and configuration
- [Hub Identification Criteria](./docs/HUB_IDENTIFICATION_CRITERIA.md) — Detailed criteria and algorithm documentation

### Search Quality Maintenance

Prevent ranking issues by regularly checking synonym coverage and tagging quality:

```bash
# Check if query terms match concepts (finds missing synonyms)
npm run check:synonyms [term]

# Check for images that should be tagged but aren't
npm run check:tagging <concept-id>

# Validate search quality for common queries
npm run validate:search
```

**Examples:**
```bash
# Check if "illustration" matches concepts
npm run check:synonyms illustration

# Find images with high 3D scores but no tags
npm run check:tagging 3d

# Test common queries and verify ranking
npm run validate:search
```

**Prevention Workflow:**
1. **Weekly**: Run `npm run validate:search` to catch issues early
2. **Monthly**: Run `npm run check:synonyms` to find missing synonym matches
3. **Quarterly**: Run `npm run check:tagging` for major concepts to find false negatives

For detailed guidance, see:
- [Search Logic Documentation](./docs/SEARCH_LOGIC.md) — Complete guide to ranking algorithm, tag weights, and opposite penalties
- [Search Quality Maintenance Guide](./docs/SEARCH_QUALITY_MAINTENANCE.md) — Quick reference and maintenance checklist
- [Synonym Expansion Guide](./docs/SYNONYM_EXPANSION_GUIDE.md) — How to expand synonyms when queries don't match

**Common Issues:**
- **Query term doesn't match concept**: Add missing synonym to `src/concepts/seed_concepts.json`, then re-seed
- **Images should be tagged but aren't**: Check `check_tagging_quality.ts` output, manually tag clear cases
- **Tagged images rank low**: Verify search weighting (should be 80% tags, 20% base) and synonym matches

---

## API Endpoints

### Create a Site

```bash
POST /api/sites
Content-Type: application/json

{
  "title": "Site Name",
  "url": "https://example.com",
  "author": "Author Name",
  "description": "",
  "imageUrl": "",
  "tags": []
}
```

**Behavior:**
- If `imageUrl` is empty and screenshot service is available, generates a screenshot
- Creates Site and Image records
- Generates CLIP embedding automatically
- Auto-tags with top 3-5 matching concepts
- Returns the created site

### Search Sites

```bash
GET /api/search?q=playful+gradient+3d
```

**Response:**
```json
{
  "query": "playful gradient 3d",
  "sites": [
    {
      "id": "...",
      "title": "Site Name",
      "url": "https://example.com",
      "imageUrl": "http://localhost:9000/screenshots/...",
      "author": "...",
      "description": null,
      "tags": []
    }
  ],
  "images": [
    {
      "imageId": "...",
      "siteId": "...",
      "url": "...",
      "siteUrl": "...",
      "score": 0.234
    }
  ]
}
```

**Debug Mode:**
```bash
GET /api/search?q=playful&debug=1
```

Returns pure cosine similarity scores without concept boosting. Useful for debugging.

### Debug Image Scores

```bash
GET /api/debug/score?imageId=<image-id>
```

Returns sorted concept scores for a specific image.

### Get All Sites

```bash
GET /api/sites
```

Returns all sites (no search filtering).

---

## Configuration

### Auto-Tagging Constants

Edit `src/lib/tagging-config.ts` to tune auto-tagging:

```typescript
export const TAG_CONFIG = {
  MAX_K: 700,            // Maximum concepts to tag per image (not a target - only tag if truly relevant)
  MIN_SCORE: 0.18,       // Minimum cosine similarity to create a tag (absolute floor)
  MIN_SCORE_DROP_PCT: 0.30,  // Minimum percentage drop allowed between consecutive tags (30% drop indicates significantly less relevant)
  FALLBACK_K: 6,         // Fallback if no concepts pass MIN_SCORE
}
```

**Note**: Images are tagged only with directly matched concepts. Synonyms are not automatically added as tags.

### Search Ranking Constants

```typescript
export const SEARCH_CONFIG = {
  CONCEPT_BOOST_MULTIPLIER: 0.05,  // 5% boost per concept match
  MAX_BOOST_PERCENT: 0.05,         // Cap at 5% of base score
}
```

---

## Architecture

### Database Storage

All application data is stored in a **single SQLite database** (via Prisma):

**Stored in SQLite Database:**
- **Sites** — Website records (title, URL, author, description)
- **Tags** — Legacy tag system (many-to-many with sites)
- **Images** — Image metadata (URL, dimensions, bytes, timestamps)
- **ImageEmbeddings** — CLIP image embeddings (768-dim vectors) with contentHash for deduplication
- **Concepts** — Design concept definitions (labels, synonyms, related terms, opposites, embeddings)
- **ImageTags** — Auto-tagging relationships (image ↔ concept with similarity scores)
  - Images are tagged only with directly matched concepts (no synonym expansion)
- **UserInteractions** — User interaction data for learned reranker training (queries, clicks, saves, dwell time, query embeddings, tag features)
- **QueryExpansion** — Cached LLM-generated query expansions (Groq) for abstract terms

**Stored Separately (Not in Database):**
- **Screenshot files** — Stored in MinIO (S3-compatible object storage)
  - Database only stores the URL reference (e.g., `http://localhost:9000/screenshots/...`)
  - Actual image files are in MinIO buckets
- **Job queue state** — Redis (ephemeral, used by screenshot service for BullMQ)

**Summary:**
- All structured data (sites, images, embeddings, concepts, tags) → Same SQLite database
- Screenshot image files → MinIO object storage (referenced by URL)
- Job queue state → Redis (ephemeral)

### Local Storage

**Everything is stored locally by default** (no cloud dependencies):

**Local Files:**
- **SQLite database** — `./dev-new.db` (project root)
- **Concept definitions** — `src/concepts/seed_concepts.json` (in repository)
- **CLIP models** — Cached locally by `@xenova/transformers` (typically in `~/.cache/huggingface/` or `node_modules/.cache/`)

**Local Docker Volumes** (if using screenshot service):
- **MinIO data** — Docker volume `minio-data` (screenshot files)
- **Redis data** — Docker volume `redis-data` (job queue state)

**External Services:**
- **Google Gemini API** — Remote API calls only (no data stored remotely)
  - Used for concept generation from images
  - Requires `GEMINI_API_KEY` environment variable
- **Groq API** — Remote API calls only (no data stored remotely)
  - Used for abstract query expansion
  - Requires `GROQ_API_KEY` environment variable
  - Expansions are cached locally in SQLite database

**Note:** All data persists locally. The only external dependencies are:
- Gemini API for generating new concepts (optional - you can disable it or use existing concepts only)
- Groq API for query expansion (optional - system falls back to direct embedding if expansion fails)

### Production Pipeline Flow

See [Production Pipeline (Add Photo Pipeline)](#5-production-pipeline-add-photo-pipeline) section above for detailed step-by-step documentation.

### Search Flow

1. **Query expansion** (if abstract) → Abstract queries expanded into concrete visual descriptions
2. **Query embedding** → User query (or expanded query) embedded as CLIP text vector
3. **Image ranking** → All images ranked by cosine(query, imageEmbedding) - this is the primary ranking signal
4. **Light reranking** (top 200) → For top results, apply very small tag-based boosts/penalties:
   - Images with matching concept tags get 5% boost (0.05 * tagScore)
   - Images with opposite concept tags get 3% penalty (0.03 * tagScore)
5. **Interaction logging** → Log impressions for learned reranker training (top 20 results)
6. **Result return** → All sites returned, ranked by final score

**Future: Learned Reranker**
- Once 1000+ interactions are collected, a small MLP model will replace step 4
- The learned model will adapt to user behavior and improve over time
- See [Learned Reranker](#learned-reranker-future-enhancement) section for details

### Design Concepts

94+ concepts across 7 categories:

- **Style/Aesthetic** (20): modern, minimalistic, brutalist, futuristic, retro, editorial, artistic, experimental, geometric, organic, surreal, corporate, professional, friendly, elegant, bold, calm, luxurious
- **Color/Tone** (13): monochrome, colorful, gradient, dark, light, pastel, high-contrast, warm, cool, muted, vibrant, duotone, neon
- **Layout/Composition** (14): grid-based, asymmetrical, centered, spacious, dense, modular, full-bleed, split-screen, card-based, masonry, hero-led, long-scroll, magazine-layout, poster-like
- **Mood/Brand** (12): playful, strict, premium, whimsical, gritty, serene, authoritative, inviting, expressive, understated, energetic, cinematic
- **Typography** (10): typographic, serif, sans-serif, handwritten, editorial-type, display-type, large-type, condensed, geometric-type, variable-font, monospace
- **Interaction/Tech** (11): 3d, animated, interactive, parallax, scroll-driven, motion-heavy, micro-interactions, responsive, static, immersive
- **Industry/Purpose** (14): portfolio, ecommerce, ai, agency, architecture, fashion, art, product, startup, magazine, SaaS, developer-docs, landing-page

Each concept includes:
- `id`: Unique identifier (kebab-case)
- `label`: Display name (Title Case)
- `synonyms`: 3-8 related terms for matching (used in search, not for image tagging)
- `related`: 3-8 visual terms for embedding
- `opposites`: Array of opposite concept IDs (synced to `concept-opposites.ts`)
- `embedding`: Unit-normalized CLIP text vector

**Note**: Images are tagged only with directly matched concepts based on cosine similarity. Synonyms are used for search query matching but are not automatically added as tags to images.

### Concept Opposites

Concepts can have opposite relationships defined in `seed_concepts.json`. These opposites are automatically synced to `src/lib/concept-opposites.ts` and are used in:

- **Search ranking**: Images with opposite tags receive penalties in search results
- **Tag validation**: Helps filter false positive tags

To sync opposites from `seed_concepts.json` to `concept-opposites.ts` and re-tag all images:

```bash
npx tsx scripts/sync_and_retag_all.ts
```

This script:
1. Syncs all opposites from `seed_concepts.json` to `concept-opposites.ts` (ensures bidirectional relationships)
2. Re-tags all images using the current tagging logic (direct matches only, no synonym expansion)

---

## Troubleshooting

### "Cannot find module" errors

**Solution**: Ensure you're in the project root directory:
```bash
cd /path/to/Looma
npx tsx scripts/seed_concepts.ts
```

### Database not found

**Solution**: Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

### No concepts found

**Solution**: Seed concepts:
```bash
npx tsx scripts/seed_concepts.ts
```

### Images not getting tagged

**Solution**: Check that:
1. Concepts are seeded: `npx tsx scripts/list_concepts.ts`
2. Images have embeddings: `npx tsx scripts/print_last20.ts`
3. Retag an image: `npx tsx scripts/retag_latest.ts`

### Screenshot service not working

**Solution**: 
1. Ensure Docker Desktop is running
2. Start the service: `cd screenshot-service && docker-compose up -d`
3. Check logs: `docker-compose logs -f`

### Search returns no results

**Solution**: 
1. Ensure sites exist: `npx tsx scripts/check_sites.ts`
2. Ensure images have embeddings: `npx tsx scripts/check_tagging_status.ts`
3. Try a different search query (zero-shot works for any text)

### Tagged images ranking low for queries

**Solution**:
1. Check if query term matches concept: `npm run check:synonyms <term>`
2. If no match, add missing synonym to `src/concepts/seed_concepts.json`
3. Re-seed concepts: `npm run seed:concepts -- --only="<category>"`
4. Verify: `npm run check:synonyms <term>` should now show matches

### Images should have tags but don't

**Solution**:
1. Check tagging quality: `npm run check:tagging <concept-id>`
2. Review images with high zero-shot scores but no tags
3. Manually tag clear cases (see [Search Quality Maintenance Guide](./docs/SEARCH_QUALITY_MAINTENANCE.md))
4. If many images affected, consider adjusting `TAG_CONFIG.MIN_SCORE` or `TAG_CONFIG.MAX_K`

### Port already in use

**Solution**: Next.js will automatically use the next available port. Check terminal output for the actual URL.

---

## Project Structure

```
Looma/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── search/route.ts      # Zero-shot search endpoint (logs impressions)
│   │   │   ├── sites/route.ts       # Site creation endpoint
│   │   │   └── interactions/route.ts # User interaction logging endpoint
│   │   ├── components/
│   │   │   ├── Gallery.tsx         # Main gallery component
│   │   │   └── SubmissionForm.tsx   # Site submission form
│   │   └── globals.css              # Global styles (includes .magical-glow)
│   ├── concepts/
│   │   ├── seed_concepts.json       # 94+ design concepts
│   │   └── seed.ts                  # Concept seeding script
│   ├── lib/
│   │   ├── embeddings.ts            # CLIP embedding functions
│   │   ├── prisma.ts                # Prisma client singleton
│   │   ├── tagging-config.ts        # Auto-tagging constants
│   │   ├── concept-opposites.ts     # Concept opposites mapping (synced from seed_concepts.json)
│   │   ├── query-expansion.ts       # Abstract query expansion (curated + Groq)
│   │   ├── query-expansions.json    # Curated query expansions (versioned)
│   │   ├── interaction-logger.ts    # User interaction logging for learned reranker
│   │   └── update-concept-opposites.ts  # Utility to sync opposites
│   └── jobs/
│       └── tagging.ts               # Auto-tagging job (used inline)
├── scripts/
│   ├── seed_concepts.ts             # Seed design concepts
│   ├── list_concepts.ts             # List all concepts
│   ├── check_concept_similarity.ts  # Check query-concept similarity
│   ├── check_sites.ts               # Count sites
│   ├── check_tagging_status.ts     # Check image tagging
│   ├── check_synonym_coverage.ts   # Find missing synonym matches
│   ├── check_tagging_quality.ts    # Find images that should be tagged
│   ├── validate_search_quality.ts   # Validate search ranking quality
│   ├── retag_latest.ts              # Retag most recent image
│   ├── backfill_tagging.ts          # Tag all untagged images
│   ├── sync_and_retag_all.ts        # Sync opposites and re-tag all images
│   ├── check-interaction-stats.ts   # Check user interaction statistics
│   ├── check-training-readiness.ts  # Quick check if ready to train learned reranker
│   ├── create-test-interactions.ts  # Create synthetic interactions for testing
│   ├── detect_hub_images.ts         # Detect hub images (statistically significant)
│   ├── test_hub_penalty.ts         # Test hub penalty effects
│   ├── check_negative_margins.ts   # Check hubs with negative margins
│   ├── check_image_counts.ts       # Check image and hub statistics
│   └── ...                          # More utility scripts
├── docs/
│   ├── SEARCH_LOGIC.md                # Complete search ranking algorithm documentation
│   ├── SEARCH_QUALITY_MAINTENANCE.md  # Search quality maintenance guide
│   ├── SYNONYM_EXPANSION_GUIDE.md     # Synonym expansion guide
│   ├── HUB_DETECTION_SYSTEM.md        # Hub detection and penalty system documentation
│   ├── HUB_IDENTIFICATION_CRITERIA.md # Hub identification criteria and algorithm
│   └── LEARNED_RERANKER_PLAN.md       # Plan for learned reranker based on user interactions
├── screenshot-service/              # Optional screenshot service
│   ├── docker-compose.yml           # Docker setup (API, worker, Redis, MinIO)
│   ├── src/
│   │   ├── api/                     # Express API
│   │   ├── capture/                 # Playwright screenshot logic
│   │   └── queue/                   # BullMQ worker
│   └── README.md                    # Screenshot service docs
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Migration history
├── .env                             # Environment variables
├── package.json
└── README.md                        # This file
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## License

MIT

---

## Inspiration

- **Awwwards** — Celebrating the best of web design
- **Land-book** — Curated landing page gallery
- **Site Inspire** — Web design inspiration

**Looma's twist**: Discovery by abstract concept instead of just categories—stack "playful + precise + editorial" and find visuals that feel right, powered by AI understanding of visual semantics.

---

## Learned Reranker (Future Enhancement)

### Overview

The system is designed to replace the current hand-crafted ranking formula with a **learned reranker** — a small machine learning model that adapts to user behavior. This model learns from actual user interactions to improve search relevance automatically.

**Current Status:**
- ✅ Infrastructure ready (interaction tracking, database schema, logging)
- ⏳ Collecting training data (need ~1000+ interactions)
- ⏳ Model training (once enough data is collected)

### How the Learned Reranker Works

The learned reranker is a small MLP (Multi-Layer Perceptron) that:

1. **Learns from user behavior**: Trained on clicks, saves, and dwell time to understand what users actually find relevant
2. **Adapts to query-specific patterns**: 
   - For "3d" queries: learns to prefer actual 3D renders over shadowy photos
   - For "love" queries: learns to prefer images with faces, warm colors, and intimacy over random hearts
   - For "fun" queries: learns what "fun" actually means to your users
3. **Replaces hand-tuning**: Automatically optimizes tag weights and ranking signals instead of manual coefficient adjustment
4. **Improves over time**: Retrained periodically with new interaction data to adapt to changing preferences

### Architecture

**Input Features:**
- Query embedding (768-dim CLIP vector)
- Image embedding (768-dim CLIP vector)
- Handcrafted features: cosine similarity, tag scores, match counts, opposite penalties

**Model:**
- Small MLP: 1536+features → 256 → 64 → 1
- <100KB model size
- Trained with pairwise ranking loss
- Exported to ONNX for efficient inference in Node.js

### Data Collection

The system automatically collects interaction data:

- **Impressions**: Logged when search results are shown (top 20 per query)
- **Clicks**: Tracked when users click on results
- **Dwell time**: Time spent viewing results (via visibility/beforeunload events)
- **Saves**: Tracked when users save/favorite results

**Check your progress:**
```bash
# Check interaction statistics
npx tsx scripts/check-interaction-stats.ts

# Quick readiness check (shows notification when 1000+ reached)
npx tsx scripts/check-training-readiness.ts
```

**Bootstrap with test data (optional):**
```bash
# Create synthetic interactions for testing
npx tsx scripts/create-test-interactions.ts
```

### Training the Model

Once you have 1000+ interactions:

1. **Export training data**: `npx tsx scripts/export-training-data.ts` (to be implemented)
2. **Train model**: `python scripts/train_reranker.py` (to be implemented)
3. **Deploy**: Model runs in shadow mode first, then gradually replaces hand-crafted ranking

**See [Learned Reranker Plan](./docs/LEARNED_RERANKER_PLAN.md) for complete design, architecture, and implementation details.**
