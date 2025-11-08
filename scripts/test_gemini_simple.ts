// scripts/test_gemini_simple.ts
// Simple test to find the correct Gemini model name

import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

const client = new GoogleGenerativeAI(apiKey);

// Try different model names
const modelNames = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-pro-vision',
  'gemini-1.0-pro',
];

async function testModel(modelName: string) {
  try {
    console.log(`Testing model: ${modelName}...`);
    const model = client.getGenerativeModel({ model: modelName });
    
    // Simple text-only test first
    const result = await model.generateContent('Say hello');
    const text = result.response.text();
    console.log(`✅ ${modelName} works! Response: ${text.substring(0, 50)}...`);
    return true;
  } catch (error: any) {
    console.log(`❌ ${modelName} failed:`);
    console.log(`   ${error.message}`);
    if (error.stack) {
      const stackLines = error.stack.split('\n');
      if (stackLines.length > 1) {
        console.log(`   ${stackLines[1].trim()}`);
      }
    }
    return false;
  }
}

async function main() {
  console.log('Testing available Gemini models...\n');
  
  for (const modelName of modelNames) {
    await testModel(modelName);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
  
  console.log('\n📝 Check the output above for which model works!');
}

main();

