# Spectrums Embedding Service

Standalone CLIP embedding service that runs separately from the main Next.js app.

## Why Separate?

- **Vercel** (where the main app runs) doesn't support native binaries
- **Railway/Fly.io/etc** (where this service runs) supports native binaries perfectly
- Clean separation: frontend on Vercel, ML backend here

## Quick Start

### Local Development

```bash
cd embedding-service
npm install
EMBEDDING_SERVICE_API_KEY=your-secret-key npm run dev
```

### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select this repository
4. Set root directory to `embedding-service`
5. Add environment variable:
   - `EMBEDDING_SERVICE_API_KEY` = your secret key
6. Deploy!

### Deploy to Fly.io

```bash
cd embedding-service
fly launch
# Follow prompts, set EMBEDDING_SERVICE_API_KEY
```

## API Endpoints

### POST /embed/text

Generate text embeddings.

**Request:**
```json
{
  "texts": ["a cat", "a dog"]
}
```

**Response:**
```json
{
  "embeddings": [[...], [...]],
  "count": 2,
  "dimension": 768
}
```

### POST /embed/image

Generate image embeddings (base64).

**Request:**
```json
{
  "image": "base64-encoded-image-data"
}
```

**Response:**
```json
{
  "embedding": [...],
  "contentHash": "...",
  "dimension": 768
}
```

### GET /health

Health check endpoint.

## Authentication

Set `EMBEDDING_SERVICE_API_KEY` environment variable, then include in requests:

```
Authorization: Bearer your-api-key
```

Or as query parameter:
```
?apiKey=your-api-key
```

## Environment Variables

- `EMBEDDING_SERVICE_API_KEY` - API key for authentication (required in production)
- `PORT` - Server port (default: 3001)

