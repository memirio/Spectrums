// scripts/list_gemini_rest.ts
// List available Gemini models using REST API

import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

async function listModels() {
  try {
    // Try v1 API instead of v1beta
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error (${response.status}):`, errorText);
      return;
    }
    
    const data = await response.json();
    
    if (data.models && Array.isArray(data.models)) {
      console.log(`✅ Found ${data.models.length} models:\n`);
      for (const model of data.models) {
        const methods = model.supportedGenerationMethods || [];
        const hasVision = methods.includes('generateContent');
        console.log(`  ${model.name}${hasVision ? ' ✅ (vision)' : ''}`);
        if (methods.length > 0) {
          console.log(`    Methods: ${methods.join(', ')}`);
        }
      }
    } else {
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

listModels();

