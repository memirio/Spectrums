# Performance Investigation System

## Overview

This document describes the comprehensive performance monitoring system that has been implemented to identify exactly what processes are taking time during page loads, filter additions, and searches.

## What Has Been Instrumented

### 1. API Routes

#### `/api/sites` Route
- **Total request time**: `api.sites.GET`
- **No concepts path**:
  - Query with category: `api.sites.GET.queryWithCategory` (LATERAL JOIN)
  - Query without category: `api.sites.GET.queryWithoutCategory` (findMany)
  - Image fetching: `api.sites.GET.fetchImages`
  - Response serialization: `api.sites.GET.serializeResponse`
- **With concepts path**:
  - Concept matching: `api.sites.GET.withConcepts.findConcepts`
  - Exact match lookup: `api.sites.GET.withConcepts.findExactMatches`
  - Sites query: `api.sites.GET.withConcepts.querySites`
  - Image fetching: `api.sites.GET.withConcepts.fetchImages`
  - Response serialization: `api.sites.GET.withConcepts.serializeResponse`

#### `/api/search` Route
- **Total request time**: `api.search.GET`
- **Zero-shot search path**:
  - Query analysis: `api.search.GET.zeroShot.analyzeQuery`
  - Vibe extension generation: `api.search.GET.zeroShot.generateVibeExtensions` (per category)
    - Groq API calls: `api.search.GET.zeroShot.generateVibeExtensions.{category}.groq`
    - Embedding generation: `api.search.GET.zeroShot.generateVibeExtensions.{category}.embed`
  - Query embedding: `api.search.GET.zeroShot.embedQuery`
  - pgvector query: `api.search.GET.zeroShot.pgvectorQuery`
  - Reranking: `api.search.GET.zeroShot.rerank`
    - Sorting: `api.search.GET.zeroShot.rerank.sort`
    - Score calculation: `api.search.GET.zeroShot.rerank.calculateScores`
    - Final sorting: `api.search.GET.zeroShot.rerank.finalSort`
    - Combining results: `api.search.GET.zeroShot.combineResults`
  - Response serialization: `api.search.GET.zeroShot.serializeResponse`
  - Result caching: `api.search.GET.zeroShot.cacheResults`

## How to Use

### Server-Side Logging

Performance metrics are automatically logged to the console for each API request. The logs include:

1. **Start/End markers**: Each operation logs when it starts and ends with duration
2. **Performance report**: At the end of each request, a formatted report is printed showing:
   - Operation name
   - Count (how many times it was called)
   - Total duration
   - Average duration
   - Min/Max duration

### Response Data

Performance summaries are included in API responses under the `_performance` key:

```json
{
  "sites": [...],
  "_performance": {
    "api.sites.GET": {
      "count": 1,
      "totalDuration": 1234.56,
      "avgDuration": 1234.56,
      "minDuration": 1234.56,
      "maxDuration": 1234.56
    },
    ...
  }
}
```

### Viewing Performance Data

1. **Server Logs**: Check Vercel logs or local console for detailed performance reports
2. **API Responses**: Check the `_performance` key in API responses
3. **Browser Console**: (Client-side logging to be added)

## Example Performance Report

```
================================================================================
PERFORMANCE REPORT
================================================================================

Operation: api.sites.GET.queryWithCategory.lateralJoin
  Count: 1
  Total: 234.56ms
  Average: 234.56ms
  Min: 234.56ms
  Max: 234.56ms

Operation: api.sites.GET.serializeResponse
  Count: 1
  Total: 12.34ms
  Average: 12.34ms
  Min: 12.34ms
  Max: 12.34ms

Operation: api.sites.GET
  Count: 1
  Total: 1234.56ms
  Average: 1234.56ms
  Min: 1234.56ms
  Max: 1234.56ms

================================================================================
```

## Next Steps

1. **Client-Side Logging**: Add performance logging to `Gallery.tsx` to track:
   - Fetch operations
   - State updates
   - Re-renders
   - Image loading

2. **Database Query Logging**: Add detailed timing for:
   - Connection establishment
   - Query execution
   - Result processing

3. **External API Logging**: Track timing for:
   - Groq API calls
   - Embedding service calls
   - Any other external services

4. **Analysis Tools**: Create scripts to:
   - Aggregate performance data
   - Identify bottlenecks
   - Generate reports

## Notes

- All timings are in milliseconds
- Performance data is included in responses for debugging
- Logs are verbose in development, can be reduced in production
- The system tracks nested operations automatically

