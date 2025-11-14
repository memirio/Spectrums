// src/lib/gemini.ts
// Google Gemini API for vision-language generation

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

An opposite/excluding tag is a concept that contradicts or excludes the given concept. For example:
- If the concept is "3D", opposites could be: "flat", "2D", "1D", "planar"
- If the concept is "Vibrant", opposites could be: "muted", "desaturated", "monochrome", "colorless"
- If the concept is "Minimal", opposites could be: "maximal", "dense", "cluttered", "busy"
- If the concept is "Static", opposites could be: "animated", "dynamic", "kinetic", "motion"

CRITICAL RULES:
1. Generate 2-5 opposite tags (prefer 3-4)
2. Use SINGLE WORDS whenever possible
3. Focus on true opposites/contradictions, not just different concepts
4. Be specific and relevant to design/visual concepts

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
): Promise<Record<string, string>> {
  const client = getGeminiClient();
  // Use gemini-2.5-flash (latest flash model with vision support)
  // Model name should be without "models/" prefix for the SDK
  const modelName = 'gemini-2.5-flash';
  const model = client.getGenerativeModel({ model: modelName });

  const prompt = `Analyze this website screenshot and generate abstract concept labels for each of these 12 categories.

CRITICAL RULES:
1. Prefer SINGLE WORDS whenever possible (e.g., "Bloom" not "Digital Bloom", "Glow" not "Diffused Glow")
2. If a compound concept is needed, use the core word as the label and put modifiers in synonyms
3. Generate AT LEAST 1 concept per category, preferably 2-3 concepts per category when the image has multiple qualities
4. Be compact and simple - avoid long phrases

The concepts should be:
- Abstract and descriptive (not literal descriptions)
- Specific to what this image actually shows
- Creative and unique (avoid generic terms)
- SINGLE WORDS preferred (use synonyms for compound terms)

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

Return ONLY a JSON object. Each category can have ONE concept (string) or MULTIPLE concepts (array of strings).
Format:
{
  "feeling-emotion": ["Serene", "Relaxation"] OR ["Anxious", "Tension"] OR ["Euphoric", "Lightness"],
  "vibe-mood": "Dreamlike" OR ["Futuristic", "Ethereal"],
  "philosophical-existential": "Duality",
  "aesthetic-formal": ["Harmony", "Balance"],
  "natural-metaphysical": "Flow",
  "social-cultural": "Modernity",
  "design-style": "Brutalist",
  "color-tone": "Vibrant",
  "texture-materiality": "Matte",
  "form-structure": ["Grid", "Modularity"],
  "design-technique": "Rendering",
  "industry": ["Finance", "Banking"] OR ["Technology", "SaaS"] OR ["Healthcare", "Telemedicine"]
}

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

    for (const cat of requiredCategories) {
      if (!concepts[cat]) {
        throw new Error(`Missing concept for category: ${cat}`);
      }
      
      // Normalize: convert strings to arrays, handle comma-separated strings
      if (typeof concepts[cat] === 'string') {
        // If it's a comma-separated string, split it; otherwise make it an array
        if (concepts[cat].includes(',')) {
          concepts[cat] = concepts[cat].split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        } else {
          concepts[cat] = [concepts[cat].trim()];
        }
      } else if (Array.isArray(concepts[cat])) {
        // Ensure all items are strings and trim them
        concepts[cat] = concepts[cat]
          .map((item: any) => typeof item === 'string' ? item.trim() : String(item).trim())
          .filter((s: string) => s.length > 0);
      } else {
        throw new Error(`Invalid concept format for category: ${cat} (expected string or array)`);
      }
      
      // Ensure at least 1 concept after normalization
      if (concepts[cat].length === 0) {
        throw new Error(`Empty concept array for category: ${cat} after normalization`);
      }
    }

    return concepts;
  } catch (error: any) {
    console.error('[gemini] Error generating concepts:', error.message);
    throw new Error(`Failed to generate concepts: ${error.message}`);
  }
}

