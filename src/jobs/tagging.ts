import { prisma } from '@/lib/prisma';
import { embedImageFromBuffer, canonicalizeImage } from '@/lib/embeddings';

function cosineSimilarity(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i];
  return s;
}

export async function tagImage(imageId: string): Promise<string[]> {
  const image = await prisma.image.findUnique({ 
    where: { id: imageId },
    select: { id: true, url: true, category: true }
  });
  if (!image) return [];
  
  // Get image category for concept metadata
  const imageCategory = (image as any).category || 'website';

  // Fetch image buffer
  const res = await fetch(image.url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${image.url}`);
  const ab = await res.arrayBuffer();
  const buf = Buffer.from(ab);

  // Canonicalize to get contentHash (cheap operation)
  const { hash: contentHash } = await canonicalizeImage(buf);
  
  // Check if embedding already exists for this image
  const existingForImage = await prisma.imageEmbedding.findUnique({ 
    where: { imageId: image.id } 
  });
  
  // Check if embedding exists by contentHash (for reuse)
  const existingByHash = await prisma.imageEmbedding.findFirst({ 
    where: { contentHash: contentHash } as any 
  });
  
  let ivec: number[];
  if (existingForImage) {
    // Embedding already exists for this image - reuse it
    ivec = existingForImage.vector as unknown as number[];
    // Update contentHash if needed (but don't violate unique constraint)
    if (existingForImage.contentHash !== contentHash && !existingByHash) {
      // Only update if no other image has this contentHash
      await prisma.imageEmbedding.update({
        where: { imageId: image.id },
        data: { contentHash: contentHash } as any,
      });
    }
  } else if (existingByHash) {
    // Reuse existing embedding vector from another image (don't recompute)
    ivec = existingByHash.vector as unknown as number[];
    // Since contentHash is unique, we can't create a new record with same hash
    // Instead, create without contentHash (or use a different approach)
    // Actually, each image should have its own embedding record
    // We'll create a new record but with null contentHash if hash already exists
    try {
      await prisma.imageEmbedding.create({
        data: { 
          imageId: image.id, 
          model: existingByHash.model, 
          vector: existingByHash.vector as any, 
          contentHash: null // Set to null if hash already exists
        } as any,
      });
    } catch (e: any) {
      // If creation fails (e.g., imageId already exists), just update
      await prisma.imageEmbedding.update({
        where: { imageId: image.id },
        data: { 
          model: existingByHash.model,
          vector: existingByHash.vector as any,
        } as any,
      });
    }
  } else {
    // Compute new embedding (expensive operation)
    const result = await embedImageFromBuffer(buf);
    ivec = result.vector;
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id },
      update: { 
        model: 'clip-ViT-L/14', 
        vector: ivec as unknown as any, 
        contentHash: contentHash 
      } as any,
      create: { 
        imageId: image.id, 
        model: 'clip-ViT-L/14', 
        vector: ivec as unknown as any, 
        contentHash: contentHash 
      } as any,
    });
  }

  // STEP 1: Analyze image and CREATE new abstract concepts (at least one per category)
  // Use Gemini to generate concepts directly from the image (no similarity matching)
  // Falls back to OpenAI if Gemini times out or fails
  const newlyCreatedConcepts = await createNewConceptsFromImage(image.id, buf, imageCategory);
  
  // STEP 2: Tag the image using pre-computed concept embeddings (fast hybrid approach)
  // OPTIMIZATION: Only fetch concept IDs and embeddings (not other fields)
  const { TAG_CONFIG } = await import('@/lib/tagging-config');
  const concepts = await prisma.concept.findMany({
    select: {
      id: true,
      embedding: true,
      // Don't fetch label, synonyms, related, opposites - not needed for tagging
    },
  });
  
  // Use pre-computed embeddings (fast approach)
  function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    let s = 0
    for (let i = 0; i < a.length; i++) s += a[i] * b[i]
    return s
  }
  
  // Score all concepts (don't filter by MIN_SCORE yet - we need unfiltered list for fallback)
  const allScored = concepts
    .filter((c: any) => c.embedding && Array.isArray(c.embedding))
    .map((c: any) => ({ 
      conceptId: c.id, 
      score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || []) 
    }))
    .sort((a: any, b: any) => b.score - a.score)
  
  // Filter to only scores above MIN_SCORE for main tagging logic
  const scored = allScored.filter((s: any) => s.score >= TAG_CONFIG.MIN_SCORE)
  
  // Apply pragmatic tagging logic
  const chosen: typeof allScored = []
  const MIN_TAGS_PER_IMAGE = 8
  const maxScore = scored.length > 0 ? scored[0].score : (allScored.length > 0 ? allScored[0].score : 0)
  let prevScore = maxScore
  
  for (let i = 0; i < scored.length && chosen.length < TAG_CONFIG.MAX_K; i++) {
    const current = scored[i]
    
    if (chosen.length === 0) {
      chosen.push(current)
      prevScore = current.score
      continue
    }
    
    // Check drop from previous score (consecutive drop)
    const consecutiveDropPct = (prevScore - current.score) / prevScore
    // Check drop from maximum score (total drop from top)
    const totalDropPct = (maxScore - current.score) / maxScore
    
    // Stop if either:
    // 1. Consecutive drop > 30% (significant gap between consecutive tags)
    // 2. Total drop from max > 8% (we're getting far from the top score)
    // Lowered to 8% to prevent hitting MAX_K when scores are tightly clustered
    // Also add safety: stop if we're close to MAX_K (560+) and total drop > 3%
    const isNearMaxK = chosen.length > 560 // 80% of MAX_K (700)
    if (consecutiveDropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT || totalDropPct > 0.08 || (isNearMaxK && totalDropPct > 0.03)) {
      if (chosen.length < MIN_TAGS_PER_IMAGE) {
        chosen.push(current)
        prevScore = current.score
      } else {
        break
      }
    } else {
      chosen.push(current)
      prevScore = current.score
    }
  }
  
  // Fallback: ensure minimum tags (use allScored if scored is empty or insufficient)
  if (chosen.length < MIN_TAGS_PER_IMAGE) {
    const fallback = (scored.length >= MIN_TAGS_PER_IMAGE ? scored : allScored).slice(0, MIN_TAGS_PER_IMAGE)
    const keep = new Set(chosen.map((c: any) => c.conceptId))
    for (const f of fallback) {
      if (!keep.has(f.conceptId)) {
        chosen.push(f)
        keep.add(f.conceptId)
        if (chosen.length >= MIN_TAGS_PER_IMAGE) break
      }
    }
  }
  
  const tagResults = chosen.sort((a: any, b: any) => b.score - a.score)
  const chosenConceptIds = new Set(tagResults.map((t: any) => t.conceptId))

  // Get existing tags to avoid duplicates
  const existingTags = await prisma.imageTag.findMany({
    where: { imageId: image.id },
  })
  const existingConceptIds = new Set(existingTags.map((t: any) => t.conceptId))

  // Only create new tags (don't update or delete existing ones)
  for (const t of tagResults) {
    if (!existingConceptIds.has(t.conceptId)) {
      await prisma.imageTag.create({
        data: { imageId: image.id, conceptId: t.conceptId, score: t.score },
      })
    }
  }
  
  // Trigger incremental hub detection for this image only (debounced, runs in background)
  // This is much faster than processing all images
  try {
    const { triggerHubDetectionForImages } = await import('@/jobs/hub-detection-trigger')
    triggerHubDetectionForImages([image.id]).catch((err) => {
      console.warn(`[tagImage] Failed to trigger hub detection: ${err.message}`)
    })
  } catch (hubError) {
    // Non-fatal: hub detection is a background optimization
    console.warn(`[tagImage] Failed to trigger hub detection:`, (hubError as Error)?.message)
  }
  
  // Return the IDs of newly created concepts
  return newlyCreatedConcepts || []
}

/**
 * Tag image with existing concepts only (Pipeline 2.0)
 * Does NOT generate new concepts - only tags with existing concepts
 * This is faster and doesn't require Gemini/OpenAI API calls
 */
export async function tagImageWithoutNewConcepts(imageId: string): Promise<void> {
  const image = await prisma.image.findUnique({ 
    where: { id: imageId },
    select: { id: true, url: true, category: true }
  });
  if (!image) return;
  
  // Fetch image buffer
  const res = await fetch(image.url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${image.url}`);
  const ab = await res.arrayBuffer();
  const buf = Buffer.from(ab);

  // Canonicalize to get contentHash (cheap operation)
  const { hash: contentHash } = await canonicalizeImage(buf);
  
  // Check if embedding already exists for this image
  const existingForImage = await prisma.imageEmbedding.findUnique({ 
    where: { imageId: image.id } 
  });
  
  // Check if embedding exists by contentHash (for reuse)
  const existingByHash = await prisma.imageEmbedding.findFirst({ 
    where: { contentHash: contentHash } as any 
  });
  
  let ivec: number[];
  if (existingForImage) {
    // Embedding already exists for this image - reuse it
    ivec = existingForImage.vector as unknown as number[];
    // Update contentHash if needed (but don't violate unique constraint)
    if (existingForImage.contentHash !== contentHash && !existingByHash) {
      // Only update if no other image has this contentHash
      await prisma.imageEmbedding.update({
        where: { imageId: image.id },
        data: { contentHash: contentHash } as any,
      });
    }
  } else if (existingByHash) {
    // Reuse existing embedding vector from another image (don't recompute)
    ivec = existingByHash.vector as unknown as number[];
    // Since contentHash is unique, we can't create a new record with same hash
    // Instead, create without contentHash (or use a different approach)
    // Actually, each image should have its own embedding record
    // We'll create a new record but with null contentHash if hash already exists
    try {
      await prisma.imageEmbedding.create({
        data: { 
          imageId: image.id, 
          model: existingByHash.model, 
          vector: existingByHash.vector as any, 
          contentHash: null // Set to null if hash already exists
        } as any,
      });
    } catch (e: any) {
      // If creation fails (e.g., imageId already exists), just update
      await prisma.imageEmbedding.update({
        where: { imageId: image.id },
        data: { 
          model: existingByHash.model,
          vector: existingByHash.vector as any,
        } as any,
      });
    }
  } else {
    // Compute new embedding (expensive operation)
    const result = await embedImageFromBuffer(buf);
    ivec = result.vector;
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id },
      update: { 
        model: 'clip-ViT-L/14', 
        vector: ivec as unknown as any, 
        contentHash: contentHash 
      } as any,
      create: { 
        imageId: image.id, 
        model: 'clip-ViT-L/14', 
        vector: ivec as unknown as any, 
        contentHash: contentHash 
      } as any,
    });
  }

  // Tag the image using pre-computed concept embeddings (existing concepts only)
  // OPTIMIZATION: Only fetch concept IDs and embeddings (not other fields)
  const { TAG_CONFIG } = await import('@/lib/tagging-config');
  const concepts = await prisma.concept.findMany({
    select: {
      id: true,
      embedding: true,
      // Don't fetch label, synonyms, related, opposites - not needed for tagging
    },
  });
  
  // Use pre-computed embeddings (fast approach)
  function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    let s = 0
    for (let i = 0; i < a.length; i++) s += a[i] * b[i]
    return s
  }
  
  // Score all concepts (don't filter by MIN_SCORE yet - we need unfiltered list for fallback)
  const allScored = concepts
    .filter((c: any) => c.embedding && Array.isArray(c.embedding))
    .map((c: any) => ({ 
      conceptId: c.id, 
      score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || []) 
    }))
    .sort((a: any, b: any) => b.score - a.score)
  
  // Filter to only scores above MIN_SCORE for main tagging logic
  const scored = allScored.filter((s: any) => s.score >= TAG_CONFIG.MIN_SCORE)
  
  // Apply pragmatic tagging logic
  const chosen: typeof allScored = []
  const MIN_TAGS_PER_IMAGE = 8
  const maxScore = scored.length > 0 ? scored[0].score : (allScored.length > 0 ? allScored[0].score : 0)
  let prevScore = maxScore
  
  for (let i = 0; i < scored.length && chosen.length < TAG_CONFIG.MAX_K; i++) {
    const current = scored[i]
    
    if (chosen.length === 0) {
      chosen.push(current)
      prevScore = current.score
      continue
    }
    
    // Check drop from previous score (consecutive drop)
    const consecutiveDropPct = (prevScore - current.score) / prevScore
    // Check drop from maximum score (total drop from top)
    const totalDropPct = (maxScore - current.score) / maxScore
    
    // Stop if either:
    // 1. Consecutive drop > 30% (significant gap between consecutive tags)
    // 2. Total drop from max > 8% (we're getting far from the top score)
    // Lowered to 8% to prevent hitting MAX_K when scores are tightly clustered
    // Also add safety: stop if we're close to MAX_K (560+) and total drop > 3%
    const isNearMaxK = chosen.length > 560 // 80% of MAX_K (700)
    if (consecutiveDropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT || totalDropPct > 0.08 || (isNearMaxK && totalDropPct > 0.03)) {
      if (chosen.length < MIN_TAGS_PER_IMAGE) {
        chosen.push(current)
        prevScore = current.score
      } else {
        break
      }
    } else {
      chosen.push(current)
      prevScore = current.score
    }
  }
  
  // Fallback: ensure minimum tags (use allScored if scored is empty or insufficient)
  if (chosen.length < MIN_TAGS_PER_IMAGE) {
    const fallback = (scored.length >= MIN_TAGS_PER_IMAGE ? scored : allScored).slice(0, MIN_TAGS_PER_IMAGE)
    const keep = new Set(chosen.map((c: any) => c.conceptId))
    for (const f of fallback) {
      if (!keep.has(f.conceptId)) {
        chosen.push(f)
        keep.add(f.conceptId)
        if (chosen.length >= MIN_TAGS_PER_IMAGE) break
      }
    }
  }
  
  const tagResults = chosen.sort((a: any, b: any) => b.score - a.score)
  const chosenConceptIds = new Set(tagResults.map((t: any) => t.conceptId))

  // Get existing tags to avoid duplicates
  const existingTags = await prisma.imageTag.findMany({
    where: { imageId: image.id },
  })
  const existingConceptIds = new Set(existingTags.map((t: any) => t.conceptId))

  // Only create new tags (don't update or delete existing ones)
  for (const t of tagResults) {
    if (!existingConceptIds.has(t.conceptId)) {
      await prisma.imageTag.create({
        data: { imageId: image.id, conceptId: t.conceptId, score: t.score },
      })
    }
  }
  
  // Hub detection is now triggered by the caller (sites route) with force mode
  // Removed duplicate call to avoid double-triggering
}

/**
 * Create new abstract concepts from a single image using Gemini vision API
 * Creates at least one new concept per category from the 12 categories
 * This is truly generative - creates new concepts without looking at existing examples
 * 
 * This function ONLY generates concepts - it does NOT apply tags to the image
 */
export async function createNewConceptsFromImage(imageId: string, imageBuffer: Buffer, imageCategory: string = 'website'): Promise<string[]> {
  const { generateAbstractConceptsFromImage } = await import('@/lib/gemini');
  const fs = await import('fs/promises');
  const path = await import('path');
  
  // Category definitions
  const CATEGORIES = {
    'feeling-emotion': {
      label: 'Feeling / Emotion',
      examples: ['Joy', 'Peace', 'Melancholy', 'Anxiety', 'Hope', 'Serenity', 'Anger', 'Awe', 'Nostalgia', 'Isolation', 'Wonder', 'Calm', 'Tension', 'Relaxation', 'Warmth', 'Cold', 'Pressure', 'Lightness', 'Heaviness', 'Comfort', 'Discomfort', 'Energy', 'Fatigue', 'Vitality', 'Stillness', 'Movement', 'Openness', 'Confinement'],
    },
    'vibe-mood': {
      label: 'Vibe / Mood',
      examples: ['Dreamlike', 'Futuristic', 'Minimal', 'Cinematic', 'Intimate', 'Chaotic', 'Ethereal', 'Industrial', 'Playful', 'Somber', 'Mysterious', 'Urban'],
    },
    'philosophical-existential': {
      label: 'Philosophical / Existential Concepts',
      examples: ['Identity', 'Mortality', 'Duality', 'Time', 'Impermanence', 'Chaos', 'Order', 'Rebirth', 'Truth', 'Memory', 'Infinity', 'Transformation'],
    },
    'aesthetic-formal': {
      label: 'Aesthetic / Formal',
      examples: ['Symmetry', 'Asymmetry', 'Balance', 'Rhythm', 'Contrast', 'Unity', 'Minimalism', 'Composition', 'Negative Space', 'Harmony', 'Flow'],
    },
    'natural-metaphysical': {
      label: 'Natural / Metaphysical Concepts',
      examples: ['Growth', 'Decay', 'Flow', 'Evolution', 'Stillness', 'Energy', 'Renewal', 'Interconnection', 'Gravity', 'Seasons', 'Transcendence'],
    },
    'social-cultural': {
      label: 'Social / Cultural Concepts',
      examples: ['Consumerism', 'Diversity', 'Gender', 'Power', 'Isolation', 'Globalization', 'Sustainability', 'Technology', 'Authenticity', 'Modernity'],
    },
    'design-style': {
      label: 'Design Style',
      examples: ['Minimalism', 'Bauhaus', 'Brutalism', 'Surrealism', 'Postmodernism', 'Futurism', 'Organic', 'Art Deco', 'Maximalism', 'Retro-Futurism', 'Skeuomorphic', 'Glassmorphism', 'Neumorphism', 'Cyberpunk', 'Scandinavian', 'Bohemian', 'Gothic', 'Rustic', 'Industrial', 'Vintage', 'Y2K', 'Dark Academia', 'Light Academia', 'Cottagecore', 'Traditional', 'New', 'Old', 'Friendly', 'Gritty', 'Serene', 'Ethereal', 'Dreamlike', 'Futuristic', 'Minimal', 'Cinematic', 'Intimate', 'Chaotic', 'Ethereal', 'Industrial', 'Playful', 'Somber', 'Mysterious', 'Urban'],
    },
    'color-tone': {
      label: 'Color & Tone',
      examples: ['Warm', 'Cool', 'Monochrome', 'Pastel', 'Vibrant', 'Muted', 'Neon', 'High Contrast', 'Gradient', 'Tonal Harmony', 'Shadow Play'],
    },
    'texture-materiality': {
      label: 'Texture & Materiality',
      examples: ['Matte', 'Glossy', 'Grainy', 'Layered', 'Organic', 'Soft', 'Dense', 'Transparent', 'Metallic', 'Synthetic', 'Fibrous', 'Fluid'],
    },
    'form-structure': {
      label: 'Form & Structure',
      examples: ['Grid', 'Line', 'Shape', 'Scale', 'Proportion', 'Repetition', 'Rhythm', 'Modularity', 'Hierarchy', 'Fragmentation', 'Flow', 'Balance'],
    },
    'design-technique': {
      label: 'Design Technique',
      examples: ['Photography', 'Collage', '3D Rendering', 'Illustration', 'Vector Graphics', 'Generative Art', 'Painting', 'AI Synthesis', 'Glitch Art', 'Mixed Media', 'Typography', 'Motion Design'],
    },
    'industry': {
      label: 'Industry',
      examples: ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Fashion', 'Food', 'Travel', 'Real Estate', 'Automotive', 'Entertainment', 'Sports', 'Non-profit', 'Government', 'Manufacturing', 'Energy', 'Media', 'Consulting', 'Legal', 'Hospitality', 'Banking', 'SaaS', 'Telemedicine', 'Fintech', 'EdTech', 'Retail', 'Luxury', 'Restaurant', 'Hospitality', 'PropTech', 'Mobility', 'Gaming', 'Fitness', 'Charity', 'Public Sector', 'Industrial', 'Renewable', 'Publishing', 'Advisory', 'Law', 'Hotels'],
    }
  };
  
  // OPTIMIZATION: Load seed file FIRST (contains all concept data including synonyms/related)
  // This avoids fetching synonyms/related from database, saving ~40% data transfer per image
  let seedConcepts: any[] = [];
  try {
    const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
    const seedContent = await fs.readFile(seedPath, 'utf-8');
    seedConcepts = JSON.parse(seedContent);
  } catch (e) {
    // If seed file not found, can't add new concepts
    return [];
  }
  
  // OPTIMIZATION: Only fetch concept IDs and labels from database (for checking what exists in DB)
  // Load synonyms/related from seed file instead (much smaller, already in memory)
  const existingConceptsDb = await prisma.concept.findMany({
    select: { id: true, label: true }
    // Don't fetch synonyms/related - load from seed file instead
  });
  const existingIds = new Set(existingConceptsDb.map((c: any) => c.id.toLowerCase()));
  const existingLabels = new Set<string>(existingConceptsDb.map((c: any) => c.label.toLowerCase()));
  
  // Collect all synonyms and related terms from seed file (not database - saves data transfer)
  const existingSynonyms = new Set<string>();
  const existingRelated = new Set<string>();
  for (const sc of seedConcepts) {
    existingLabels.add((sc.label || '').toLowerCase());
    for (const syn of (sc.synonyms || [])) {
      existingSynonyms.add(String(syn).toLowerCase());
    }
    for (const rel of (sc.related || [])) {
      existingRelated.add(String(rel).toLowerCase());
    }
  }
  
  // Create combined existingConcepts array for matching logic (use seed file as primary source since it has full data)
  // Merge database concepts with seed concepts, preferring seed file data when available
  const existingConcepts: Array<{ id: string; label: string; synonyms?: string[]; related?: string[] }> = [];
  const seedConceptMap = new Map(seedConcepts.map((sc: any) => [sc.id.toLowerCase(), sc]));
  
  // Add all seed concepts (they have full data)
  for (const sc of seedConcepts) {
    existingConcepts.push({
      id: sc.id,
      label: sc.label,
      synonyms: sc.synonyms || [],
      related: sc.related || [],
    });
  }
  
  // Add database concepts that aren't in seed file (shouldn't happen, but safety check)
  for (const dbConcept of existingConceptsDb) {
    if (!seedConceptMap.has(dbConcept.id.toLowerCase())) {
      existingConcepts.push({
        id: dbConcept.id,
        label: dbConcept.label,
        synonyms: [],
        related: [],
      });
    }
  }
  
  // Helper function to check for exact matches only
  function isExactDuplicate(label: string, conceptId: string): boolean {
    const labelLower = label.toLowerCase();
    const idLower = conceptId.toLowerCase();
    
    // Exact match check only (id and label)
    if (existingIds.has(idLower) || existingLabels.has(labelLower)) {
      return true;
    }
    
    // Check seed file for exact matches
    for (const sc of seedConcepts) {
      const seedLabel = (sc.label || '').toLowerCase();
      const seedId = (sc.id || '').toLowerCase();
      
      if (labelLower === seedLabel || idLower === seedId) {
        return true;
      }
    }
    
    return false;
  }
  
  // Helper function to find existing concept that matches (fuzzy or synonym)
  // Returns the existing concept if found, null otherwise
  function findExistingMatchingConcept(label: string): { id: string; label: string; category?: string } | null {
    const labelLower = label.toLowerCase();
    
    // Check if label is a synonym or related term of existing concept
    if (existingSynonyms.has(labelLower) || existingRelated.has(labelLower)) {
      // Find which concept has this as a synonym/related
      for (const c of existingConcepts) {
        const syns = (c.synonyms as unknown as string[]) || [];
        const rels = (c.related as unknown as string[]) || [];
        for (const syn of syns) {
          if (syn.toLowerCase() === labelLower) {
            return { id: c.id, label: c.label };
          }
        }
        for (const rel of rels) {
          if (rel.toLowerCase() === labelLower) {
            return { id: c.id, label: c.label };
          }
        }
      }
      
      // Check seed file
      for (const sc of seedConcepts) {
        const syns = (sc.synonyms || []) as string[];
        const rels = (sc.related || []) as string[];
        for (const syn of syns) {
          if (String(syn).toLowerCase() === labelLower) {
            return { id: sc.id, label: sc.label, category: sc.category };
          }
        }
        for (const rel of rels) {
          if (String(rel).toLowerCase() === labelLower) {
            return { id: sc.id, label: sc.label, category: sc.category };
          }
        }
      }
    }
    
    // Check if label is very similar to existing labels (fuzzy matching)
    for (const existingLabel of existingLabels) {
      // If labels are very similar (e.g., "Joy" vs "Joyful", "Minimal" vs "Minimalism")
      if (labelLower === existingLabel) {
        // Find the concept with this label
        const c = existingConcepts.find((c: any) => c.label.toLowerCase() === existingLabel);
        if (c) return { id: c.id, label: c.label };
      }
      if (labelLower.includes(existingLabel) && labelLower.length <= existingLabel.length + 3) {
        const c = existingConcepts.find((c: any) => c.label.toLowerCase() === existingLabel);
        if (c) return { id: c.id, label: c.label };
      }
      if (existingLabel.includes(labelLower) && existingLabel.length <= labelLower.length + 3) {
        const c = existingConcepts.find((c: any) => c.label.toLowerCase() === existingLabel);
        if (c) return { id: c.id, label: c.label };
      }
    }
    
    // Check seed file for fuzzy matches
    for (const sc of seedConcepts) {
      const seedLabel = (sc.label || '').toLowerCase();
      if (labelLower === seedLabel) {
        return { id: sc.id, label: sc.label, category: sc.category };
      }
      if (labelLower.includes(seedLabel) && labelLower.length <= seedLabel.length + 3) {
        return { id: sc.id, label: sc.label, category: sc.category };
      }
      if (seedLabel.includes(labelLower) && seedLabel.length <= labelLower.length + 3) {
        return { id: sc.id, label: sc.label, category: sc.category };
      }
    }
    
    return null;
  }
  
  const newConcepts: any[] = [];
  
  // Use Gemini to generate concepts directly from the image (truly generative, no similarity matching)
  console.log(`[tagImage] Generating abstract concepts from image using Gemini...`);
  
  let generatedConcepts: Record<string, Array<{ concept: string; opposites: string[] }>>;
  try {
    generatedConcepts = await generateAbstractConceptsFromImage(imageBuffer, 'image/png');
  } catch (error: any) {
    console.error(`[tagImage] Failed to generate concepts with Gemini: ${error.message}`);
    // Fallback: return empty array if Gemini fails
    return [];
  }
  
  // Helper to split compound words into core + synonyms
  function splitCompoundWord(label: string): { core: string; synonyms: string[] } {
    // If it's already a single word, return as-is
    const words = label.trim().split(/\s+/);
    if (words.length === 1) {
      return { core: label, synonyms: [] };
    }
    
    // Take the last word as the core (usually the main concept)
    // Use preceding words as synonyms
    const core = words[words.length - 1];
    const synonyms = words.slice(0, -1);
    
    return { core, synonyms };
  }
  
  // Process each category - concepts now include opposites from the initial call
  for (const [categoryId, conceptData] of Object.entries(generatedConcepts)) {
    const category = CATEGORIES[categoryId as keyof typeof CATEGORIES];
    if (!category) {
      console.warn(`[tagImage] Unknown category: ${categoryId}`);
      continue;
    }
    
    // New format: conceptData is always an array of {concept, opposites} objects
    const conceptsWithOpposites: Array<{ concept: string; opposites: string[] }> = conceptData;
    
    // Ensure at least 1 concept per category
    if (conceptsWithOpposites.length === 0) {
      console.warn(`[tagImage] No concepts generated for category: ${categoryId}`);
      continue;
    }
    
    // Process each concept in this category
    for (const { concept: generatedLabel, opposites: generatedOpposites } of conceptsWithOpposites) {
      if (!generatedLabel || typeof generatedLabel !== 'string') {
        continue;
      }
      
      // Split compound words into core + synonyms
      const { core, synonyms: compoundSynonyms } = splitCompoundWord(generatedLabel);
      const conceptLabel = core;
      
      // Create concept ID from label
      const conceptId = conceptLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Check if this is an exact duplicate (id or label exact match)
      if (isExactDuplicate(conceptLabel, conceptId)) {
        console.log(`[tagImage] Skipping exact duplicate: ${conceptLabel} (${category.label})`);
        continue;
      }
      
      // Check if this matches an existing concept (fuzzy or synonym) - merge into existing
      const existingMatch = findExistingMatchingConcept(conceptLabel);
      if (existingMatch) {
        // Merge: add this label as a synonym to the existing concept
        console.log(`[tagImage] Merging "${conceptLabel}" into existing concept "${existingMatch.label}" as synonym`);
        
        // Update the existing concept's synonyms in seed file
        const seedConcept = seedConcepts.find((sc: any) => sc.id === existingMatch.id);
        if (seedConcept) {
          const synonyms = (seedConcept.synonyms || []) as string[];
          if (!synonyms.includes(conceptLabel)) {
            synonyms.push(conceptLabel);
            seedConcept.synonyms = synonyms;
          }
        }
        
        // Also update in database
        const dbConcept = existingConceptsDb.find((c: any) => c.id === existingMatch.id);
        if (dbConcept) {
          // Get synonyms from seed file (more reliable than database)
          const seedConcept = seedConcepts.find((sc: any) => sc.id === existingMatch.id);
          const synonyms = (seedConcept?.synonyms || []) as string[];
          if (!synonyms.includes(conceptLabel)) {
            const updatedSynonyms = [...synonyms, conceptLabel];
            await prisma.concept.update({
              where: { id: existingMatch.id },
              data: { synonyms: updatedSynonyms as any }
            });
          }
        }
        
        // Continue to next concept - don't create new concept
        continue;
      }
      
      // No exact match and no fuzzy match - create new concept
      // Try to generate synonyms and related terms using AI (OpenAI), fallback to basic generation
      let synonyms: string[] = [];
      let related: string[] = [];
      
      try {
        const { generateSynonymsAndRelatedWithAI } = await import('@/lib/concept-enrichment');
        const categoryLabel = typeof category === 'string' ? category : category?.label || undefined;
        const aiGenerated = await generateSynonymsAndRelatedWithAI(conceptLabel, categoryLabel, existingConcepts as any[]);
        synonyms = aiGenerated.synonyms || [];
        related = aiGenerated.related || [];
        console.log(`[tagImage] ✅ Generated ${synonyms.length} synonyms and ${related.length} related terms for "${conceptLabel}" using AI`);
      } catch (error: any) {
        // Fallback to basic generation if AI fails
        console.warn(`[tagImage] ⚠️  AI synonym/related generation failed for "${conceptLabel}": ${error.message}, using basic generation`);
        synonyms = generateSynonymsForConcept(conceptLabel, category);
        related = generateRelatedForConcept(conceptLabel, category);
      }
      
      // Add compound word parts as related terms (not synonyms)
      const allRelated = [...compoundSynonyms, ...related];
      
      // Filter synonyms/related to avoid exact duplicates
      const validSynonyms = synonyms.filter((syn: string) => !isExactDuplicate(syn, syn.toLowerCase().replace(/[^a-z0-9]+/g, '-')));
      const validRelated = allRelated.filter((rel: string) => !isExactDuplicate(rel, rel.toLowerCase().replace(/[^a-z0-9]+/g, '-')));
      
      // Note: Full opposite checking and semantic similarity validation will happen later
      // in the mapping script (map_existing_synonyms_and_related.ts) which uses embeddings
      // and the concept-opposites.ts mapping. This initial generation is just a baseline.
      
      // Use opposites from the initial Gemini call (already generated, no extra API call needed!)
      // Only use opposites if this concept is actually new (not a duplicate)
      let opposites: string[] = generatedOpposites || [];
      
      if (opposites.length > 0) {
        console.log(`[tagImage] Using ${opposites.length} opposites from initial call for "${conceptLabel}": ${opposites.join(', ')}`);
      } else {
        // Fallback: if no opposites in response, generate them separately
        // This should be rare now, but we ensure every concept gets opposites
        console.warn(`[tagImage] ⚠️  No opposites in initial response for "${conceptLabel}", generating separately...`);
        const { generateOppositesForConcept } = await import('@/lib/gemini');
        try {
          opposites = await generateOppositesForConcept(conceptLabel, category.label);
          if (opposites.length > 0) {
            console.log(`[tagImage] ✅ Generated ${opposites.length} opposites for "${conceptLabel}": ${opposites.join(', ')}`);
          } else {
            console.warn(`[tagImage] ⚠️  Still no opposites generated for "${conceptLabel}" after fallback call`);
          }
        } catch (error: any) {
          // If we hit quota limits, skip opposites generation (non-fatal)
          if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('503')) {
            console.warn(`[tagImage] ⚠️  Skipping opposites for "${conceptLabel}" due to API quota/rate limit`);
          } else {
            console.warn(`[tagImage] ⚠️  Failed to generate opposites for "${conceptLabel}": ${error.message}`);
          }
          // Continue without opposites - don't fail the whole process
        }
      }
      
      // Map image category to applicableCategories
      // Normalize category names: webbdesign -> website, app design -> app, etc.
      const categoryMap: Record<string, string> = {
        'website': 'website',
        'webbdesign': 'website',
        'app': 'app',
        'app design': 'app',
        'fonts': 'fonts',
        'graphic design': 'graphic-design',
        'packaging': 'packaging',
        'branding': 'branding',
        'brand': 'brand',
      };
      const normalizedCategory = categoryMap[imageCategory.toLowerCase()] || 'website';
      const applicableCategories = [normalizedCategory];
      // Set embedding strategy based on category
      // Note: This is generic - any category gets `${category}_style` (except 'fonts' which uses 'generic')
      // New categories automatically get their own style (e.g., 'billboards' → 'billboards_style')
      const embeddingStrategy = normalizedCategory === 'website' ? 'website_style' : 
                                normalizedCategory === 'packaging' ? 'packaging_style' : 
                                normalizedCategory === 'brand' ? 'brand_style' :
                                normalizedCategory === 'fonts' ? 'generic' :
                                `${normalizedCategory}_style`; // Generic fallback works for any new category
      
      newConcepts.push({
        id: conceptId,
        label: conceptLabel,
        synonyms: validSynonyms,
        related: validRelated,
        opposites: opposites || [], // Add opposites to concept (ensure it's always an array)
        category: category.label,
        applicableCategories: applicableCategories,
        embeddingStrategy: embeddingStrategy,
      });
      
      console.log(`[tagImage] Processing concept: "${conceptLabel}" (category: ${category.label})`);
    }
  }
  
  console.log(`[tagImage] Creating ${newConcepts.length} new concepts from image (target: at least 12, one per category)`);
  
  // Create concepts for synonyms and related terms that don't exist yet
  const synonymRelatedConcepts: any[] = [];
  const allExistingIds = new Set<string>();
  const allExistingLabels = new Set<string>();
  
  // Collect all existing concept IDs and labels
  for (const sc of seedConcepts) {
    allExistingIds.add(sc.id.toLowerCase());
    allExistingLabels.add((sc.label || sc.id).toLowerCase());
  }
  for (const nc of newConcepts) {
    allExistingIds.add(nc.id.toLowerCase());
    allExistingLabels.add((nc.label || nc.id).toLowerCase());
  }
  
  // Process all new concepts to find synonyms/related that need to be created
  for (const newConcept of newConcepts) {
    // Process synonyms
    for (const syn of newConcept.synonyms || []) {
      const synLower = syn.toLowerCase();
      const synId = synLower.replace(/[^a-z0-9]+/g, '-');
      
      // Skip if already exists
      if (allExistingIds.has(synId) || allExistingLabels.has(synLower)) {
        continue;
      }
      
      // Create concept for this synonym
      synonymRelatedConcepts.push({
        id: synId,
        label: syn.charAt(0).toUpperCase() + syn.slice(1),
        synonyms: [newConcept.id], // Bidirectional: this synonym also has the main concept as synonym
        related: [],
        opposites: [],
        category: newConcept.category
      });
      
      allExistingIds.add(synId);
      allExistingLabels.add(synLower);
      console.log(`[tagImage]   Creating concept for synonym "${syn}" of "${newConcept.label}"`);
    }
    
    // Process related terms
    for (const rel of newConcept.related || []) {
      const relLower = rel.toLowerCase();
      const relId = relLower.replace(/[^a-z0-9]+/g, '-');
      
      // Skip if already exists
      if (allExistingIds.has(relId) || allExistingLabels.has(relLower)) {
        continue;
      }
      
      // Create concept for this related term
      synonymRelatedConcepts.push({
        id: relId,
        label: rel.charAt(0).toUpperCase() + rel.slice(1),
        synonyms: [],
        related: [newConcept.id], // Bidirectional: this related term also has the main concept as related
        opposites: [],
        category: newConcept.category
      });
      
      allExistingIds.add(relId);
      allExistingLabels.add(relLower);
      console.log(`[tagImage]   Creating concept for related term "${rel}" of "${newConcept.label}"`);
    }
  }
  
  if (synonymRelatedConcepts.length > 0) {
    console.log(`[tagImage] ✅ Created ${synonymRelatedConcepts.length} concepts for synonyms/related terms`);
  }
  
  // Generate OpenAI opposites for new concepts (if any)
  let openAIOppositeConcepts: any[] = [];
  if (newConcepts.length > 0) {
    console.log(`[tagImage] Generating OpenAI opposites for ${newConcepts.length} new concepts...`);
    
    try {
      const { generateOppositeConceptsForNewTag } = await import('@/lib/openai-opposites');
      
      // Build sets of existing concept labels and IDs for filtering
      const existingLabels = new Set<string>();
      const existingIds = new Set<string>();
      for (const sc of seedConcepts) {
        existingLabels.add((sc.label || sc.id).toLowerCase());
        existingIds.add(sc.id.toLowerCase());
      }
      for (const nc of newConcepts) {
        existingLabels.add((nc.label || nc.id).toLowerCase());
        existingIds.add(nc.id.toLowerCase());
      }
      
      // Generate opposites for each new concept
      for (const newConcept of newConcepts) {
        try {
          const oppositeLabels = await generateOppositeConceptsForNewTag(
            newConcept,
            existingLabels,
            existingIds
          );
          
          if (oppositeLabels.length > 0) {
            console.log(`[tagImage] ✅ Generated ${oppositeLabels.length} OpenAI opposites for "${newConcept.label}": ${oppositeLabels.join(', ')}`);
            
            // Import function to find existing concepts
            const { findConceptIdForLabel } = await import('@/lib/update-concept-opposites');
            
            // Process each opposite label
            for (const oppLabel of oppositeLabels) {
              // First, try to find if this label matches an existing concept
              const existingOppConceptId = await findConceptIdForLabel(oppLabel);
              
              if (existingOppConceptId) {
                // Opposite already exists as a concept - link to it
                console.log(`[tagImage]   Linking "${oppLabel}" to existing concept "${existingOppConceptId}"`);
                
                // Check for contradictions: opposite shouldn't be in synonyms or related
                const existingOppConcept = seedConcepts.find((sc: any) => sc.id === existingOppConceptId);
                if (existingOppConcept) {
                  // Remove from synonyms/related if present (contradiction)
                  if (existingOppConcept.synonyms?.includes(newConcept.id)) {
                    existingOppConcept.synonyms = existingOppConcept.synonyms.filter((s: string) => s !== newConcept.id);
                    console.log(`[tagImage]   ⚠️  Removed "${newConcept.label}" from "${oppLabel}" synonyms (contradiction)`);
                  }
                  if (existingOppConcept.related?.includes(newConcept.id)) {
                    existingOppConcept.related = existingOppConcept.related.filter((r: string) => r !== newConcept.id);
                    console.log(`[tagImage]   ⚠️  Removed "${newConcept.label}" from "${oppLabel}" related (contradiction)`);
                  }
                  
                  // Ensure bidirectional opposite link
                  if (!existingOppConcept.opposites) {
                    existingOppConcept.opposites = [];
                  }
                  if (!existingOppConcept.opposites.includes(newConcept.id)) {
                    existingOppConcept.opposites.push(newConcept.id);
                  }
                }
                
                // Add to new concept's opposites
                if (!newConcept.opposites) {
                  newConcept.opposites = [];
                }
                if (!newConcept.opposites.includes(existingOppConceptId)) {
                  newConcept.opposites.push(existingOppConceptId);
                }
              } else {
                // Opposite doesn't exist - create new concept
                const oppId = oppLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                
                // Skip if already in our new concepts list
                if (existingIds.has(oppId) || existingLabels.has(oppLabel.toLowerCase())) {
                  continue;
                }
                
                // Create new opposite concept
                const newOppositeConcept = {
                  id: oppId,
                  label: oppLabel.charAt(0).toUpperCase() + oppLabel.slice(1),
                  synonyms: [],
                  related: [],
                  opposites: [newConcept.id], // Link back to original concept
                  category: newConcept.category
                };
                
                openAIOppositeConcepts.push(newOppositeConcept);
                existingIds.add(oppId);
                existingLabels.add(oppLabel.toLowerCase());
                
                // Add to new concept's opposites
                if (!newConcept.opposites) {
                  newConcept.opposites = [];
                }
                if (!newConcept.opposites.includes(oppId)) {
                  newConcept.opposites.push(oppId);
                }
              }
            }
          } else {
            console.log(`[tagImage] ⚠️  No OpenAI opposites generated for "${newConcept.label}"`);
          }
        } catch (error: any) {
          // Non-fatal: continue even if OpenAI fails for one concept
          console.warn(`[tagImage] ⚠️  Failed to generate OpenAI opposites for "${newConcept.label}": ${error.message}`);
        }
      }
      
      if (openAIOppositeConcepts.length > 0) {
        console.log(`[tagImage] ✅ Created ${openAIOppositeConcepts.length} new opposite concepts from OpenAI`);
      }
    } catch (error: any) {
      // Non-fatal: continue even if OpenAI integration fails
      console.warn(`[tagImage] ⚠️  OpenAI opposites generation failed (non-fatal): ${error.message}`);
    }
  }
  
  // Add new concepts to seed file (including OpenAI-generated opposites and synonym/related concepts)
  if (newConcepts.length > 0 || openAIOppositeConcepts.length > 0 || synonymRelatedConcepts.length > 0) {
    const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
    
    // Ensure all opposites are properly set before saving
    // OpenAI opposites are already linked bidirectionally in memory
    // Now merge everything into seedConcepts
    seedConcepts.push(...newConcepts, ...openAIOppositeConcepts, ...synonymRelatedConcepts);
    
    // Sort by category then label
    seedConcepts.sort((a, b) => {
      const catA = a.category || '';
      const catB = b.category || '';
      if (catA !== catB) return catA.localeCompare(catB);
      return a.label.localeCompare(b.label);
    });
    
    await fs.writeFile(seedPath, JSON.stringify(seedConcepts, null, 2));
    console.log(`[tagImage] ✅ Saved ${newConcepts.length} new concepts, ${openAIOppositeConcepts.length} OpenAI opposites, and ${synonymRelatedConcepts.length} synonym/related concepts to seed file`);
    
    // Embed and create new concepts in database
    // Process all new concepts (main concepts, opposites, and synonym/related concepts)
    const allNewConcepts = [...newConcepts, ...openAIOppositeConcepts, ...synonymRelatedConcepts];
    
    for (const newConcept of allNewConcepts) {
      // Use centralized embedding generation to ensure consistency
      const { generateConceptEmbedding } = await import('@/lib/concept-embeddings');
      let emb: number[];
      try {
        emb = await generateConceptEmbedding(
          newConcept.label,
          newConcept.synonyms || [],
          newConcept.related || []
        );
      } catch (error: any) {
        console.warn(`[tagImage] No embeddings for new concept ${newConcept.id}: ${error.message}`);
        continue;
      }
      
      // Convert opposite labels to concept IDs for database storage
      // We'll use the same conversion logic that updateConceptOpposites uses
      const oppositeIds: string[] = [];
      if (newConcept.opposites && newConcept.opposites.length > 0) {
        // For now, use normalized IDs - updateConceptOpposites will do proper lookup later
        // and update both the file and database
        for (const oppLabel of newConcept.opposites) {
          // Convert label to concept ID format (normalized)
          const oppId = oppLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (oppId !== newConcept.id && oppId.length > 0) {
            oppositeIds.push(oppId);
          }
        }
      }
      
      // Set defaults for category metadata
      const applicableCategories = (newConcept as any).applicableCategories || ['website'];
      const embeddingStrategy = (newConcept as any).embeddingStrategy || 'website_style';
      
      await prisma.concept.upsert({
        where: { id: newConcept.id },
        update: {
          label: newConcept.label,
          locale: 'en',
          synonyms: newConcept.synonyms,
          related: newConcept.related,
          opposites: oppositeIds.length > 0 ? oppositeIds : undefined,
          weight: 1.0,
          embedding: emb,
        },
        create: {
          id: newConcept.id,
          label: newConcept.label,
          locale: 'en',
          synonyms: newConcept.synonyms,
          related: newConcept.related,
          opposites: oppositeIds.length > 0 ? oppositeIds : undefined,
          weight: 1.0,
          embedding: emb,
        }
      });
      
      // Update concept-opposites.ts with opposites (Gemini + OpenAI)
      if (newConcept.opposites && newConcept.opposites.length > 0) {
        try {
          const { updateConceptOpposites } = await import('@/lib/update-concept-opposites');
          // updateConceptOpposites expects labels, but we have IDs - convert back to labels for existing concepts
          // For new concepts, IDs are the same as normalized labels, so we can pass them directly
          await updateConceptOpposites(newConcept.id, newConcept.opposites);
        } catch (error: any) {
          console.warn(`[tagImage] Failed to update concept-opposites.ts for "${newConcept.label}": ${error.message}`);
          // Continue - don't fail the whole process
        }
      }
      
      console.log(`[tagImage] Created new concept: ${newConcept.label} (${newConcept.category})`);
    }
    
    // Note: OpenAI opposite concepts and synonym/related concepts are already processed in the allNewConcepts loop above
    
    // Generate opposites for ALL new concepts that don't have opposites yet
    // This ensures EVERY concept gets opposites, regardless of whether it has synonyms
    console.log(`[tagImage] Checking for concepts missing opposites...`);
    try {
      const { generateOppositesForConceptWithSynonyms, generateOppositeConceptsForNewTag } = await import('@/lib/openai-opposites');
      
      // Build sets of existing concept labels and IDs for filtering
      const existingLabels = new Set<string>();
      const existingIds = new Set<string>();
      for (const sc of seedConcepts) {
        existingLabels.add((sc.label || sc.id).toLowerCase());
        existingIds.add(sc.id.toLowerCase());
      }
      
      let oppositesGenerated = 0;
      for (const newConcept of newConcepts) {
        const hasSynonyms = newConcept.synonyms && newConcept.synonyms.length > 0;
        const hasOpposites = newConcept.opposites && newConcept.opposites.length > 0;
        
        // Skip if already has opposites
        if (hasOpposites) {
          continue;
        }
        
        // If concept has synonyms but no opposites, generate them using the synonyms-aware function
        if (hasSynonyms) {
          try {
            console.log(`[tagImage] Generating opposites for "${newConcept.label}" (has ${newConcept.synonyms.length} synonyms but no opposites)...`);
            const oppositeLabels = await generateOppositesForConceptWithSynonyms(
              newConcept,
              existingLabels,
              existingIds,
              true // Allow existing concepts as opposites
            );
            
            if (oppositeLabels.length > 0) {
              // Import function to find existing concepts
              const { findConceptIdForLabel } = await import('@/lib/update-concept-opposites');
              
              // Add opposites to the concept
              if (!newConcept.opposites) {
                newConcept.opposites = [];
              }
              
              // Process each opposite label - check if it matches existing concepts
              for (const oppLabel of oppositeLabels) {
                // Try to find if this label matches an existing concept
                const existingOppConceptId = await findConceptIdForLabel(oppLabel);
                
                if (existingOppConceptId) {
                  // Opposite already exists - link to it and check for contradictions
                  const existingOppConcept = seedConcepts.find((sc: any) => sc.id === existingOppConceptId);
                  if (existingOppConcept) {
                    // Remove from synonyms/related if present (contradiction)
                    if (existingOppConcept.synonyms?.includes(newConcept.id)) {
                      existingOppConcept.synonyms = existingOppConcept.synonyms.filter((s: string) => s !== newConcept.id);
                      console.log(`[tagImage]   ⚠️  Removed "${newConcept.label}" from "${oppLabel}" synonyms (contradiction)`);
                    }
                    if (existingOppConcept.related?.includes(newConcept.id)) {
                      existingOppConcept.related = existingOppConcept.related.filter((r: string) => r !== newConcept.id);
                      console.log(`[tagImage]   ⚠️  Removed "${newConcept.label}" from "${oppLabel}" related (contradiction)`);
                    }
                    
                    // Ensure bidirectional opposite link
                    if (!existingOppConcept.opposites) {
                      existingOppConcept.opposites = [];
                    }
                    if (!existingOppConcept.opposites.includes(newConcept.id)) {
                      existingOppConcept.opposites.push(newConcept.id);
                    }
                  }
                  
                  // Add to new concept's opposites
                  if (existingOppConceptId !== newConcept.id && !newConcept.opposites.includes(existingOppConceptId)) {
                    newConcept.opposites.push(existingOppConceptId);
                    console.log(`[tagImage]   Linked "${oppLabel}" to existing concept "${existingOppConceptId}"`);
                  }
                } else {
                  // Opposite doesn't exist - use normalized ID
                  const oppId = oppLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  if (oppId !== newConcept.id && oppId.length > 0 && !newConcept.opposites.includes(oppId)) {
                    newConcept.opposites.push(oppId);
                  }
                }
              }
              
              oppositesGenerated++;
              console.log(`[tagImage] ✅ Generated ${oppositeLabels.length} opposites for "${newConcept.label}": ${oppositeLabels.join(', ')}`);
              
              // Update database record with newly generated opposites
              if (newConcept.opposites && newConcept.opposites.length > 0) {
                await prisma.concept.update({
                  where: { id: newConcept.id },
                  data: { opposites: newConcept.opposites }
                });
              }
            }
          } catch (error: any) {
            // Non-fatal: continue even if OpenAI fails for one concept
            console.warn(`[tagImage] ⚠️  Failed to generate opposites for "${newConcept.label}": ${error.message}`);
          }
        } else {
          // Concept has NO synonyms but also no opposites - generate them anyway
          // This ensures EVERY new concept gets opposites
          try {
            console.log(`[tagImage] Generating opposites for "${newConcept.label}" (no synonyms, no opposites)...`);
            const oppositeLabels = await generateOppositeConceptsForNewTag(
              newConcept,
              existingLabels,
              existingIds,
              3 // max retries
            );
            
            if (oppositeLabels.length > 0) {
              // Import function to find existing concepts
              const { findConceptIdForLabel } = await import('@/lib/update-concept-opposites');
              
              // Add opposites to the concept
              if (!newConcept.opposites) {
                newConcept.opposites = [];
              }
              
              // Process each opposite label - check if it matches existing concepts
              for (const oppLabel of oppositeLabels) {
                // Try to find if this label matches an existing concept
                const existingOppConceptId = await findConceptIdForLabel(oppLabel);
                
                if (existingOppConceptId) {
                  // Opposite already exists - link to it and check for contradictions
                  const existingOppConcept = seedConcepts.find((sc: any) => sc.id === existingOppConceptId);
                  if (existingOppConcept) {
                    // Remove from synonyms/related if present (contradiction)
                    if (existingOppConcept.synonyms?.includes(newConcept.id)) {
                      existingOppConcept.synonyms = existingOppConcept.synonyms.filter((s: string) => s !== newConcept.id);
                      console.log(`[tagImage]   ⚠️  Removed "${newConcept.label}" from "${oppLabel}" synonyms (contradiction)`);
                    }
                    if (existingOppConcept.related?.includes(newConcept.id)) {
                      existingOppConcept.related = existingOppConcept.related.filter((r: string) => r !== newConcept.id);
                      console.log(`[tagImage]   ⚠️  Removed "${newConcept.label}" from "${oppLabel}" related (contradiction)`);
                    }
                    
                    // Ensure bidirectional opposite link
                    if (!existingOppConcept.opposites) {
                      existingOppConcept.opposites = [];
                    }
                    if (!existingOppConcept.opposites.includes(newConcept.id)) {
                      existingOppConcept.opposites.push(newConcept.id);
                    }
                  }
                  
                  // Add to new concept's opposites
                  if (existingOppConceptId !== newConcept.id && !newConcept.opposites.includes(existingOppConceptId)) {
                    newConcept.opposites.push(existingOppConceptId);
                    console.log(`[tagImage]   Linked "${oppLabel}" to existing concept "${existingOppConceptId}"`);
                  }
                } else {
                  // Opposite doesn't exist - use normalized ID
                  const oppId = oppLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  if (oppId !== newConcept.id && oppId.length > 0 && !newConcept.opposites.includes(oppId)) {
                    newConcept.opposites.push(oppId);
                  }
                }
              }
              
              oppositesGenerated++;
              console.log(`[tagImage] ✅ Generated ${oppositeLabels.length} opposites for "${newConcept.label}": ${oppositeLabels.join(', ')}`);
              
              // Update database record with newly generated opposites
              if (newConcept.opposites && newConcept.opposites.length > 0) {
                await prisma.concept.update({
                  where: { id: newConcept.id },
                  data: { opposites: newConcept.opposites }
                });
              }
            }
          } catch (error: any) {
            // Non-fatal: continue even if OpenAI fails for one concept
            console.warn(`[tagImage] ⚠️  Failed to generate opposites for "${newConcept.label}": ${error.message}`);
          }
        }
      }
      
      if (oppositesGenerated > 0) {
        console.log(`[tagImage] ✅ Generated opposites for ${oppositesGenerated} concepts that were missing opposites`);
        
        // Re-save seed file with updated opposites
        await fs.writeFile(seedPath, JSON.stringify(seedConcepts, null, 2));
      }
    } catch (error: any) {
      // Non-fatal: continue even if this step fails
      console.warn(`[tagImage] ⚠️  Failed to generate opposites for concepts with synonyms: ${error.message}`);
    }
    
    // Final sync: Fully align concept-opposites.ts with seed_concepts.json
    // This ensures the TypeScript file is completely in sync with the JSON file
    // after all opposites have been enriched
    console.log(`[tagImage] Performing full sync of concept-opposites.ts from seed_concepts.json...`);
    try {
      const { syncOppositesFromSeed } = await import('@/lib/update-concept-opposites');
      await syncOppositesFromSeed();
      console.log(`[tagImage] ✅ Fully synced concept-opposites.ts from seed_concepts.json`);
    } catch (error: any) {
      console.warn(`[tagImage] ⚠️  Failed to sync concept-opposites.ts: ${error.message}`);
      
      // Fallback: sync individual concepts if full sync fails
      console.log(`[tagImage] Falling back to individual concept sync...`);
      try {
        const { updateConceptOpposites, clearConceptsCache } = await import('@/lib/update-concept-opposites');
        clearConceptsCache();
        
        // Sync all new concepts with their opposites
        for (const newConcept of newConcepts) {
          if (newConcept.opposites && newConcept.opposites.length > 0) {
            await updateConceptOpposites(newConcept.id, newConcept.opposites);
          }
        }
        
        // Sync all OpenAI-generated opposite concepts
        for (const oppConcept of openAIOppositeConcepts) {
          if (oppConcept.opposites && oppConcept.opposites.length > 0) {
            await updateConceptOpposites(oppConcept.id, oppConcept.opposites);
          }
        }
        
        console.log(`[tagImage] ✅ Synced individual concepts to concept-opposites.ts`);
      } catch (fallbackError: any) {
        console.warn(`[tagImage] ⚠️  Fallback sync also failed: ${fallbackError.message}`);
      }
    }
    
    console.log(`[tagImage] ✅ Created ${newConcepts.length} new abstract concepts from image`);
    if (openAIOppositeConcepts.length > 0) {
      console.log(`[tagImage] ✅ Created ${openAIOppositeConcepts.length} OpenAI-generated opposite concepts`);
    }
    if (synonymRelatedConcepts.length > 0) {
      console.log(`[tagImage] ✅ Created ${synonymRelatedConcepts.length} concepts for synonyms/related terms`);
    }
    return [...newConcepts.map((nc: any) => nc.id), ...openAIOppositeConcepts.map((oc: any) => oc.id), ...synonymRelatedConcepts.map((src: any) => src.id)];
  }
  
  return [];
}

// Helper functions for generating synonyms and related terms
function generateSynonymsForConcept(example: string, category: any): string[] {
  const synonyms: string[] = [];
  const lower = example.toLowerCase();
  
  if (lower.endsWith('y')) {
    synonyms.push(example.slice(0, -1) + 'ic');
    synonyms.push(example.slice(0, -1) + 'ical');
  }
  
  synonyms.push(lower);
  if (lower !== example.toLowerCase()) {
    synonyms.push(example.toLowerCase());
  }
  
  return Array.from(new Set(synonyms)).slice(0, 10);
}

function generateRelatedForConcept(example: string, category: any): string[] {
  const related: string[] = [];
  
  // Add other examples from the same category
  const otherExamples = category.examples.filter((e: string) => e !== example).slice(0, 5);
  related.push(...otherExamples);
  
  return Array.from(new Set(related)).slice(0, 10);
}

export async function enqueueTaggingJob(imageId: string) {
  // Simple in-process queue: run soon and detach
  setImmediate(() => {
    tagImage(imageId).catch(err => {
      console.error('[tagImage] failed', err);
    });
  });
}


