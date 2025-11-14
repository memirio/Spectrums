# Looma — Design Discovery by Abstract Concepts

Looma is a web application that lets users discover great website designs by searching for abstract visual concepts (e.g., "playful", "austere", "measurement", "3d", "gradient"). Users can stack multiple concepts to refine results. Screenshots are automatically captured and tagged using CLIP embeddings, enabling zero-shot semantic search.

## Features

- **Zero-shot semantic search**: Search with any text query, ranked by CLIP image-text similarity
- **Concept-based boosting**: 94+ seeded design concepts provide subtle ranking improvements
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
   - Filters concepts above `MIN_SCORE` threshold (0.15)
   - Applies dynamic cutoff logic:
     - Stops when score drops by more than `MIN_SCORE_DROP_PCT` (10%)
     - Respects `MAX_K` limit (700 concepts)
     - Ensures minimum 8 tags per image for coverage
   - Creates `ImageTag` records with scores (using existing concepts only)
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
- **Concept boosting**: If your query matches seeded concepts (e.g., "playful", "modern"), images tagged with those concepts get a subtle 5% ranking boost
- **No hard cutoffs**: All images are ranked and returned (no filtering)

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
  TOP_K: 5,              // Number of concepts to tag per image
  MIN_SCORE: 0.12,       // Minimum cosine similarity to create a tag
  FALLBACK_K: 3,         // Fallback if no concepts pass MIN_SCORE
}
```

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
- **Concepts** — Design concept definitions (labels, synonyms, related terms, embeddings)
- **ImageTags** — Auto-tagging relationships (image ↔ concept with similarity scores)

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

**Note:** All data persists locally. The only external dependency is the Gemini API for generating new concepts, which is optional (you can disable it or use existing concepts only).

### Production Pipeline Flow

See [Production Pipeline (Add Photo Pipeline)](#5-production-pipeline-add-photo-pipeline) section above for detailed step-by-step documentation.

### Search Flow

1. **Query embedding** → User query embedded as CLIP text vector
2. **Image ranking** → All images ranked by cosine(query, imageEmbedding)
3. **Concept matching** → Query terms matched against seeded concepts (by id, label, synonyms)
4. **Subtle boosting** → Images with matching concept tags get 5% boost
5. **Result return** → All sites returned, ranked by final score

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
- `synonyms`: 3-8 related terms for matching
- `related`: 3-8 visual terms for embedding
- `embedding`: Unit-normalized CLIP text vector

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
│   │   │   ├── search/route.ts      # Zero-shot search endpoint
│   │   │   └── sites/route.ts       # Site creation endpoint
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
│   │   └── tagging-config.ts        # Auto-tagging constants
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
│   └── ...                          # More utility scripts
├── docs/
│   ├── SEARCH_QUALITY_MAINTENANCE.md  # Search quality maintenance guide
│   └── SYNONYM_EXPANSION_GUIDE.md     # Synonym expansion guide
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
