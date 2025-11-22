# Adding New Categories

## Overview

The system is designed to be **category-agnostic**. Adding a new category requires **no new code paths or special-case logic**. Everything uses:

- ✅ **One embedding model** (CLIP, 768-d)
- ✅ **One tagging system** (concept-based tagging)
- ✅ **One reranker** (shared across all categories)
- ✅ **One index** with a category flag (SQLite `Image.category` column)

## How to Add a New Category

### Step 1: Add the Category String

Simply use the new category string when ingesting images. No code changes needed.

**Example: Adding "billboards" category:**

```typescript
// In your ingestion script or API call
const category = 'billboards' // Just use the new string

// The existing pipeline handles it automatically
await prisma.image.create({
  data: {
    // ... other fields
    category: 'billboards', // That's it!
  }
})
```

### Step 2: Ingest Images Through Existing Pipeline

Use the **same unified pipeline** for all categories:

```typescript
// src/app/api/sites/route.ts (POST handler)
// This pipeline works for ANY category - just pass category = 'billboards'

const image = await prisma.image.upsert({
  where: { siteId_url: { siteId: site.id, url: imageUrl } },
  create: {
    siteId: site.id,
    url: imageUrl,
    category: 'billboards', // New category - no code changes needed
    // ... other fields
  }
})

// Embedding generation (same for all categories)
const { vector, contentHash } = await embedImageFromBuffer(buf)

// Tagging (same for all categories)
await tagImage(image.id) // Works for any category
```

**The pipeline automatically:**
1. Generates CLIP embeddings (same model, same dimensionality)
2. Tags with concepts (same tagging system)
3. Stores in `ImageEmbedding` and `ImageTag` (same tables)
4. Triggers hub detection (same system)

### Step 3: Search Works Automatically

The search API automatically supports the new category:

```typescript
// Search for billboards
GET /api/search?q=minimal&category=billboards

// Search all categories (including billboards)
GET /api/search?q=minimal&category=all
```

**No code changes needed** - the category filtering is generic:

```typescript
// src/app/api/search/route.ts
// This code works for ANY category - no hardcoding needed
if (category && category !== 'all') {
  whereClause.category = category // Works for 'billboards', 'websites', anything
}
```

### Step 4: (Optional) Add Category-Specific Optimizations

Some optimizations are category-specific but **not required** for basic functionality:

#### A. Category-Specific Query Expansions

Currently, query expansions have some category-specific logic for "website" and "packaging". For new categories, the system falls back to generic expansions.

**To add category-specific expansions** (optional):

1. Update `src/lib/query-expansion.ts`:
   ```typescript
   // Add category-specific context in the prompt
   if (category === 'billboards') {
     // Add billboard-specific context
   }
   ```

2. Or add curated expansions in `CURATED_EXPANSIONS`:
   ```typescript
   const CURATED_EXPANSIONS = {
     'minimal': {
       'website': ['clean layout', 'simple navigation', ...],
       'packaging': ['minimalist label', 'simple box design', ...],
       'billboards': ['large format', 'outdoor advertising', ...], // New
     }
   }
   ```

**Note**: This is optional. Without it, the system uses generic expansions which work fine.

#### B. Category-Specific UI Labels

Update `src/app/components/Gallery.tsx` to show labels for new categories:

```typescript
// Add to the category label mapping
{site.category === 'billboards' ? 'Billboard' : 
 site.category === 'packaging' ? 'Packaging' : 
 // ... other categories
 site.category}
```

**Note**: This is optional. Without it, the category string is shown as-is.

#### C. Category-Specific Concept Classifications

When creating new concepts from images, the system sets `applicableCategories` based on the image's category:

```typescript
// src/jobs/tagging.ts
// This automatically sets applicableCategories for new concepts
applicableCategories: [imageCategory], // e.g., ['billboards']
embeddingStrategy: imageCategory === 'fonts' ? 'generic' : `${imageCategory}_style`
```

For existing concepts, you can run the LLM classification script:

```bash
tsx scripts/classify_concepts_with_llm.ts
```

This will classify concepts for all categories, including new ones.

## Architecture: Why It Works

### Unified Data Model

```prisma
model Image {
  id        String
  category  String   @default("website") // Just a string - any value works
  // ... other fields
  @@index([category]) // Indexed for fast filtering
}
```

**Key Point**: `category` is just a string column. No enums, no special types. Any string value works.

### Unified Pipeline

```typescript
// src/app/api/sites/route.ts
// ONE pipeline for ALL categories
export async function POST(request: NextRequest) {
  const { category } = await request.json()
  const imageCategory = category || 'website' // Default, but any value works
  
  // Same embedding generation
  const { vector } = await embedImageFromBuffer(buf)
  
  // Same tagging
  await tagImage(image.id)
  
  // Same storage
  await prisma.image.create({ category: imageCategory })
}
```

**Key Point**: The pipeline doesn't care what category value is. It's just a parameter.

### Unified Search

```typescript
// src/app/api/search/route.ts
// Generic category filtering - works for any category
if (category && category !== 'all') {
  whereClause.category = category // Works for any string value
}

// Category-aware reranking (optional, falls back to generic)
if (imageCategory === 'website' && qWebsiteExpanded) {
  // Use website-specific expansion
} else if (imageCategory === 'packaging' && qPackagingExpanded) {
  // Use packaging-specific expansion
} else {
  // Fallback to generic expansion (works for any category)
  expandedQueryVec = qDefault
}
```

**Key Point**: Search is generic. Category-specific optimizations are optional enhancements.

## Current Categories

The system currently supports:
- `website` (default)
- `packaging`
- `app`
- `fonts`
- `graphic-design`
- `branding`

**But you can add any category** - just use the string value!

## Example: Adding "Mobile Apps" Category

```typescript
// 1. Ingest images with category = 'mobile-apps'
await prisma.image.create({
  data: {
    url: imageUrl,
    category: 'mobile-apps', // New category
    // ... other fields
  }
})

// 2. Search works immediately
GET /api/search?q=minimal&category=mobile-apps

// 3. (Optional) Add category-specific UI label
{site.category === 'mobile-apps' ? 'Mobile App' : ...}

// 4. (Optional) Add category-specific query expansions
if (category === 'mobile-apps') {
  // Add mobile app-specific context
}
```

**That's it!** No new code paths, no special cases, no separate pipelines.

## Fine-Tuning the Reranker (Future)

When you have enough mixed data across categories, you can fine-tune the learned reranker:

1. Collect interaction data across all categories
2. Train reranker with category as a feature
3. Reranker learns category-specific ranking patterns

**But this is optional** - the current reranker works fine with category as metadata.

## Summary

✅ **Adding a new category**: Just use the category string  
✅ **Ingestion**: Same pipeline, no changes needed  
✅ **Search**: Works automatically with category filtering  
✅ **No code changes required** for basic functionality  
✅ **Optional optimizations** can be added later (query expansions, UI labels, etc.)

The system is designed to be **category-agnostic** from the ground up. Category is just metadata that influences filtering and optional optimizations, not a fundamental architectural difference.

