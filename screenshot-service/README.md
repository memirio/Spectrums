# Screenshot Service MVP

Auto-generate website screenshots on URL submission, just like Land-book.

## Quickstart

### Local Development

```bash
npm install
cp .env.example .env
npm run dev      # Terminal 1: API server
npm run worker   # Terminal 2: Queue worker
```

### Docker Compose (Recommended)

```bash
docker-compose up --build
```

This starts:
- API server on `http://localhost:3001`
- Worker process (runs in background)
- Redis on `localhost:6379`
- MinIO (S3-compatible) on `localhost:9000` (console: `localhost:9001`)

### Setup MinIO Bucket

After `docker-compose up`, initialize the bucket:

```bash
# Option 1: Using MinIO Console (GUI)
# 1. Open http://localhost:9001
# 2. Login: `minio` / `minio123`
# 3. Create bucket: `screenshots`
# 4. Set bucket policy to "Download" (public read)

# Option 2: Using MinIO Client (CLI)
docker-compose exec minio mc alias set local http://localhost:9000 minio minio123
docker-compose exec minio mc mb local/screenshots --ignore-existing
docker-compose exec minio mc anonymous set download local/screenshots
```

## API Endpoints

### POST /api/screenshot

Capture a website screenshot.

**Request:**
```bash
curl -X POST http://localhost:3001/api/screenshot \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-123' \
  -d '{
    "url": "https://example.com",
    "fullPage": true,
    "viewport": { "width": 1920, "height": 1080 }
  }'
```

**Response (202 Accepted):**
```json
{
  "jobId": "abc123",
  "statusUrl": "/api/screenshot/abc123"
}
```

### GET /api/screenshot/:jobId

Check job status and get result.

**Response (Done):**
```json
{
  "status": "done",
  "imageUrl": "http://localhost:9000/screenshots/abc123/...webp",
  "width": 1920,
  "height": 1080,
  "bytes": 123456
}
```

**Status values:** `queued`, `active`, `completed`, `failed`

### GET /healthz

Health check endpoint.

## Features

- ✅ Playwright Chromium captures
- ✅ WebP conversion with Sharp
- ✅ MinIO (S3-compatible) storage
- ✅ BullMQ job queue with Redis
- ✅ SSRF protection (blocks private IPs)
- ✅ Rate limiting (60 req/min)
- ✅ Caching (returns cached if exists unless `fresh: true`)
- ✅ Idempotency (use `Idempotency-Key` header)
- ✅ Full-page scrolling for lazy-loaded content
- ✅ Cookie banner/modal hiding
- ✅ Mobile device emulation support

## Configuration

See `.env.example` for all environment variables.

## Testing

### Unit Tests

```bash
npm test
```

Runs unit tests for:
- Cache key generation (hash utility)
- SSRF protection (IP guard)
- URL validation

### Integration Testing

1. **Start services:**
   ```bash
   docker-compose up -d
   ```

2. **Wait for services to be ready** (about 10-15 seconds)

3. **Initialize MinIO bucket:**
   ```bash
   docker-compose exec minio mc alias set local http://localhost:9000 minio minio123
   docker-compose exec minio mc mb local/screenshots --ignore-existing
   docker-compose exec minio mc anonymous set download local/screenshots
   ```

4. **Test the API:**
   ```bash
   # Health check
   curl http://localhost:3001/healthz

   # Request screenshot
   curl -X POST http://localhost:3001/api/screenshot \
     -H 'Content-Type: application/json' \
     -H 'Idempotency-Key: test-123' \
     -d '{"url":"https://example.com","fullPage":true}'

   # Check status (use jobId from previous response)
   curl http://localhost:3001/api/screenshot/<jobId>
   ```

5. **Or use the test script:**
   ```bash
   npm run test:api  # Or: tsx scripts/test-api.ts https://example.com
   ```

### Expected Results

- ✅ Health endpoint returns `{"status":"ok"}`
- ✅ POST returns `202` with `{jobId, statusUrl}`
- ✅ Status endpoint progresses: `queued` → `active` → `completed`
- ✅ Completed status includes `{imageUrl, width, height, bytes}`
- ✅ Image URL is accessible from MinIO
- ✅ Second request with same URL returns cached result (200, not 202)

## Architecture

```
User → POST /api/screenshot → Queue Job → Worker → Playwright → Sharp → MinIO → CDN URL
                                     ↓
                                  Redis Cache
```

