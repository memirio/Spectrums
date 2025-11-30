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

app.use(authenticate);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'clip-embeddings' });
});

// Text embeddings endpoint
app.post('/embed/text', async (req, res) => {
  try {
    const { texts } = req.body;
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'texts array is required' });
    }
    
    console.log(`[embedding-service] Embedding ${texts.length} text(s)`);
    
    // Lazy load embeddings module
    const { embedTextBatch } = await import('../src/lib/embeddings.js');
    
    const embeddings = await embedTextBatch(texts);
    
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
    
    console.log('[embedding-service] Embedding image');
    
    // Lazy load embeddings module
    const { embedImageFromBuffer } = await import('../src/lib/embeddings.js');
    
    const buffer = Buffer.from(image, 'base64');
    const result = await embedImageFromBuffer(buffer);
    
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

