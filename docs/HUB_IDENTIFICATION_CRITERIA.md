# Hub Identification Criteria

## Overview

Hub images are identified by counting how frequently each image appears in the **top N results** across many different test queries. Images that appear frequently across diverse queries are considered "hubs" - they dominate search results even when they're not the most relevant.

## Algorithm

### Step 1: Build Test Queries
- **1,486 concept labels** from your concept database (e.g., "3d", "dark", "minimal", "brutalist")
- **33 synthetic phrases** (e.g., "cozy ui", "fun website", "cinematic hero")
- **Total: 1,517 unique queries**

### Step 2: For Each Query
1. **Embed the query** using CLIP text encoder
2. **Compute cosine similarity** between query embedding and all image embeddings
3. **Sort by similarity** (descending)
4. **Take top N images** (default: N = 20)
5. **Increment counter** for each image in top N

### Step 3: Compute Hub Scores
For each image:
- **`hubCount`**: Number of queries where image appears in top N
- **`hubScore`**: Fraction of queries where image appears
  ```
  hubScore = hubCount / totalQueries
  ```

## Criteria

### Hub Score Interpretation

| Hub Score | Meaning | Example |
|-----------|---------|---------|
| **0.0 - 0.05** | Low hub (appears in <5% of queries) | Normal, query-specific results |
| **0.05 - 0.1** | Medium hub (appears in 5-10% of queries) | Somewhat over-exposed |
| **0.1 - 0.3** | High hub (appears in 10-30% of queries) | Frequently appears, likely a hub |
| **0.3 - 0.5** | Very high hub (appears in 30-50% of queries) | Strong hub, dominates many queries |
| **0.5+** | Extreme hub (appears in >50% of queries) | Major hub, appears in most queries |

### Current Top Hubs (from last run)

1. **der-baukasten.com**: `hubScore = 0.9209` (appears in 92% of queries!)
   - `hubCount = 1397` out of 1517 queries
   - This image appears in top 20 for almost every query

2. **smooothy.federic.ooo**: `hubScore = 0.8991` (appears in 90% of queries)
   - `hubCount = 1364` out of 1517 queries

3. **Hertzwerk**: `hubScore = 0.8299` (appears in 83% of queries)
   - `hubCount = 1259` out of 1517 queries

## Why Images Become Hubs

### Common Reasons:
1. **Generic/neutral design**: Images that are visually "average" match many queries
2. **High CLIP scores**: Some images have embeddings that are close to many query embeddings
3. **Common visual elements**: Images with common patterns (e.g., gradients, geometric shapes) match many queries
4. **Embedding space position**: Images positioned centrally in CLIP's embedding space match many queries

### Example Scenario:
- Query "dark" → Image A ranks #5
- Query "minimal" → Image A ranks #8
- Query "modern" → Image A ranks #12
- Query "bold" → Image A ranks #15
- ... (appears in 92% of all queries)

**Result**: Image A is a hub with `hubScore = 0.92`

## Detection Parameters

### Configurable Settings:
- **`topN`** (default: 20): How many top results to consider per query
  - Lower = stricter (only count top 10)
  - Higher = more lenient (count top 50)
  
- **Query set**: Which queries to test
  - Currently: All concept labels + synthetic phrases
  - Could be filtered to UI/website-specific queries only

### Current Settings:
```typescript
topN = 20  // Count images in top 20 results
totalQueries = 1517  // Test with 1517 different queries
```

## Hub Score Calculation

```typescript
// For each query:
1. Embed query → queryEmbedding
2. For each image:
   similarity = cosine(queryEmbedding, imageEmbedding)
3. Sort images by similarity (descending)
4. Take top 20 images
5. For each image in top 20:
   hubCount[imageId] += 1

// After all queries:
for each image:
  hubScore = hubCount / totalQueries
```

## Example Calculation

**Scenario**: Testing with 100 queries, topN = 20

- **Image A** appears in top 20 for:
  - "dark" (rank #5)
  - "minimal" (rank #8)
  - "modern" (rank #12)
  - "bold" (rank #15)
  - ... (total: 45 queries)
  
  **Result**: 
  - `hubCount = 45`
  - `hubScore = 45 / 100 = 0.45` (appears in 45% of queries)

- **Image B** appears in top 20 for:
  - "dark" (rank #3)
  - "minimal" (rank #18)
  - ... (total: 2 queries)
  
  **Result**:
  - `hubCount = 2`
  - `hubScore = 2 / 100 = 0.02` (appears in 2% of queries - not a hub)

## Thresholds Used in Ranking

### Hub Penalty Application:
- **Threshold**: `hubScore > 0.05` (5%)
- **Penalty**: `hubScore * 0.06` (max 6% penalty)
- **Only applies to**: Images with `hubScore > 0.05`

### Examples:
- `hubScore = 0.92` → Penalty = `0.92 * 0.06 = 0.0552` (5.52% reduction)
- `hubScore = 0.45` → Penalty = `0.45 * 0.06 = 0.027` (2.7% reduction)
- `hubScore = 0.02` → No penalty (below 5% threshold)

## Improving Hub Detection

### Potential Improvements:
1. **Filter queries**: Only use UI/website-relevant queries
2. **Weighted queries**: Give more weight to common user queries
3. **Query categories**: Detect hubs per category (e.g., "dark" queries vs "minimal" queries)
4. **Time-decay**: Weight recent queries more heavily
5. **Position weighting**: Count rank #1 more than rank #20

### Current Limitations:
- All queries weighted equally
- No distinction between common vs rare queries
- No position weighting (rank #1 = rank #20)
- Includes abstract concepts that may not be relevant to UI/website design

