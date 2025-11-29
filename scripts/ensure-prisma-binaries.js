#!/usr/bin/env node
/**
 * Ensure Prisma binaries are in the correct location for Vercel deployment
 */
const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
const prismaPackagePath = path.join(process.cwd(), 'node_modules', '@prisma', 'client');

console.log('Checking Prisma binaries...');
console.log('Prisma client path:', prismaClientPath);
console.log('Prisma package path:', prismaPackagePath);

if (!fs.existsSync(prismaClientPath)) {
  console.error('ERROR: Prisma client not found at:', prismaClientPath);
  console.error('Run "prisma generate" first');
  process.exit(1);
}

// List all files in .prisma/client
const files = fs.readdirSync(prismaClientPath);
const binaryFiles = files.filter(f => 
  f.includes('query_engine') || 
  f.includes('.so.node') || 
  f.includes('.node') ||
  f.includes('libquery_engine')
);

console.log('Found Prisma binary files:', binaryFiles);

if (binaryFiles.length === 0) {
  console.warn('WARNING: No Prisma binary files found');
} else {
  console.log('✓ Prisma binaries are present');
  
  // Verify rhel-openssl-3.0.x binary exists
  const rhelBinary = binaryFiles.find(f => f.includes('rhel-openssl-3.0.x'));
  if (rhelBinary) {
    console.log('✓ RHEL binary found:', rhelBinary);
  } else {
    console.warn('⚠ WARNING: RHEL binary not found. Available binaries:', binaryFiles);
  }
}

console.log('Prisma binary check completed');

