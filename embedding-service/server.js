// embedding-service/server.js
// Standalone CLIP embedding service
// Deploy this to Railway/Fly.io/Render/etc.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.EMBEDDING_SERVICE_API_KEY || 'change-me-in-production';

// Pre-load the model on startup to avoid cold start delays
let modelLoaded = false;
let modelLoadPromise = null;

async function preloadModel() {
  if (modelLoaded) return;
  if (modelLoadPromise) return modelLoadPromise;
  
  console.log('[embedding-service] Pre-loading CLIP model to avoid cold starts...');
  modelLoadPromise = (async () => {
    try {
      const { embedTextBatch } = require('./embeddings.js');
      // Load model by embedding a dummy text
      await embedTextBatch(['warmup']);
      modelLoaded = true;
      console.log('[embedding-service] Model pre-loaded successfully');
    } catch (error) {
      console.error('[embedding-service] Failed to pre-load model:', error.message);
      // Don't fail startup, just log the error
    }
  })();
  return modelLoadPromise;
}

// Pre-load model on startup
preloadModel().catch(err => {
  console.error('[embedding-service] Error during model pre-load:', err);
});

// Simple auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const providedKey = authHeader?.replace('Bearer ', '') || req.query.apiKey;
  
  if (!API_KEY || API_KEY === 'change-me-in-production') {
    console.warn('[embedding-service] WARNING: API_KEY not set, service is open!');
  }
  
  if (API_KEY && API_KEY !== 'change-me-in-production' && providedKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'clip-embeddings' });
});

// All other routes require auth
app.use(authenticate);

// Text embeddings endpoint
app.post('/embed/text', async (req, res) => {
  try {
    const { texts } = req.body;
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'texts array is required' });
    }
    
    console.log(`[embedding-service] Embedding ${texts.length} text(s)`);
    
    // Ensure model is loaded (wait for pre-load if still in progress)
    if (modelLoadPromise && !modelLoaded) {
      console.log('[embedding-service] Waiting for model to finish loading...');
      await modelLoadPromise;
    }
    
    // Use standalone embeddings module
    const { embedTextBatch } = require('./embeddings.js');
    
    const startTime = Date.now();
    const embeddings = await embedTextBatch(texts);
    const duration = Date.now() - startTime;
    
    console.log(`[embedding-service] Generated ${embeddings.length} embeddings in ${duration}ms`);
    
    res.json({
      embeddings,
      count: embeddings.length,
      dimension: embeddings[0]?.length || 768
    });
  } catch (error) {
    console.error('[embedding-service] Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate embeddings',
      message: error.message 
    });
  }
});

// Image embeddings endpoint (if needed)
app.post('/embed/image', async (req, res) => {
  try {
    const { image } = req.body; // base64 encoded image
    
    if (!image) {
      return res.status(400).json({ error: 'image is required (base64)' });
    }
    
    console.log('[embedding-service] Image embedding not yet implemented');
    return res.status(501).json({ error: 'Image embedding endpoint not yet implemented' });
    
    // TODO: Implement image embedding
    // const buffer = Buffer.from(image, 'base64');
    // const result = await embedImageFromBuffer(buffer);
    
    res.json({
      embedding: result.vector,
      contentHash: result.contentHash,
      dimension: result.vector.length
    });
  } catch (error) {
    console.error('[embedding-service] Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate image embedding',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`[embedding-service] Server running on port ${PORT}`);
  console.log(`[embedding-service] API Key: ${API_KEY ? 'Set' : 'NOT SET (service is open!)'}`);
});

