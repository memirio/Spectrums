import 'dotenv/config'
import { embedImageFromBuffer, canonicalizeImage } from '../src/lib/embeddings'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function readBuffer(pathOrUrl: string): Promise<Buffer> {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    try {
      const r = await fetch(pathOrUrl)
      if (!r.ok) {
        throw new Error(`HTTP ${r.status} ${r.statusText} for ${pathOrUrl}`)
      }
      const ab = await r.arrayBuffer()
      return Buffer.from(ab)
    } catch (e: any) {
      if (e.message?.includes('HTTP')) throw e
      throw new Error(`Failed to fetch ${pathOrUrl}: ${e.message || e}`)
    }
  }
  
  // Handle local paths
  let filePath: string
  if (pathOrUrl.startsWith('/')) {
    // Absolute path or /fallback.webp -> public/fallback.webp
    if (pathOrUrl.startsWith('/') && !pathOrUrl.startsWith('//')) {
      // Likely /fallback.webp
      filePath = resolve(process.cwd(), 'public', pathOrUrl.slice(1))
    } else {
      filePath = pathOrUrl
    }
  } else {
    // Relative path
    filePath = resolve(process.cwd(), pathOrUrl)
  }
  
  try {
    return readFileSync(filePath)
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}\n  (resolved from: ${pathOrUrl})`)
    }
    throw new Error(`Failed to read file ${filePath}: ${e.message || e}`)
  }
}

async function main() {
  const pathOrUrl = process.argv[2]
  
  if (!pathOrUrl) {
    console.error('Usage: npx tsx scripts/selftest_same_image.ts <pathOrUrl>')
    console.error('Examples:')
    console.error('  npx tsx scripts/selftest_same_image.ts /fallback.webp')
    console.error('  npx tsx scripts/selftest_same_image.ts public/fallback.webp')
    console.error('  npx tsx scripts/selftest_same_image.ts https://example.com/image.webp')
    process.exit(1)
  }
  
  console.log(`🧪 Self-test: embedding same image twice via canonical path`)
  console.log(`   Input: ${pathOrUrl}\n`)
  
  try {
    // Read image buffer
    console.log('📖 Reading image...')
    const buf1 = await readBuffer(pathOrUrl)
    console.log(`   ✓ Loaded ${buf1.length} bytes`)
    
    // Canonicalize and embed first time
    console.log('\n🔬 First embedding pass...')
    const { hash: hash1 } = await canonicalizeImage(buf1)
    console.log(`   ContentHash: ${hash1.slice(0, 12)}...`)
    
    const result1 = await embedImageFromBuffer(buf1)
    const vec1 = result1.vector
    console.log(`   ✓ Vector dimension: ${vec1.length}`)
    
    // Read and canonicalize again (second pass)
    console.log('\n🔬 Second embedding pass...')
    const buf2 = await readBuffer(pathOrUrl)
    const { hash: hash2 } = await canonicalizeImage(buf2)
    console.log(`   ContentHash: ${hash2.slice(0, 12)}...`)
    
    const result2 = await embedImageFromBuffer(buf2)
    const vec2 = result2.vector
    console.log(`   ✓ Vector dimension: ${vec2.length}`)
    
    // Verify hashes match
    if (hash1 !== hash2) {
      console.error(`\n❌ FAIL: ContentHash mismatch!`)
      console.error(`   First:  ${hash1}`)
      console.error(`   Second: ${hash2}`)
      process.exit(1)
    }
    console.log(`   ✓ ContentHash matches`)
    
    // Verify dimensions match
    if (vec1.length !== vec2.length) {
      console.error(`\n❌ FAIL: Vector dimension mismatch!`)
      console.error(`   First:  ${vec1.length}`)
      console.error(`   Second: ${vec2.length}`)
      process.exit(1)
    }
    
    // Compute cosine similarity
    const similarity = cosine(vec1, vec2)
    console.log(`\n📊 Cosine similarity: ${similarity.toFixed(6)}`)
    
    // Hard-fail if similarity < 0.995
    const MIN_SIMILARITY = 0.995
    if (similarity < MIN_SIMILARITY) {
      console.error(`\n❌ FAIL: Similarity ${similarity.toFixed(6)} < ${MIN_SIMILARITY}`)
      console.error(`   The same image should produce nearly identical embeddings!`)
      console.error(`   This indicates a non-deterministic embedding pipeline.`)
      process.exit(1)
    }
    
    console.log(`\n✅ PASS: Same image produces identical embeddings (similarity >= ${MIN_SIMILARITY})`)
    console.log(`   This confirms the canonical path is deterministic.`)
  } catch (e: any) {
    console.error('\n❌ Error:', e.message || e)
    if (e.stack) {
      console.error('\nStack trace:')
      console.error(e.stack)
    }
    process.exit(1)
  }
}

main()

