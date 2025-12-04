# Hub Image Detection and Ranking

## Overview

Hub images are images that appear frequently in top search results across many different queries, even when they're not the most relevant. This can create a "hub effect" where certain images dominate search results.

This system detects hub images and uses that information to:
1. **Penalize hub images in ranking** - Reduce their dominance in search results
2. **Train the learned reranker** - Help the model learn that high hub scores with low engagement indicate lower relevance

## How It Works

### 1. Hub Detection (`scripts/detect_hub_images.ts`)

The hub detection script:
- Loads all images with embeddings
- Builds test queries from:
  - All concept labels (e.g., "3d", "dark", "minimal", "brutalist")
  - Synthetic phrases (e.g., "cozy ui", "fun website", "cinematic hero")
- For each query:
  - Encodes the query using CLIP
  - Computes similarity with all images
  - Takes top N images (default: 20)
  - Increments a counter for each image
- Computes hub scores:
  - `hubCount`: Number of queries where image appears in top N
  - `hubScore`: Fraction of queries where image appears (hubCount / totalQueries)

### 2. Hub Penalty in Ranking

The search API applies a hub penalty to reduce hub image dominance:

```typescript
// Hub penalty formula
if (hubScore > 0.05) {
  hubPenalty = hubScore * 0.05  // Max 5% penalty
}
finalScore = baseScore + boost - penalty - popularityPenalty - hubPenalty
```

**Penalty conditions:**
- Only applies if `hubScore > 0.05` (appears in >5% of queries)
- Penalty scales with hub score (max 5% reduction)
- Small enough to nudge hubs down, not eliminate them

### 3. Hub Features for Learned Reranker

Hub features are included in logged impressions for training:

- `hubCount`: Raw count (number of queries)
- `hubScore`: Fraction (0-1)
- `logHubCount`: `log(1 + hubCount)` for normalization
- `normalizedHubScore`: `hubScore` capped at 1.0

The learned reranker can learn patterns like:
- "High hubScore + low engagement → lower relevance"
- "High hubScore + high engagement → keep it (it's genuinely relevant)"

## Usage

### Running Hub Detection

```bash
# First run (detect and save)
npx tsx scripts/detect_hub_images.ts

# Clear existing stats and recompute
npx tsx scripts/detect_hub_images.ts --clear

# Use different top N (default is 20)
npx tsx scripts/detect_hub_images.ts --top-n=10
```

### Output

The script outputs:
- Summary statistics (average, max hub scores)
- Top 10 hub images with their scores
- Distribution by hub score ranges

Example output:
```
🔝 Top 10 Hub Images:
Rank | Image ID                    | Hub Count | Hub Score
────────────────────────────────────────────────────────────
   1 | cmi29hjn300008od8m2ff7f4p    |        45 |    0.2344
   2 | cmi34eyck00018ofol4iep6c9    |        38 |    0.1979
   ...
```

### Scheduling Hub Detection

To keep hub stats fresh as your dataset and queries change, run the script periodically:

**Option 1: Cron job (Linux/Mac)**
```bash
# Add to crontab (runs weekly on Sunday at 2 AM)
0 2 * * 0 cd /path/to/Spectrums && npx tsx scripts/detect_hub_images.ts --clear
```

**Option 2: GitHub Actions (if using GitHub)**
```yaml
# .github/workflows/hub-detection.yml
name: Hub Detection
on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday
  workflow_dispatch:  # Manual trigger

jobs:
  detect-hubs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx tsx scripts/detect_hub_images.ts --clear
```

**Option 3: Manual periodic runs**
- Run weekly or monthly depending on how often your dataset changes
- More frequent if you're adding many new images/queries

## Integration with Learned Reranker

### Feature Vector

Hub features are automatically included in the feature vector for training:

```typescript
{
  // Existing features
  cosineSimilarity: number,
  cosineSimilaritySquared: number,
  maxTagScore: number,
  sumTagScores: number,
  // ... other tag features
  
  // Popularity features
  showCount: number,
  clickCount: number,
  ctr: number,
  
  // Hub features (NEW)
  hubCount: number | null,
  hubScore: number | null,
  logHubCount: number | null,
  normalizedHubScore: number | null,
}
```

### Training

When training the learned reranker:
1. Hub features are already in the logged impressions
2. The model learns patterns like:
   - High `hubScore` + low clicks → lower relevance
   - High `hubScore` + high clicks → keep it (genuinely relevant)
3. No special loss function needed - just ensure hub features are present

### Model Architecture

The learned reranker input size increases by 4 features:
- Original: `1536 (query + image embeddings) + tag features + popularity features`
- With hubs: `+ 4 hub features`

## Testing

### Test with Problematic Queries

Use queries where hub images kept appearing:

```bash
# Before hub penalty
curl "http://localhost:3000/api/search?q=dark"

# After hub penalty (should see hub images drop)
curl "http://localhost:3000/api/search?q=dark"
```

### Compare Rankings

1. **Without hub penalty**: Note which images appear in top results
2. **With hub penalty**: Check if:
   - Hub images drop in ranking
   - Genuinely relevant images stay high
   - Overall relevance improves

### Debug Hub Scores

Hub scores are included in search API responses (in debug mode or response metadata):

```json
{
  "imageId": "...",
  "score": 0.234,
  "baseScore": 0.245,
  "hubPenalty": 0.011,
  "hubScore": 0.22,
  "hubCount": 45
}
```

## Tuning

### Adjust Hub Penalty

In `src/app/api/search/route.ts`:

```typescript
// Current: hubScore * 0.05 (max 5% penalty)
hubPenalty = hubScore * 0.05

// More aggressive: hubScore * 0.1 (max 10% penalty)
hubPenalty = hubScore * 0.1

// Less aggressive: hubScore * 0.02 (max 2% penalty)
hubPenalty = hubScore * 0.02
```

### Adjust Hub Threshold

```typescript
// Current: only penalize if hubScore > 0.05
if (hubScore > 0.05) {
  hubPenalty = hubScore * 0.05
}

// More aggressive: penalize if hubScore > 0.02
if (hubScore > 0.02) {
  hubPenalty = hubScore * 0.05
}
```

### Adjust Top N for Detection

```bash
# Use top 10 instead of top 20
npx tsx scripts/detect_hub_images.ts --top-n=10
```

## Notes

- **CLIP stays frozen**: We don't retrain CLIP. The hub penalty is applied in the ranking layer.
- **Hub detection is offline**: Run periodically, not on every search query.
- **Hub features are optional**: If hub stats don't exist for an image, it's treated as hubScore = 0 (no penalty).
- **Combined with popularity penalty**: Hub penalty works alongside the popularity/ubiquity penalty (based on clicks) for a more nuanced ranking.

## Future Enhancements

1. **Query-specific hub scores**: Track hub scores per query category
2. **Time-decay**: Weight recent queries more heavily
3. **User-specific hubs**: Detect hubs per user (personalization)
4. **Adaptive penalty**: Learn optimal penalty factor from user feedback

