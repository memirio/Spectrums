# Hub Detection System

## Overview

The hub detection system identifies images that appear disproportionately frequently in search results across diverse queries. These "hub" images can dominate search results even when they're not the most relevant, creating a "hub effect" that reduces search quality.

## How It Works

### 1. Statistical Detection

The system runs 1,517 test queries (concept labels + synthetic phrases) and tracks how often each image appears in the top 40 results.

**Statistical Threshold:**
- **Expected frequency (random)**: `topN / totalImages` ≈ 0.1923 (19.23%)
- **Hub threshold**: `expectedFrequency × thresholdMultiplier` (default: 1.5x = 28.85%)
- **Only images with `hubScore > threshold` are labeled as hubs**

This ensures only images that appear **more frequently than statistically expected** are considered hubs.

### 2. Metrics Calculated

For each hub image, the system calculates:

- **`hubCount`**: Number of queries where image appears in top N
- **`hubScore`**: Fraction of queries where image appears (`hubCount / totalQueries`)
- **`hubAvgCosineSimilarity`**: Average cosine similarity across all queries where image appears
- **`hubAvgCosineSimilarityMargin`**: Average margin above query average (how much higher than average)

### 3. Margin Calculation

For each query where a hub appears:
1. Calculate average cosine similarity of all top N images for that query
2. Calculate margin = hub's similarity - query average
3. Average all margins → `hubAvgCosineSimilarityMargin`

**Interpretation:**
- **Positive margin**: Hub scores above query average (needs penalty)
- **Negative margin**: Hub scores below query average (no penalty needed)

## Penalty System

### Percentage-Based Penalty (Applied to Cosine Similarity)

The search API applies a unique penalty to each hub as a **percentage-based multiplier** directly on the cosine similarity score (baseScore). This ensures images with high semantic similarity can still rank well even if they're hubs.

**Penalty Calculation:**

```typescript
if (hubScore > 0.05) {
  // Margin penalty: how much above query average
  marginPenalty = Math.max(0, avgCosineSimilarityMargin × marginPenaltyFactor)  // factor: 5.0
  
  // Frequency penalty: how often it appears
  // Reduced by 50% if margin is negative (performing below average)
  frequencyPenaltyMultiplier = avgCosineSimilarityMargin < 0 ? 0.5 : 1.0
  frequencyPenalty = hubScore × frequencyPenaltyFactor × frequencyPenaltyMultiplier  // factor: 0.10
  
  // Combined absolute penalty
  absolutePenalty = marginPenalty + frequencyPenalty
  
  // Convert to percentage of baseScore (capped at 20%)
  penaltyPercentage = Math.min(absolutePenalty / baseScore, 0.2)
  
  // Apply as multiplier to baseScore
  adjustedBaseScore = baseScore × (1.0 - penaltyPercentage)
}
```

**Key Points:**
- **Direct impact on cosine score**: Penalty is applied as a multiplier to baseScore, ensuring semantic relevance is preserved
- **Margin-based component**: Hubs that score above query averages get penalized more
- **Frequency-based component**: More frequently appearing hubs get heavier penalties
- **Negative margin reduction**: Hubs with negative margins (performing below average) get 50% reduction in frequency penalty
- **Percentage-based**: High semantic similarity (high baseScore) can still rank well even with penalty
- **Cap**: Maximum penalty is 20% of base score (multiplier = 0.8)

## Usage

### Running Hub Detection

```bash
# Basic usage (default: topN=40, threshold=1.5x)
npx tsx scripts/detect_hub_images.ts --clear

# Custom top N
npx tsx scripts/detect_hub_images.ts --clear --top-n=50

# Custom threshold multiplier (stricter = 2.0x, more lenient = 1.2x)
npx tsx scripts/detect_hub_images.ts --clear --threshold-multiplier=2.0
```

### Options

- `--clear`: Clear existing hub stats before recomputing
- `--top-n=<number>`: Number of top results to consider (default: 40)
- `--threshold-multiplier=<number>`: Multiplier for statistical threshold (default: 1.5)

### Testing Hub Penalty

```bash
# Test penalty effects for a query
npx tsx scripts/test_hub_penalty.ts --query="dark" --top-n=20

# Check negative margins
npx tsx scripts/check_negative_margins.ts

# Check image counts and hub distribution
npx tsx scripts/check_image_counts.ts
```

## Configuration

### Threshold Multiplier Guidelines

- **1.2x**: More lenient (23.1% threshold) - catches more potential hubs
- **1.5x**: Default (28.85% threshold) - balanced approach
- **2.0x**: Stricter (38.5% threshold) - only very dominant hubs

### Margin Penalty Factor

In `src/app/api/search/route.ts`, adjust `marginPenaltyFactor`:

```typescript
const marginPenaltyFactor = 2.0  // Adjust this to control penalty strength
```

- **Lower (1.0-1.5)**: Lighter penalties
- **Default (2.0)**: Balanced penalties
- **Higher (2.5-3.0)**: Stronger penalties

## Statistics

### Typical Results

With 208 images and default settings:
- **Total images**: 208
- **Images with embeddings**: 208 (100%)
- **Hubs identified**: ~48 (23%) - only statistically significant
- **Hubs with positive margins**: ~34 (16%) - actually penalized
- **Hubs with negative margins**: ~14 (7%) - appear frequently but score below average

### Hub Score Distribution

- **High hubs (≥0.1)**: Appear in ≥10% of queries
- **Medium hubs (0.05-0.1)**: Appear in 5-10% of queries
- **Low hubs (<0.05)**: Appear in <5% of queries

## Database Schema

```prisma
model Image {
  // Hub detection stats
  hubCount                    Int?    // Number of queries where image appears in top N
  hubScore                    Float?  // Fraction of queries where image appears
  hubAvgCosineSimilarity      Float?  // Average cosine similarity across queries
  hubAvgCosineSimilarityMargin Float?  // Average margin above query average
}
```

## Best Practices

1. **Run hub detection periodically** (e.g., weekly) as your dataset grows
2. **Monitor hub distribution** to ensure threshold is appropriate
3. **Adjust threshold multiplier** if too many/few hubs are detected
4. **Review negative margin hubs** - they appear frequently but score below average (may not need penalty)
5. **Test penalty effects** on problematic queries before deploying

## Troubleshooting

### Too Many Hubs Detected
- Increase `--threshold-multiplier` (e.g., 2.0 or 2.5)
- Reduces false positives

### Too Few Hubs Detected
- Decrease `--threshold-multiplier` (e.g., 1.2 or 1.3)
- Catches more potential hubs

### Penalty Too Strong/Weak
- Adjust `marginPenaltyFactor` in search API
- Lower = lighter penalties, Higher = stronger penalties

## Related Files

- `scripts/detect_hub_images.ts` - Main hub detection script
- `scripts/test_hub_penalty.ts` - Test penalty effects
- `scripts/check_negative_margins.ts` - Check negative margin hubs
- `scripts/check_image_counts.ts` - Check image statistics
- `src/app/api/search/route.ts` - Search API with hub penalty
- `docs/HUB_IDENTIFICATION_CRITERIA.md` - Detailed criteria documentation

