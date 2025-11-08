// scripts/test_gemini_concepts.ts
// Test script to verify Gemini concept generation

import 'dotenv/config';
import { generateAbstractConceptsFromImage } from '../src/lib/gemini';
import { prisma } from '../src/lib/prisma';
import * as fs from 'fs/promises';
import * as path from 'path';

async function testWithImageBuffer(imageBuffer: Buffer) {
  console.log('🧪 Testing Gemini concept generation...\n');
  console.log(`Image size: ${imageBuffer.length} bytes\n`);

  try {
    const concepts = await generateAbstractConceptsFromImage(imageBuffer, 'image/png');
    
    console.log('✅ Successfully generated concepts:\n');
    for (const [category, label] of Object.entries(concepts)) {
      console.log(`  ${category}: ${label}`);
    }
    
    console.log(`\n✨ Generated ${Object.keys(concepts).length} concepts`);
    return concepts;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    throw error;
  }
}

async function testWithImageUrl(imageUrl: string) {
  console.log(`📥 Fetching image from: ${imageUrl}\n`);
  
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch image: HTTP ${res.status}`);
  }
  
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return testWithImageBuffer(buffer);
}

async function testWithImageFile(filePath: string) {
  console.log(`📁 Reading image from: ${filePath}\n`);
  
  const buffer = await fs.readFile(filePath);
  return testWithImageBuffer(buffer);
}

async function testWithDatabaseImage(imageId?: string) {
  if (imageId) {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: { site: true }
    });
    
    if (!image) {
      throw new Error(`Image not found: ${imageId}`);
    }
    
    console.log(`📊 Using image from database:`);
    console.log(`   Image ID: ${image.id}`);
    console.log(`   Site: ${image.site?.title || 'N/A'}`);
    console.log(`   URL: ${image.url}\n`);
    
    return testWithImageUrl(image.url);
  } else {
    // Get a random image from database
    const images = await prisma.image.findMany({
      take: 1,
      include: { site: true }
    });
    
    if (images.length === 0) {
      throw new Error('No images found in database');
    }
    
    const image = images[0];
    console.log(`📊 Using random image from database:`);
    console.log(`   Image ID: ${image.id}`);
    console.log(`   Site: ${image.site?.title || 'N/A'}`);
    console.log(`   URL: ${image.url}\n`);
    
    return testWithImageUrl(image.url);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Test with a database image
    await testWithDatabaseImage();
  } else if (args[0].startsWith('http://') || args[0].startsWith('https://')) {
    // Test with image URL
    await testWithImageUrl(args[0]);
  } else if (args[0].startsWith('id:')) {
    // Test with image ID from database
    const imageId = args[0].substring(3);
    await testWithDatabaseImage(imageId);
  } else {
    // Test with local file path
    const filePath = path.isAbsolute(args[0]) ? args[0] : path.join(process.cwd(), args[0]);
    await testWithImageFile(filePath);
  }
}

main()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  });

