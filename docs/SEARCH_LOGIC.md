# Search Query Logic Documentation

This document explains how the search system ranks images based on query terms, tag matches, and opposite penalties.

## Table of Contents
1. [Tag Matching Weights](#tag-matching-weights)
2. [Multi-Term Query Logic](#multi-term-query-logic)
3. [Opposite Tag Penalties](#opposite-tag-penalties)
4. [Ranking Priority](#ranking-priority)
5. [Examples](#examples)

---

## Tag Matching Weights

When a query matches concepts in an image's tags, different match types receive different weights:

| Match Type | Weight | Description |
|------------|--------|-------------|
| **Direct Match** | 1.0x (100%) | Query term exactly matches the concept's label or ID |
| **Synonym Match** | 0.9x (90%) | Query term matches a synonym of the concept, or image tag is a synonym of the matched concept |
| **Related Match** | 0.1x (10%) | Image tag is related to (but not a synonym of) the matched concept |

### How Matching Works

1. **Concept Matching**: Query terms are matched against concepts by:
   - Exact label match
   - Exact ID match
   - Synonym match (bidirectional)
   - If query "vibrant" and concept "colorful" has "vibrant" as a synonym, "colorful" is included

2. **Image Tag Matching**: For each matched concept, check if the image has:
   - Direct tag (exact concept ID match) → 1.0x weight
   - Synonym tag (image tag is a synonym of matched concept) → 0.9x weight
   - Related tag (image tag is related to matched concept) → 0.1x weight

### Example
- **Query**: "colorful"
- **Image A**: Tagged with "colorful" (direct) → 1.0x weight
- **Image B**: Tagged with "vibrant" (synonym of "colorful") → 0.9x weight
- **Image C**: Tagged with "neon" (related to "colorful") → 0.1x weight

---

## Multi-Term Query Logic

When searching for multiple terms (e.g., "modern minimal"), the system uses **AND logic** with completeness-based penalties.

### Completeness Calculation

```typescript
matchedConceptCount = number of concepts matched by query terms
imageMatchedConceptCount = number of matched concepts that image has tags for (direct or synonym)
completeness = imageMatchedConceptCount / matchedConceptCount
```

### Penalty Application

The combined tag score is penalized based on completeness:

```typescript
weightedComponent = allMatchesSum * Math.max(0.4, completeness)
```

**Penalty Examples:**
- **2/2 matches** (completeness = 1.0): No penalty, full score
- **1/2 matches** (completeness = 0.5): 50% penalty → 50% of combined score
- **0/2 matches** (completeness = 0.0): 60% penalty → 40% of combined score (minimum)

### Example: "modern minimal"

| Image Tags | Matched Concepts | Completeness | Penalty | Result |
|------------|------------------|--------------|---------|--------|
| "modern" + "minimal" | 2/2 | 1.0 | None | Full score |
| "modern" only | 1/2 | 0.5 | 50% | 50% of score |
| "minimal" only | 1/2 | 0.5 | 50% | 50% of score |
| Neither | 0/2 | 0.0 | 60% | 40% of score (min) |

**Note**: Synonym matches count toward `imageMatchedConceptCount`, so an image tagged with "contemporary" (synonym of "modern") and "minimal" would still count as 2/2 matches.

---

## Opposite Tag Penalties

When an image has tags that are **opposites** of the query concepts, penalties are applied. The penalty strength varies based on:
1. Whether the image has direct/synonym matches
2. The strength of the opposite tag
3. The distance between opposite and matching tag scores

### Penalty Calculation Components

#### 1. Opposite Strength
Normalizes the opposite tag score (0.15-0.30 range) to 0-1:
```typescript
oppositeStrength = (maxOppositeScore - 0.15) / (0.30 - 0.15)
```

#### 2. Distance Factor
Measures how close the opposite tag score is to the matching tag score:
```typescript
distance = |maxDirectScore - maxOppositeScore|
distanceFactor = 1.0 - (Math.min(distance, 0.15) / 0.15) * 0.7
// Range: 1.0 (very close) to 0.3 (far apart)
```
**Closer tags = larger penalty** (indicates conflicting signals)

#### 3. Surpass Bonus
Extra penalty if opposite tag is stronger than matching tag:
```typescript
surpassBonus = maxOppositeScore > maxDirectScore ? 0.05 : 0
```

### Penalty Scenarios

#### Scenario 1: Image Has Direct/Synonym Matches + Opposites

**Penalty Formula:**
```typescript
penaltyPercent = Math.min(0.15, (
  oppositeStrength * 0.08 + 
  distanceFactor * 0.05 + 
  surpassBonus * 0.02
))
// Maximum: 15% penalty
```

**Application:**
```typescript
tagScorePenalized = tagScore * (1.0 - penaltyPercent)
score = tagScorePenalized + baseScore * 0.10
```

**Example:**
- Query: "modern"
- Image: Tagged with "modern" (score: 0.25) and "vintage" (opposite, score: 0.20)
- `oppositeStrength` = (0.20 - 0.15) / 0.15 = 0.33
- `distance` = |0.25 - 0.20| = 0.05
- `distanceFactor` = 1.0 - (0.05 / 0.15) * 0.7 = 0.77
- `penaltyPercent` = min(0.15, 0.33*0.08 + 0.77*0.05 + 0*0.02) = min(0.15, 0.07) = **7% penalty**

#### Scenario 2: Image Has Only Related Matches + Opposites

**Penalty Formula:**
```typescript
penaltyPercent = Math.min(0.30, (
  oppositeStrength * 0.15 + 
  distanceFactor * 0.10 + 
  surpassBonus * 0.05
))
// Maximum: 30% penalty
```

**Application:**
```typescript
score *= (1.0 - penaltyPercent)
```

**Example:**
- Query: "modern"
- Image: Tagged with "contemporary" (related, score: 0.18) and "vintage" (opposite, score: 0.22)
- `oppositeStrength` = (0.22 - 0.15) / 0.15 = 0.47
- `distance` = |0.18 - 0.22| = 0.04
- `distanceFactor` = 1.0 - (0.04 / 0.15) * 0.7 = 0.81
- `surpassBonus` = 0.05 (opposite > related)
- `penaltyPercent` = min(0.30, 0.47*0.15 + 0.81*0.10 + 0.05*0.05) = min(0.30, 0.18) = **18% penalty**

#### Scenario 3: Image Has No Direct/Related Matches + Opposites

**Penalty Formula:**
```typescript
oppositeStrength = (maxOppositeScore - 0.15) / (0.30 - 0.15)
penaltyPercent = 0.40 + (oppositeStrength * 0.15)
// Range: 40% to 55% penalty
```

**Application:**
```typescript
score = baseScore * (1.0 - penaltyPercent) * 0.05
```

**Example:**
- Query: "modern"
- Image: Tagged with "vintage" (opposite, score: 0.25) only
- `oppositeStrength` = (0.25 - 0.15) / 0.15 = 0.67
- `penaltyPercent` = 0.40 + (0.67 * 0.15) = **50% penalty**
- Final score = baseScore * 0.50 * 0.05 = **2.5% of base score**

### Summary: Opposite Penalty Ranges

| Scenario | Max Penalty | Typical Range |
|----------|-------------|---------------|
| Has direct/synonym matches | 15% | 5-15% |
| Has only related matches | 30% | 10-30% |
| No matches | 55% | 40-55% |

**Key Principle**: The stronger the matching tags, the smaller the opposite penalty (to ensure direct matches still rank high).

---

## Ranking Priority

Images are sorted by the following priority (in order):

1. **Full Matches First**: Images matching ALL query terms rank above partial matches
   ```typescript
   if (a.hasAllMatches && !b.hasAllMatches) return -1
   ```

2. **More Direct Hits**: Images with more matched concepts rank higher
   ```typescript
   if (a.directHitsCount !== b.directHitsCount) {
     return b.directHitsCount - a.directHitsCount
   }
   ```

3. **Final Score**: When direct hits are equal, sort by final weighted score
   ```typescript
   if (Math.abs(a.score - b.score) > 0.01) {
     return b.score - a.score
   }
   ```

4. **Base Cosine Similarity**: Tiebreaker if final scores are very close (< 0.01 difference)
   ```typescript
   if (Math.abs(a.baseScore - b.baseScore) > 0.0001) {
     return b.baseScore - a.baseScore
   }
   ```

5. **No Opposite Tags**: Images without opposite tags rank above those with opposites (minor tiebreaker)
   ```typescript
   if (a.hasOppositeTags && !b.hasOppositeTags) return 1
   ```

---

## Examples

### Example 1: Single Term Query
**Query**: "colorful"

| Image | Tags | Match Type | Weight | Opposite? | Final Score |
|-------|------|------------|--------|-----------|-------------|
| A | "colorful" (0.25) | Direct | 1.0x | No | **High** |
| B | "vibrant" (0.23) | Synonym | 0.9x | No | **High** (slightly lower) |
| C | "neon" (0.20) | Related | 0.1x | No | **Medium** |
| D | "colorful" (0.25) + "monochrome" (0.22) | Direct | 1.0x | Yes (7% penalty) | **High** (slightly penalized) |
| E | "monochrome" (0.22) | None | - | Yes (50% penalty) | **Very Low** |

### Example 2: Multi-Term Query
**Query**: "modern minimal"

| Image | Tags | Matched | Completeness | Penalty | Final Score |
|-------|------|---------|-------------|---------|-------------|
| A | "modern" + "minimal" | 2/2 | 1.0 | None | **Highest** |
| B | "modern" + "simple" (synonym) | 2/2 | 1.0 | None | **Highest** |
| C | "modern" only | 1/2 | 0.5 | 50% | **Medium** |
| D | "minimal" only | 1/2 | 0.5 | 50% | **Medium** |
| E | "modern" + "vintage" (opposite) | 1/2 | 0.5 | 50% + 7% opposite | **Lower** |
| F | Neither | 0/2 | 0.0 | 60% | **Lowest** |

### Example 3: Opposite Penalty Progression
**Query**: "modern"

| Image | Tags | Match | Opposite | Penalty | Score Impact |
|-------|------|-------|----------|---------|-------------|
| A | "modern" (0.25) | Direct | None | 0% | Full score |
| B | "modern" (0.25) + "vintage" (0.20) | Direct | Weak | 7% | 93% of full |
| C | "modern" (0.25) + "vintage" (0.24) | Direct | Strong, close | 12% | 88% of full |
| D | "contemporary" (0.18) + "vintage" (0.22) | Related | Strong, surpass | 18% | 82% of related |
| E | "vintage" (0.25) only | None | Strong | 50% | 2.5% of base |

---

## Constants Reference

```typescript
DIRECT_MULTIPLIER = 10        // Direct tags multiplier
SYNONYM_WEIGHT = 0.9          // Synonyms are 90% of direct
RELATED_WEIGHT = 0.1           // Related terms are 10% of direct
ZERO_WITH_DIRECT = 0.10       // Base cosine contributes 10% when direct tags exist
ZERO_WITH_RELATED = 0.10      // Base cosine contributes 10% with only related
ZERO_NO_DIRECT = 0.05         // Base cosine contributes 5% when no direct tags
RELATED_MIN = 0.20            // Minimum related tag score to count
```

---

## Implementation Notes

- **Bidirectional Synonym Matching**: If query "vibrant" and concept "colorful" has "vibrant" as a synonym, "colorful" is included in matched concepts
- **Synonym Tag Matching**: If query "colorful" and image has tag "vibrant" (synonym of "colorful"), it's treated as a synonym match (0.9x weight)
- **Opposite Detection**: Uses `hasOppositeTags()` function from `concept-opposites.ts` to check for opposite relationships
- **Minimum Score**: Partial matches are guaranteed at least 40% of their combined score (prevents complete elimination)
- **Opposite Penalty Cap**: Maximum 15% penalty when direct matches exist (ensures direct matches still rank high)

