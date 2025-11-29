#!/usr/bin/env node
/**
 * Copy Prisma binaries to ensure they're included in Vercel deployment
 */
const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
const targetPath = path.join(process.cwd(), 'node_modules', '@prisma', 'client');

if (fs.existsSync(prismaClientPath)) {
  console.log('Prisma client binaries found at:', prismaClientPath);
  
  // List all files in .prisma/client
  const files = fs.readdirSync(prismaClientPath);
  const binaryFiles = files.filter(f => f.includes('query_engine') || f.includes('.so.node') || f.includes('.node'));
  
  console.log('Found Prisma binary files:', binaryFiles);
  
  // Ensure @prisma/client directory exists
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  
  // Copy binary files
  binaryFiles.forEach(file => {
    const source = path.join(prismaClientPath, file);
    const dest = path.join(targetPath, file);
    try {
      fs.copyFileSync(source, dest);
      console.log(`Copied ${file} to ${targetPath}`);
    } catch (error) {
      console.warn(`Failed to copy ${file}:`, error.message);
    }
  });
  
  console.log('Prisma binaries copy completed');
} else {
  console.warn('Prisma client path not found:', prismaClientPath);
  console.warn('Run "prisma generate" first');
}

