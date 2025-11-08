# Synonym Expansion Guide

## Overview

This guide explains how to expand concept synonyms to prevent search ranking issues. When users search for terms that should match concepts but aren't in the synonyms list, those images won't get direct hits and may rank lower.

## When to Expand Synonyms

Expand synonyms when:

1. **Search quality validation fails** - `validate_search_quality.ts` shows a query has low direct hits
2. **Users report ranking issues** - Specific sites don't rank for expected queries
3. **Synonym coverage check finds gaps** - `check_synonym_coverage.ts` identifies missing matches
4. **Common query terms don't match** - Terms like "illustration", "3d", "color" should match concepts

## How to Expand Synonyms

### 1. Identify the Gap

Run the synonym coverage checker:

```bash
npx tsx scripts/check_synonym_coverage.ts illustration
```

This will show:
- Whether "illustration" matches any concepts
- Which concepts it SHOULD match (based on semantic similarity)
- Current synonyms for those concepts

### 2. Add Synonyms

Edit `src/concepts/seed_concepts.json` and add the missing term to the `synonyms` array:

```json
{
  "id": "illustration-led",
  "label": "Illustration-Led",
  "synonyms": [
    "illustration",        // ← Add missing terms here
    "illustrations",
    "illustration-driven",
    ...
  ]
}
```

### 3. Re-seed Concepts

Re-seed the concept to update the database:

```bash
# Re-seed all concepts
npx tsx src/concepts/seed.ts

# Or re-seed specific category
npx tsx src/concepts/seed.ts --only="Style/Aesthetic"
```

### 4. Verify

Check that the synonym now matches:

```bash
npx tsx scripts/check_synonym_coverage.ts illustration
```

You should see:
```
✅ illustration-led (Illustration-Led)
   Matched by: synonym
```

## Common Synonym Patterns

### Plural Forms
- `illustration` → `illustrations`
- `animation` → `animations`
- `color` → `colors`, `colour` → `colours`

### Hyphenated/Spaced Variants
- `illustration-led` → `illustration led`
- `3d` → `3-d`, `three-dimensional`, `three dimensional`
- `grid-based` → `grid based`, `grid`

### Common Abbreviations
- `3d` → `3D`, `3-d`, `three-dimensional`, `three-dimensional-modeling`
- `ecommerce` → `e-commerce`, `online store`, `shop`
- `saas` → `SaaS`, `software-as-a-service`

### Related Terms
- `illustration-led` → `illustrations`, `drawings`, `artwork`, `illustrated`
- `colorful` → `color`, `colors`, `coloured`, `colourful`, `multicolor`
- `minimalistic` → `minimal`, `clean`, `simple`, `minimalist`

## Best Practices

1. **Include base terms** - Always include the base singular/plural forms
2. **Include common variations** - Add hyphenated, spaced, and abbreviated forms
3. **Test before committing** - Run `check_synonym_coverage.ts` to verify matches
4. **Re-seed after changes** - Always re-seed concepts after updating synonyms
5. **Document additions** - Consider adding comments in the JSON for complex cases

## Automated Checks

### Before Committing

Run these checks to catch issues early:

```bash
# 1. Check synonym coverage for common terms
npx tsx scripts/check_synonym_coverage.ts

# 2. Validate search quality
npx tsx scripts/validate_search_quality.ts

# 3. Check tagging quality for specific concepts
npx tsx scripts/check_tagging_quality.ts 3d
```

### In CI/CD

Add these checks to your CI pipeline to prevent regression:

```yaml
- name: Validate Search Quality
  run: npx tsx scripts/validate_search_quality.ts

- name: Check Synonym Coverage
  run: npx tsx scripts/check_synonym_coverage.ts
```

## Example: Fixing "illustration" Search

**Problem:** Users search for "illustration" but `ponpon-mania.com` ranks low despite having illustration-led tag.

**Solution:**

1. Check coverage:
   ```bash
   npx tsx scripts/check_synonym_coverage.ts illustration
   ```
   Result: "illustration" doesn't match "illustration-led" concept

2. Add synonym:
   ```json
   {
     "id": "illustration-led",
     "synonyms": [
       "illustration",  // ← Add this
       "illustrations",
       ...
     ]
   }
   ```

3. Re-seed:
   ```bash
   npx tsx src/concepts/seed.ts --only="Style/Aesthetic"
   ```

4. Verify:
   ```bash
   npx tsx scripts/check_synonym_coverage.ts illustration
   ```
   Result: ✅ Now matches!

5. Test search:
   ```bash
   curl "http://localhost:3002/api/search?q=illustration" | jq '.images[0:5]'
   ```
   Result: `ponpon-mania.com` now has `directHitsCount: 1` and ranks higher

## Related Scripts

- `scripts/check_synonym_coverage.ts` - Check if query terms match concepts
- `scripts/check_tagging_quality.ts` - Find images that should be tagged but aren't
- `scripts/validate_search_quality.ts` - Test search queries and verify ranking
- `src/concepts/seed.ts` - Re-seed concepts after synonym updates

