# Search Quality Maintenance

## Quick Reference

```bash
# Check if query terms match concepts
npm run check:synonyms [term]

# Check if images should be tagged but aren't
npm run check:tagging <concept-id>

# Validate search quality for common queries
npm run validate:search
```

## Prevention Strategy

### 1. Proactive Monitoring

Run validation regularly to catch issues early:

```bash
# Weekly validation
npm run validate:search
```

This tests common queries and verifies:
- Tagged images rank appropriately
- Direct hits are counted correctly
- Expected sites appear in top results

### 2. Synonym Coverage Checks

Before adding new concepts or after synonym changes:

```bash
# Check common terms
npm run check:synonyms

# Check specific term
npm run check:synonyms illustration
```

This identifies:
- Missing synonym matches
- Concepts that should match query terms
- Synonyms that need expansion

### 3. Tagging Quality Audits

When users report ranking issues:

```bash
# Check specific concept
npm run check:tagging 3d
npm run check:tagging illustration-led
```

This finds:
- Images with high zero-shot similarity but missing tags
- Potential false negatives (should be tagged but aren't)
- Images that rank outside top 20 despite high similarity

## Common Issues & Solutions

### Issue: Query term doesn't match concept

**Symptoms:**
- Search returns `directHitsCount: 0` for tagged images
- Tagged images rank low despite having relevant tags

**Solution:**
1. Check coverage: `npm run check:synonyms <term>`
2. Add missing synonym to `src/concepts/seed_concepts.json`
3. Re-seed: `npm run seed:concepts -- --only="<category>"`
4. Verify: `npm run check:synonyms <term>`

**Example:**
```bash
# Problem: "illustration" doesn't match
npm run check:synonyms illustration
# Result: Should match "illustration-led" but doesn't

# Fix: Add "illustration" to illustration-led synonyms
# Then re-seed and verify
```

### Issue: Images should be tagged but aren't

**Symptoms:**
- Images have high zero-shot similarity but no tags
- Users report sites should rank for queries but don't

**Solution:**
1. Check tagging quality: `npm run check:tagging <concept-id>`
2. Review images with high scores but no tags
3. Manually add tags for clear cases (see below)
4. Adjust `TAG_CONFIG` if many images affected

**Example:**
```bash
# Check 3D tagging
npm run check:tagging 3d
# Result: Shows 23 images with high 3D scores but no tags

# Review top candidates and manually tag if needed
```

### Issue: Tagged images rank lower than expected

**Symptoms:**
- Images have tags and `directHitsCount > 0` but still rank low
- Other images without tags rank higher

**Solution:**
1. Verify search weighting (should be 80% tags, 20% base)
2. Check if images have opposite tags (penalty applied)
3. Review tag scores vs. zero-shot scores
4. Ensure query terms match via synonyms

**Debug:**
```bash
# Test specific query
curl "http://localhost:3002/api/search?q=illustration" | jq '.images[0:5]'

# Check direct hits
curl "http://localhost:3002/api/search?q=illustration" | jq '.images[] | select(.directHitsCount > 0)'
```

## Manual Tag Addition

When images should be tagged but aren't (ranked outside top 20):

### Quick Script

```typescript
// scripts/add_tag_manual.ts
import { prisma } from '../src/lib/prisma';
import { embedImageFromBuffer } from '../src/lib/embeddings';
import 'dotenv/config';

const siteUrl = 'https://example.com';
const conceptId = '3d';

// Find site and image
const site = await prisma.site.findFirst({
  where: { url: { contains: siteUrl } },
  include: { images: true },
});

const image = site?.images[0];
const concept = await prisma.concept.findFirst({
  where: { id: conceptId },
});

// Compute score
const res = await fetch(image.url);
const buf = Buffer.from(await res.arrayBuffer());
const { vector } = await embedImageFromBuffer(buf);
const cos = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
const score = cos(vector, concept.embedding as unknown as number[]);

// Add tag
await prisma.imageTag.upsert({
  where: {
    imageId_conceptId: {
      imageId: image.id,
      conceptId: concept.id,
    },
  },
  update: { score },
  create: {
    imageId: image.id,
    conceptId: concept.id,
    score,
  },
});
```

## Maintenance Checklist

### Weekly
- [ ] Run `npm run validate:search` to check overall quality
- [ ] Review failed test cases
- [ ] Check user-reported ranking issues

### Monthly
- [ ] Run `npm run check:synonyms` to check common terms
- [ ] Review synonym coverage gaps
- [ ] Expand synonyms for concepts with missing matches

### Quarterly
- [ ] Run `npm run check:tagging` for all major concepts
- [ ] Review images that should be tagged but aren't
- [ ] Manually tag clear cases
- [ ] Adjust `TAG_CONFIG` if needed

## Related Documentation

- [Synonym Expansion Guide](./SYNONYM_EXPANSION_GUIDE.md) - Detailed guide on expanding synonyms
- [Tagging Configuration](../src/lib/tagging-config.ts) - Tagging thresholds and limits
- [Search Ranking Logic](../src/app/api/search/route.ts) - How search ranking works

