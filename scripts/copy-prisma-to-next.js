#!/usr/bin/env node
/**
 * Copy Prisma binaries to .next directory to ensure they're included in Vercel deployment
 */
const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
const nextServerPath = path.join(process.cwd(), '.next', 'server');

if (!fs.existsSync(prismaClientPath)) {
  console.warn('Prisma client not found, skipping binary copy');
  process.exit(0);
}

if (!fs.existsSync(nextServerPath)) {
  console.warn('.next/server not found, skipping binary copy');
  process.exit(0);
}

// Copy Prisma binaries to multiple locations to ensure they're found
const locations = [
  path.join(nextServerPath, 'node_modules', '.prisma', 'client'),
  path.join(nextServerPath, 'node_modules', '@prisma', 'client'),
];

// Copy all binary files
const files = fs.readdirSync(prismaClientPath);
const binaryFiles = files.filter(f => 
  f.includes('query_engine') || 
  f.includes('.so.node') || 
  f.includes('.dylib.node') ||
  f.includes('.node')
);

console.log('Copying Prisma binaries to .next/server...');
locations.forEach(location => {
  fs.mkdirSync(location, { recursive: true });
  
  binaryFiles.forEach(file => {
    const source = path.join(prismaClientPath, file);
    const dest = path.join(location, file);
    try {
      fs.copyFileSync(source, dest);
      console.log(`✓ Copied ${file} to ${path.relative(process.cwd(), location)}`);
    } catch (error) {
      console.warn(`Failed to copy ${file} to ${location}:`, error.message);
    }
  });
});

console.log('Prisma binary copy completed');
