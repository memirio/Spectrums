// embedding-service/embeddings.js
// Standalone CLIP embeddings implementation

const MODEL_ID = 'Xenova/clip-vit-large-patch14';

let __clip_text_tokenizer = null;
let __clip_text_model = null;

async function loadClipText() {
  try {
    const { AutoTokenizer, CLIPTextModelWithProjection } = await import('@xenova/transformers');
    
    if (!__clip_text_tokenizer) {
      __clip_text_tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
    }
    if (!__clip_text_model) {
      __clip_text_model = await CLIPTextModelWithProjection.from_pretrained(MODEL_ID, { quantized: true });
    }
    return {
      tokenizer: __clip_text_tokenizer,
      model: __clip_text_model,
    };
  } catch (error) {
    console.error('[embeddings] Error loading CLIP:', error);
    throw error;
  }
}

async function embedTextBatch(texts) {
  const { tokenizer, model } = await loadClipText();
  const safe = texts.map((t) => String(t ?? ''));
  const inputs = await tokenizer(safe, { padding: true, truncation: true });
  const { text_embeds } = await model(inputs);
  const flat = Array.from(text_embeds.data);
  const dim = text_embeds.dims[text_embeds.dims.length - 1];
  const rows = [];
  
  for (let i = 0; i < safe.length; i++) {
    const v = flat.slice(i * dim, (i + 1) * dim);
    const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    rows.push(v.map((x) => x / n));
  }
  
  return rows;
}

module.exports = { embedTextBatch };

