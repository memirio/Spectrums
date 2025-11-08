// scripts/list_gemini_models.ts
// List available Gemini models

import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is required');
    process.exit(1);
  }

  const client = new GoogleGenerativeAI(apiKey);
  
  try {
    const models = await client.listModels();
    console.log('Available models:');
    for (const model of models) {
      console.log(`  - ${model.name}`);
      if (model.supportedGenerationMethods) {
        console.log(`    Supports: ${model.supportedGenerationMethods.join(', ')}`);
      }
    }
  } catch (error: any) {
    console.error('Error listing models:', error.message);
  }
}

listModels();

