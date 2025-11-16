# Learned Reranker Plan

## Overview

Replace the current hand-crafted ranking formula with a small learned model that adapts to user behavior (clicks, saves, favorites). This reranker would learn from actual user interactions to improve search relevance.

## Current State

**Current ranking approach:**
- Primary: CLIP cosine similarity between query and image embeddings
- Light reranking: Hand-tuned boosts/penalties based on tag matches
  - Matching concept tags: +5% boost (0.05 * tagScore)
  - Opposite concept tags: -3% penalty (0.03 * tagScore)

**Limitations:**
- Fixed coefficients don't adapt to user preferences
- No learning from user behavior
- Can't distinguish between "actual 3D renders" vs "shadowy photos" for "3d" queries
- Can't learn contextual preferences (e.g., "love" → people + warm colors + intimacy)

## Proposed Solution

### Architecture

**Input Features:**

1. **Query embedding** (768-dim CLIP vector)
2. **Image embedding** (768-dim CLIP vector)
3. **Handcrafted interaction features** (explicit interactions help tiny MLP converge faster):
   - `cosine(queryEmb, imageEmb)` - Current baseScore (primary signal)
   - `cosine(queryEmb, imageEmb)^2` - Helps with non-linearities
   - **Dominant tag features:**
     - `max(tagScore)` - Maximum tag score among matched concepts
     - `sum(tagScores)` - Sum of tag scores among matched concepts
     - `count(directMatches)` - Number of direct concept matches
     - `count(synonymMatches)` - Number of synonym matches
     - `count(relatedMatches)` - Number of related matches
   - **Opposite concept features:**
     - `max(oppositeTagScore)` - Maximum opposite tag score
     - `sum(oppositeTagScores)` - Sum of opposite tag scores
   - **Position feature** (for training, helps with position bias):
     - `1 / rank` or `normalized_rank` - Position in results

**Why explicit interaction features?**
- Helps the model converge faster
- Reduces need to "reinvent" cosine similarity in weights
- Makes it easier for the model to learn patterns like "for 3D queries, tags matter a lot"

**Output:**
- Scalar relevance score (0-1 or unbounded, depending on loss function)

**Model Architecture: Small MLP (Recommended)**

Start with a small MLP that can learn interactions between query embeddings, image embeddings, and tag signals. Linear models struggle with these interactions, and FM adds unnecessary complexity for now.

```python
Input: [queryEmb, imageEmb, handcraftedFeatures]  # 1536 + features dims
  ↓
Dense(256) + ReLU/GELU
  ↓
Dense(64) + ReLU/GELU
  ↓
Dense(1)  # Output: relevance score
```

**Architecture details:**
- **Input size**: 1536 (768 query + 768 image) + handcrafted features
- **Hidden layers**: 1-2 layers (256 → 64 recommended)
- **Activation**: ReLU or GELU
- **Dropout**: Very low (0.1) or none
- **Model size**: <100KB, small enough to ship anywhere

**Why MLP over alternatives:**
- **Linear**: Can't capture interactions between query/image/tag features
- **FM**: Adds complexity not needed yet
- **MLP**: Expressive enough to learn query-specific patterns (e.g., "3d" → tags matter a lot, "love" → faces + warm colors matter)

### Training Data

**Data Collection:**
1. **Implicit signals:**
   - Click-through rate (CTR): user clicks on result
   - Dwell time: time spent viewing result
   - Save/favorite: explicit positive signal
   - Skip/back: implicit negative signal

2. **Data structure:**
```typescript
interface TrainingExample {
  query: string
  queryEmbedding: number[]  // CLIP embedding used
  imageId: string
  imageEmbedding: number[]  // CLIP embedding
  handcraftedFeatures: {
    cosineSimilarity: number
    cosineSimilaritySquared: number
    maxTagScore: number
    sumTagScores: number
    directMatchCount: number
    synonymMatchCount: number
    relatedMatchCount: number
    maxOppositeTagScore: number
    sumOppositeTagScores: number
    position: number  // Rank position when shown
  }
  label: {
    clicked: boolean
    saved: boolean
    dwellTime: number  // seconds
    position: number   // Rank position when shown
  }
  timestamp: Date
}
```

**Important: Log everything at query time:**
- Query text
- Query embedding used
- List of candidate imageIds + their features at the time
- User actions: clicked, saved, time-on-result
- Rank positions

Even if you don't use all of it at first, future you will be very happy this is there.

3. **Label generation:**
   - **Positive examples**: clicked + (dwellTime > 3s OR saved)
   - **Negative examples**: shown but not clicked, or clicked but immediately back
   - **Position bias handling**: 
     - Only use impressions in top N (e.g., top 10) for training
     - Treat "clicked vs not clicked in that top N" as main signal
     - Results beyond rank 10 treated as weak/no signal

### Training Process

**Loss Function: Pairwise Ranking Loss (Recommended)**

Instead of predicting "relevance score" as regression/classification, use **pairwise ranking loss**:

For a given query, if image A was clicked and image B was shown but not clicked, train the model so:
- `score(q, A) > score(q, B)`

**Implementation:**
- Simple pairwise hinge loss or logistic pairwise loss
- Directly optimizes ranking behavior
- Less sensitive to interaction-scale issues
- Can still combine signals (click, dwell, save) into positive vs negative selection

**Negative Sampling:**

Don't train only on positives; for every query, you need negatives:

1. **Natural negatives**: Shown-but-not-clicked results
2. **Additional negatives** (for queries with few clicks):
   - Random images in top 100 that weren't shown
   - Random images overall (with low probability)

**Training loop:**
1. Collect user interaction data (minimum ~1000 examples)
2. Extract features for each query-image pair
3. Generate training pairs: (positive, negative) for each query
4. Train model with pairwise loss
5. Evaluate on held-out test set using:
   - **NDCG@K** (Normalized Discounted Cumulative Gain)
   - **MRR** (Mean Reciprocal Rank)
   - **Precision@K** (for "clicks happened")
6. Only deploy if it beats current hand-tuned ranking on validation set

**Incremental learning:**
- Retrain weekly/monthly with new interaction data
- Use exponential moving average to adapt to changing preferences

### Implementation Plan

#### Phase 1: Data Collection (Week 1-2)
- [ ] Add interaction tracking to search API
  - Log query text
  - Log query embedding used
  - Log list of candidate imageIds + their features at the time
  - Log user actions: clicked, saved, time-on-result
  - Log rank positions
- [ ] Add click tracking to frontend
  - Track clicks on search results
  - Track dwell time (time until next action)
- [ ] Add save/favorite functionality (if not exists)
- [ ] Create `UserInteraction` table in database

**Important**: Log everything at query time, even if you don't use it all initially. Future you will be very happy this is there.

**Schema:**
```prisma
model UserInteraction {
  id        String   @id @default(cuid())
  query     String
  imageId   String
  position  Int      // Rank position when shown
  clicked   Boolean  @default(false)
  saved     Boolean  @default(false)
  dwellTime Int?     // Milliseconds
  timestamp DateTime @default(now())
  
  image     Image    @relation(fields: [imageId], references: [id])
  
  @@index([query, imageId])
  @@index([timestamp])
  @@map("user_interactions")
}
```

#### Phase 2: Feature Extraction (Week 2-3)
- [ ] Create feature extraction function
  - Extract query embedding (CLIP)
  - Extract image embedding (CLIP)
  - Extract tag features (matches, scores, opposites)
- [ ] Create training data export script
  - Export examples with features and labels
- [ ] Validate feature quality

#### Phase 3: Model Training (Week 3-4)
- [ ] Implement training script in Python (offline)
  - Load data from SQLite
  - Build training triples (query, image, label) or pairs (positive, negative)
  - Train 2-layer MLP with pairwise ranking loss
  - Evaluate on held-out queries using:
    - NDCG@K
    - MRR
    - Precision@K
- [ ] Compare against current hand-tuned ranking
- [ ] Only proceed if learned model beats baseline on validation set
- [ ] Export model to ONNX format

#### Phase 4: Integration (Week 4-5)
- [ ] Add Node/TypeScript helper:
  - Loads ONNX model
  - Given q_emb, img_emb, features, returns rerankScore
- [ ] Start with "shadow" mode:
  - Compute both old score and learned model score
  - Use old score for actual ranking
  - Log both for comparison
- [ ] Once confident, either:
  - Switch fully to learned model, or
  - Blend: `finalScore = alpha * oldScore + (1-alpha) * learnedScore`
- [ ] A/B test: compare learned vs hand-crafted
- [ ] Monitor performance metrics

#### Phase 5: Continuous Learning (Ongoing)
- [ ] Set up retraining pipeline (weekly/monthly)
- [ ] Monitor model performance
- [ ] Collect feedback and iterate

### Model Serving

**Recommended: ONNX Runtime**

For a TypeScript/Node stack, ONNX Runtime is the sweet spot:

- **Train in Python** (PyTorch/Keras) - more training flexibility
- **Export to ONNX** - standard format
- **Load ONNX in Node** - run inference efficiently
- **Easy experimentation** - can change frameworks without changing serving code

**Why ONNX over alternatives:**
- **TensorFlow.js**: Fine, but ONNX gives more training flexibility
- **Python microservice**: Overkill until:
  - Model size grows significantly
  - You want heavier inference
  - You need advanced monitoring

For the small MLP (~100KB), just embed it into your existing API layer.

**Inference flow:**
```typescript
async function rerankWithModel(
  queryEmbedding: number[],
  candidates: Array<{
    imageId: string
    imageEmbedding: number[]
    tagFeatures: TagFeatures
    baseScore: number  // CLIP cosine similarity
  }>
): Promise<Array<{ imageId: string; relevanceScore: number }>> {
  // Extract features for each candidate
  const features = candidates.map(c => [
    ...queryEmbedding,
    ...c.imageEmbedding,
    ...extractTagFeatures(c.tagFeatures)
  ])
  
  // Run model inference
  const scores = await model.predict(features)
  
  // Return reranked results
  return candidates
    .map((c, i) => ({
      imageId: c.imageId,
      relevanceScore: scores[i]
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
}
```

### Benefits

1. **Adaptive**: Learns from actual user behavior
2. **Context-aware**: Can learn query-specific preferences
   - **"3d" queries**: Results where `tagScore(3D)` is high, `tagScore(flat)` is low, and image embedding is similar to 3D prototypes get clicked more → model pushes those up and shadowy 2D stuff down
   - **"love" queries**: Images with faces, warm palettes, intimacy-like compositions get more engagement → model favors those patterns over random hearts or unrelated red UIs that CLIP initially thought were "love"
   - **"fun" queries**: Learns what "fun" actually means to your users
3. **Automatic optimization**: No hand-tuning coefficients
4. **Scalable**: Improves as more data is collected
5. **Maintainable**: Single model replaces complex ranking logic
6. **User semantics**: Teaches the system your users' visual semantics, not just CLIP's

### Challenges & Solutions

**Challenge 1: Cold start (no training data)**
- **Solution**: Start with hand-crafted ranking, collect data, then switch
- **Alternative**: Use CLIP similarity as initial model (fine-tune from there)

**Challenge 2: Data sparsity**
- **Solution**: Use transfer learning (pre-train on synthetic data)
- **Alternative**: Start with linear model, upgrade to MLP when enough data

**Challenge 3: Position bias**
- **Solution**: Weight examples by inverse position (lower position clicks weighted more)
- **Alternative**: Use click models that account for position bias

**Challenge 4: Model size/performance**
- **Solution**: Keep model small (<100KB), use efficient inference
- **Alternative**: Cache embeddings, only run model on top K candidates

### Metrics

**Training metrics:**
- Accuracy: % of correct click predictions
- AUC-ROC: Ranking quality
- NDCG@10: Normalized discounted cumulative gain

**Production metrics:**
- CTR improvement vs baseline
- User satisfaction (if available)
- Search quality (manual evaluation)

### Future Enhancements

1. **Query embeddings**: Learn query-specific embeddings (fine-tune CLIP)
2. **User personalization**: Include user embedding in features
3. **Multi-task learning**: Predict clicks, saves, dwell time simultaneously
4. **Explainability**: Add attention weights to understand what model focuses on
5. **A/B testing framework**: Easy to test new models

---

## Quick Start (Concrete Next Steps)

### Step 1: Add UserInteraction Table + Logging (Phase 1)

```bash
# Add to prisma/schema.prisma
# Run migration
npx prisma migrate dev --name add_user_interactions
```

### Step 2: Create Training Script (Python)

```python
# scripts/train_reranker.py
# - Loads data from SQLite
# - Builds training triples (query, image, label) or pairs (positive, negative)
# - Trains 2-layer MLP with pairwise ranking loss
# - Exports to ONNX
```

### Step 3: Add Node/TypeScript Helper

```typescript
// src/lib/reranker.ts
// - Loads ONNX model
// - Given q_emb, img_emb, features, returns rerankScore
```

### Step 4: Integrate into Search

```typescript
// src/app/api/search/route.ts
// - Extract handcrafted features
// - Run reranker inference
// - Use in shadow mode initially
```

---

## References

- **Learning to Rank**: https://en.wikipedia.org/wiki/Learning_to_rank
- **RankNet**: Burges et al., "Learning to Rank Using Gradient Descent" (2005)
- **LambdaRank**: Burges, "From RankNet to LambdaRank to LambdaMART" (2010)
- **TensorFlow.js**: https://www.tensorflow.org/js
- **ONNX Runtime**: https://onnxruntime.ai/

