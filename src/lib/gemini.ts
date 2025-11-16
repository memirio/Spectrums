// src/lib/gemini.ts
// Google Gemini API for vision-language generation
// 
// Uses GEMINI_API_KEY for concept generation and tagging
// (Query expansion uses GEMINI_QUERY_EXPANSION_API_KEY - see query-expansion.ts)

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

/**
 * Generate opposite/excluding tags for a given concept using Gemini
 * Returns an array of concept labels that contradict or exclude the given concept
 */
export async function generateOppositesForConcept(
  conceptLabel: string,
  category?: string
): Promise<string[]> {
  const client = getGeminiClient();
  const modelName = 'gemini-2.5-flash';
  const model = client.getGenerativeModel({ model: modelName });

  const categoryContext = category ? ` in the category "${category}"` : '';
  
  const prompt = `Generate opposite or excluding tags for the concept "${conceptLabel}"${categoryContext}.

An opposite/excluding tag is a concept that contradicts or excludes the given concept. EVERY concept has opposites - think creatively about antonyms, contradictions, or excluding concepts.

Examples:
- "3D" → ["flat", "2D", "planar", "dimensional"]
- "Vibrant" → ["muted", "desaturated", "monochrome", "colorless"]
- "Minimal" → ["maximal", "dense", "cluttered", "busy"]
- "Static" → ["animated", "dynamic", "kinetic", "motion"]
- "Luxury" → ["modesty", "poverty", "austerity", "economy"]
- "Balance" → ["imbalance", "asymmetry", "discord", "chaos"]
- "Modular" → ["monolithic", "unified", "integrated", "seamless"]
- "Horology" → ["digital", "casual", "informal", "ephemeral"]
- "Geometric" → ["organic", "fluid", "amorphous", "irregular"]
- "Professional" → ["casual", "informal", "relaxed", "playful"]

CRITICAL RULES:
1. **MANDATORY: Generate 2-5 opposite tags (prefer 3-4). NO EXCEPTIONS.**
2. Use SINGLE WORDS whenever possible
3. Focus on true opposites/contradictions, not just different concepts
4. Be specific and relevant to design/visual concepts
5. If you think a concept has no opposites, think harder: consider antonyms, contradictions, or concepts that exclude each other

Return ONLY a JSON array of strings. Format:
["opposite1", "opposite2", "opposite3"]`;

  try {
    const result = await model.generateContent([prompt]);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const opposites = JSON.parse(jsonText);
    
    // Validate it's an array
    if (!Array.isArray(opposites)) {
      throw new Error('Expected array of opposites');
    }

    // Normalize: trim, filter empty, ensure strings
    const normalized = opposites
      .map((item: any) => typeof item === 'string' ? item.trim() : String(item).trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 5); // Limit to 5 opposites max

    return normalized;
  } catch (error: any) {
    console.error(`[gemini] Error generating opposites for "${conceptLabel}":`, error.message);
    // Return empty array on error - don't fail the whole process
    return [];
  }
}

/**
 * Generate abstract concept labels for an image across 12 categories
 * This is truly generative - creates new concepts without looking at existing examples
 */
export async function generateAbstractConceptsFromImage(
  imageBuffer: Buffer,
  mimeType: string = 'image/png'
): Promise<Record<string, Array<{ concept: string; opposites: string[] }>>> {
  const client = getGeminiClient();
  // Use gemini-2.5-flash (latest flash model with vision support)
  // Model name should be without "models/" prefix for the SDK
  const modelName = 'gemini-2.5-flash';
  const model = client.getGenerativeModel({ model: modelName });

  const prompt = `Analyze this website screenshot and generate abstract concept labels for each of these 12 categories, along with opposite/excluding tags for each concept.

CRITICAL RULES:
1. Prefer SINGLE WORDS whenever possible (e.g., "Bloom" not "Digital Bloom", "Glow" not "Diffused Glow")
2. If a compound concept is needed, use the core word as the label and put modifiers in synonyms
3. Generate AT LEAST 1 concept per category, preferably 2-3 concepts per category when the image has multiple qualities
4. Be compact and simple - avoid long phrases
5. **MANDATORY: EVERY concept MUST have 2-5 opposite/excluding tags. NO EXCEPTIONS. Every concept has opposites - think creatively about contradictions, antonyms, or excluding concepts.**

The concepts should be:
- Abstract and descriptive (not literal descriptions)
- Specific to what this image actually shows
- Creative and unique (avoid generic terms)
- SINGLE WORDS preferred (use synonyms for compound terms)

Opposites should be:
- True contradictions, antonyms, or excluding concepts (e.g., "3D" → ["flat", "2D"], "Vibrant" → ["muted", "desaturated"], "Luxury" → ["modesty", "poverty", "austerity"], "Modular" → ["monolithic", "unified", "integrated"], "Horology" → ["digital", "casual", "informal"])
- Single words when possible
- Relevant to design/visual concepts
- Think creatively: every concept has opposites - consider antonyms, contradictions, or concepts that exclude each other

Categories and what to generate for each:
1. **Feeling / Emotion**: What emotional AND physical feelings does this design evoke? Generate BOTH an emotional feeling (e.g., "Serene", "Anxious", "Euphoric") AND a physical feeling (e.g., "Tension", "Relaxation", "Warmth", "Lightness")
2. **Vibe / Mood**: What is the overall atmospheric tone? (e.g., "Dreamlike", "Futuristic", "Nostalgic")
3. **Philosophical / Existential**: What abstract idea does it embody? (e.g., "Impermanence", "Duality", "Transcendence")
4. **Aesthetic / Formal**: What compositional quality stands out? (e.g., "Harmony", "Asymmetry", "Rhythm")
5. **Natural / Metaphysical**: What natural or cosmic concept does it reflect? (e.g., "Growth", "Stillness", "Flow")
6. **Social / Cultural**: What societal concept does it engage with? (e.g., "Modernity", "Sustainability", "Identity")
7. **Design Style**: What aesthetic movement or style does it reference? (e.g., "Brutalist", "Organic", "Postmodern")
8. **Color & Tone**: What chromatic quality defines it? (e.g., "Muted", "Vibrant", "Monochrome")
9. **Texture & Materiality**: What tactile quality does it suggest? (e.g., "Matte", "Layered", "Fluid")
10. **Form & Structure**: What structural principle governs it? (e.g., "Grid", "Flow", "Modularity")
11. **Design Technique**: What method or medium appears to be used? (e.g., "Rendering", "Illustration", "Photography")
12. **Industry**: What industry or business sector does this design represent or target? Generate BOTH the overall industry AND a specific sector. (e.g., ["Finance", "Banking"], ["Technology", "SaaS"], ["Healthcare", "Telemedicine"], ["Fashion", "Luxury"])

Return ONLY a JSON object. Each category can have ONE concept (string) or MULTIPLE concepts (array of strings). For each concept, include its opposites.

Format (with opposites - EVERY concept MUST have opposites):
{
  "feeling-emotion": [{"concept": "Serene", "opposites": ["Anxious", "Tension"]}, {"concept": "Relaxation", "opposites": ["Tension", "Stress"]}],
  "vibe-mood": [{"concept": "Dreamlike", "opposites": ["Realistic", "Concrete"]}],
  "philosophical-existential": {"concept": "Duality", "opposites": ["Unity", "Singularity"]},
  "aesthetic-formal": [{"concept": "Harmony", "opposites": ["Chaos", "Discord"]}, {"concept": "Balance", "opposites": ["Imbalance", "Asymmetry"]}],
  "natural-metaphysical": {"concept": "Flow", "opposites": ["Stagnation", "Stillness"]},
  "social-cultural": {"concept": "Modernity", "opposites": ["Tradition", "Classical"]},
  "design-style": {"concept": "Brutalist", "opposites": ["Organic", "Soft"]},
  "color-tone": {"concept": "Vibrant", "opposites": ["Muted", "Desaturated"]},
  "texture-materiality": {"concept": "Matte", "opposites": ["Glossy", "Shiny"]},
  "form-structure": [{"concept": "Grid", "opposites": ["Organic", "Fluid"]}, {"concept": "Modularity", "opposites": ["Monolithic", "Unified", "Integrated"]}],
  "design-technique": {"concept": "Rendering", "opposites": ["Photography", "Hand-drawn"]},
  "industry": [{"concept": "Finance", "opposites": ["Non-profit", "Charity", "Austerity"]}, {"concept": "Banking", "opposites": ["Cashless", "Digital-only", "Informal"]}, {"concept": "Luxury", "opposites": ["Modesty", "Poverty", "Austerity"]}]
}

CRITICAL: EVERY SINGLE CONCEPT MUST HAVE AT LEAST 2 OPPOSITES. NO EMPTY ARRAYS. NO EXCEPTIONS.
- If you think a concept has no opposites, think harder: consider antonyms, contradictions, or excluding concepts
- Examples: "Luxury" → ["modesty", "poverty", "austerity"], "Modular" → ["monolithic", "unified", "integrated"], "Horology" → ["digital", "casual", "informal"], "Balance" → ["imbalance", "asymmetry", "discord", "chaos"]

IMPORTANT: 
- Generate at least 1 concept per category (prefer 2-3 when the image has multiple distinct qualities)
- For Industry category: ALWAYS generate at least 2 concepts - the overall industry (e.g., "Finance") AND a specific sector (e.g., "Banking")
- For Feeling/Emotion category: ALWAYS generate at least 2 concepts - an emotional feeling (e.g., "Serene", "Anxious") AND a physical feeling (e.g., "Relaxation", "Tension", "Warmth", "Lightness")
- Use SINGLE WORDS - if you think "Digital Bloom", use "Bloom" and add "Digital" to synonyms later
- Keep it compact and simple`;

  try {
    // Convert buffer to base64 for Gemini API
    const base64Image = imageBuffer.toString('base64');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    // Parse JSON from response (might have markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const concepts = JSON.parse(jsonText);

    // Validate all 12 categories are present and have at least 1 concept
    const requiredCategories = [
      'feeling-emotion',
      'vibe-mood',
      'philosophical-existential',
      'aesthetic-formal',
      'natural-metaphysical',
      'social-cultural',
      'design-style',
      'color-tone',
      'texture-materiality',
      'form-structure',
      'design-technique',
      'industry',
    ];

    // Normalize concepts and extract opposites
    const normalizedConcepts: Record<string, Array<{ concept: string; opposites: string[] }>> = {};
    
    for (const cat of requiredCategories) {
      if (!concepts[cat]) {
        throw new Error(`Missing concept for category: ${cat}`);
      }
      
      const normalized: Array<{ concept: string; opposites: string[] }> = [];
      
      // Handle different response formats
      if (typeof concepts[cat] === 'string') {
        // Simple string format - no opposites provided
        const concept = concepts[cat].trim();
        if (concept.length > 0) {
          normalized.push({ concept, opposites: [] });
        }
      } else if (Array.isArray(concepts[cat])) {
        // Array format - could be strings or objects with opposites
        for (const item of concepts[cat]) {
          if (typeof item === 'string') {
            // Simple string in array
            const concept = item.trim();
            if (concept.length > 0) {
              normalized.push({ concept, opposites: [] });
            }
          } else if (typeof item === 'object' && item !== null) {
            // Object with concept and opposites
            const concept = (item.concept || item.label || String(item)).trim();
            const opposites = Array.isArray(item.opposites) 
              ? item.opposites.map((o: any) => String(o).trim()).filter((o: string) => o.length > 0)
              : [];
            if (concept.length > 0) {
              normalized.push({ concept, opposites });
            }
          }
        }
      } else if (typeof concepts[cat] === 'object' && concepts[cat] !== null) {
        // Single object format
        const item = concepts[cat] as any;
        const concept = (item.concept || item.label || String(item)).trim();
        const opposites = Array.isArray(item.opposites) 
          ? item.opposites.map((o: any) => String(o).trim()).filter((o: string) => o.length > 0)
          : [];
        if (concept.length > 0) {
          normalized.push({ concept, opposites });
        }
      } else {
        throw new Error(`Invalid concept format for category: ${cat} (expected string, array, or object)`);
      }
      
      // Ensure at least 1 concept after normalization
      if (normalized.length === 0) {
        throw new Error(`Empty concept array for category: ${cat} after normalization`);
      }
      
      normalizedConcepts[cat] = normalized;
    }

    // VALIDATION: Ensure 100% coverage - generate opposites for any concepts missing them
    const conceptsNeedingOpposites: Array<{ concept: string; category: string }> = [];
    for (const [cat, conceptList] of Object.entries(normalizedConcepts)) {
      for (const { concept, opposites } of conceptList) {
        if (opposites.length === 0) {
          conceptsNeedingOpposites.push({ concept, category: cat });
        }
      }
    }

    // Generate opposites for any concepts that are missing them
    if (conceptsNeedingOpposites.length > 0) {
      console.log(`[gemini] ⚠️  ${conceptsNeedingOpposites.length} concept(s) missing opposites, generating them now...`);
      for (const { concept, category } of conceptsNeedingOpposites) {
        try {
          const opposites = await generateOppositesForConcept(concept, category);
          if (opposites.length > 0) {
            // Find and update the concept in normalizedConcepts
            const conceptList = normalizedConcepts[category];
            const conceptIndex = conceptList.findIndex(c => c.concept === concept);
            if (conceptIndex !== -1) {
              conceptList[conceptIndex].opposites = opposites;
              console.log(`[gemini] ✅ Generated ${opposites.length} opposites for "${concept}": ${opposites.join(', ')}`);
            }
          }
        } catch (error: any) {
          console.warn(`[gemini] ⚠️  Failed to generate opposites for "${concept}": ${error.message}`);
          // Continue - we'll still return the concept without opposites rather than failing
        }
      }
    }

    // Final validation: verify all concepts now have opposites
    let missingCount = 0;
    for (const conceptList of Object.values(normalizedConcepts)) {
      for (const { concept, opposites } of conceptList) {
        if (opposites.length === 0) {
          missingCount++;
          console.warn(`[gemini] ⚠️  Concept "${concept}" still has no opposites after fallback`);
        }
      }
    }

    if (missingCount === 0) {
      console.log(`[gemini] ✅ All concepts have opposites (100% coverage)`);
    } else {
      console.warn(`[gemini] ⚠️  ${missingCount} concept(s) still missing opposites`);
    }

    return normalizedConcepts;
  } catch (error: any) {
    console.error('[gemini] Error generating concepts:', error.message);
    throw new Error(`Failed to generate concepts: ${error.message}`);
  }
}

