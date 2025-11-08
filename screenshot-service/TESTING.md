# Testing Guide

## ✅ Unit Tests (PASSING)

```bash
npm test
```

**Results:**
- ✅ Cache key generation (consistent, different for different params)
- ✅ SSRF protection (blocks private IPs, localhost, invalid protocols)
- ✅ URL validation

## 🔄 Integration Testing (Requires Docker)

### Prerequisites

1. Docker Desktop running
2. Ports available: 3001, 6379, 9000, 9001

### Step 1: Start Services

```bash
docker-compose up -d
```

Wait for all services to be healthy (check with `docker-compose ps`).

### Step 2: Initialize MinIO

```bash
# Set up MinIO client alias
docker-compose exec minio mc alias set local http://localhost:9000 minio minio123

# Create screenshots bucket
docker-compose exec minio mc mb local/screenshots --ignore-existing

# Make bucket publicly readable (for CDN access)
docker-compose exec minio mc anonymous set download local/screenshots
```

### Step 3: Test Health Endpoint

```bash
curl http://localhost:3001/healthz
```

**Expected:** `{"status":"ok","timestamp":"..."}`

### Step 4: Request Screenshot

```bash
curl -X POST http://localhost:3001/api/screenshot \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: test-demo' \
  -d '{
    "url": "https://example.com",
    "fullPage": true,
    "viewport": { "width": 1920, "height": 1080 }
  }'
```

**Expected Response (202):**
```json
{
  "jobId": "test-demo",
  "statusUrl": "/api/screenshot/test-demo"
}
```

### Step 5: Check Job Status

```bash
# Replace <jobId> with the actual jobId from step 4
curl http://localhost:3001/api/screenshot/test-demo
```

**Polling:** The job will transition:
1. `{"status": "waiting"}` or `{"status": "active"}` (processing)
2. `{"status": "completed", "imageUrl": "...", "width": 1920, "height": 1080, "bytes": ...}`

**Timing:** First screenshot takes ~10-30 seconds depending on site complexity.

### Step 6: Verify Caching

Request the same URL again (same Idempotency-Key or URL):

```bash
curl -X POST http://localhost:3001/api/screenshot \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: test-demo' \
  -d '{"url": "https://example.com", "fullPage": true}'
```

**Expected:** Immediate `200` response with `{"imageUrl": "...", "cached": true}`

### Step 7: Access Screenshot

Visit the `imageUrl` from the completed job response, e.g.:
```
http://localhost:9000/screenshots/<hash>/<filename>.webp
```

The image should load in your browser.

## 🐛 Troubleshooting

### Services won't start
- Check Docker is running: `docker ps`
- Check ports aren't in use: `lsof -i :3001,6379,9000`

### Screenshot job fails
- Check worker logs: `docker-compose logs worker`
- Common issues:
  - URL requires authentication
  - URL blocks bots
  - DNS resolution issues
  - Timeout (site loads slowly)

### MinIO access issues
- Verify bucket exists: `docker-compose exec minio mc ls local/`
- Check bucket policy: `docker-compose exec minio mc anonymous get local/screenshots`

## 📊 Test Coverage

- [x] Unit: Hash generation
- [x] Unit: SSRF protection  
- [x] Integration: API health
- [ ] Integration: Screenshot capture (requires Docker)
- [ ] Integration: Caching behavior (requires Docker)
- [ ] Integration: Full-page screenshots (requires Docker)
- [ ] Integration: Mobile emulation (requires Docker)

