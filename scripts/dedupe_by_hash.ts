import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

interface ImageWithEmbedding {
  id: string
  url: string
  siteId: string
  embedding: {
    id: string
    contentHash: string | null
    vector: any
    model: string
    tags: Array<{
      conceptId: string
      score: number
    }>
  } | null
}

interface DedupePlan {
  contentHash: string
  images: ImageWithEmbedding[]
  primary: ImageWithEmbedding
  duplicates: ImageWithEmbedding[]
  actions: {
    updateEmbeddings: number
    mergeTags: number
    deleteEmbeddings: number
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const dryRun = !apply
  
  if (dryRun) {
    console.log('🔍 DRY-RUN MODE (use --apply to execute changes)\n')
  } else {
    console.log('⚡ APPLY MODE - Changes will be executed\n')
  }
  
  const startTime = Date.now()
  
  // 1. Fetch all images with their embeddings and tags
  console.log('📊 Scanning all images...')
  const allImages = await prisma.image.findMany({
    include: {
      embedding: {
        include: {
          tags: true
        }
      }
    }
  })
  
  console.log(`Found ${allImages.length} total images\n`)
  
  // 2. Group by contentHash
  const byHash = new Map<string, ImageWithEmbedding[]>()
  
  for (const img of allImages) {
    const hash = (img.embedding?.contentHash as string | null) || 'NO_HASH'
    
    if (!byHash.has(hash)) {
      byHash.set(hash, [])
    }
    
    byHash.get(hash)!.push(img as ImageWithEmbedding)
  }
  
  // 3. Find groups with duplicates (more than 1 image with same hash)
  const duplicates: DedupePlan[] = []
  
  for (const [hash, images] of byHash.entries()) {
    if (hash === 'NO_HASH') continue // Skip images without hashes
    if (images.length <= 1) continue // Skip unique hashes
    
    // Pick primary: prefer one with embedding, otherwise first
    const primary = images.find(img => img.embedding !== null) || images[0]
    const duplicatesForHash = images.filter(img => img.id !== primary.id)
    
    duplicates.push({
      contentHash: hash,
      images,
      primary,
      duplicates: duplicatesForHash,
      actions: {
        updateEmbeddings: duplicatesForHash.filter(img => img.embedding !== null).length,
        mergeTags: duplicatesForHash.length,
        deleteEmbeddings: 0 // We don't delete, we update
      }
    })
  }
  
  console.log(`Found ${duplicates.length} contentHash groups with duplicates`)
  console.log(`Total duplicate images: ${duplicates.reduce((sum, d) => sum + d.duplicates.length, 0)}\n`)
  
  if (duplicates.length === 0) {
    console.log('✅ No duplicates found - database is already deduped!')
    return
  }
  
  // 4. Generate plan
  console.log('📋 Deduplication Plan:')
  console.log('═'.repeat(80))
  
  for (const plan of duplicates) {
    console.log(`\nHash: ${plan.contentHash.slice(0, 16)}... (${plan.images.length} images)`)
    console.log(`  Primary: ${plan.primary.id} (${plan.primary.url})`)
    console.log(`  Duplicates:`)
    for (const dup of plan.duplicates) {
      console.log(`    - ${dup.id} (${dup.url})`)
      if (dup.embedding) {
        console.log(`      → Will update embedding to match primary`)
      } else {
        console.log(`      → Will create embedding from primary`)
      }
      if (dup.embedding?.tags && dup.embedding.tags.length > 0) {
        console.log(`      → Will merge ${dup.embedding.tags.length} tags`)
      }
    }
  }
  
  console.log('\n' + '═'.repeat(80))
  
  if (dryRun) {
    console.log('\n💡 This is a dry-run. Use --apply to execute these changes.')
    return
  }
  
  // 5. Execute deduplication
  console.log('\n🔄 Executing deduplication...\n')
  
  let imagesUpdated = 0
  let embeddingsUpdated = 0
  let embeddingsCreated = 0
  let tagsMerged = 0
  let tagsDeleted = 0
  
  for (const plan of duplicates) {
    const primaryVector = plan.primary.embedding?.vector
    const primaryModel = plan.primary.embedding?.model || 'clip-ViT-L/14'
    
    if (!primaryVector) {
      console.log(`⚠️  Skipping hash ${plan.contentHash.slice(0, 12)}... - primary has no embedding`)
      continue
    }
    
    // Collect all tags from duplicates to merge
    const tagMap = new Map<string, number>()
    const primaryTags = new Set<string>()
    
    // Add primary's tags as baseline
    if (plan.primary.embedding?.tags) {
      for (const tag of plan.primary.embedding.tags) {
        tagMap.set(tag.conceptId, tag.score)
        primaryTags.add(tag.conceptId)
      }
    }
    
    // Merge duplicates' tags (keep max score per concept)
    let mergedTagCount = 0
    for (const dup of plan.duplicates) {
      if (dup.embedding?.tags) {
        for (const tag of dup.embedding.tags) {
          const existing = tagMap.get(tag.conceptId)
          if (!existing || tag.score > existing) {
            tagMap.set(tag.conceptId, tag.score)
            // Count as merged if it's from a duplicate (not from primary)
            if (!primaryTags.has(tag.conceptId)) {
              mergedTagCount++
            }
          }
        }
      }
    }
    
    // Process each duplicate
    for (const dup of plan.duplicates) {
      // Update or create embedding to match primary
      if (dup.embedding) {
        // Update existing embedding
        await prisma.imageEmbedding.update({
          where: { imageId: dup.id },
          data: {
            vector: primaryVector as any,
            model: primaryModel,
            contentHash: plan.contentHash
          } as any
        })
        embeddingsUpdated++
      } else {
        // Create new embedding from primary
        await prisma.imageEmbedding.create({
          data: {
            imageId: dup.id,
            vector: primaryVector as any,
            model: primaryModel,
            contentHash: plan.contentHash
          } as any
        })
        embeddingsCreated++
      }
      
      // Delete duplicate's existing tags (we'll recreate from merged map)
      if (dup.embedding?.tags && dup.embedding.tags.length > 0) {
        await prisma.imageTag.deleteMany({
          where: { imageId: dup.id }
        })
        tagsDeleted += dup.embedding.tags.length
      }
      
      imagesUpdated++
    }
    
    // Recreate tags on primary with merged scores
    // First, delete primary's existing tags
    if (plan.primary.embedding?.tags && plan.primary.embedding.tags.length > 0) {
      await prisma.imageTag.deleteMany({
        where: { imageId: plan.primary.id }
      })
    }
    
    // Create merged tags on primary
    for (const [conceptId, score] of tagMap.entries()) {
      await prisma.imageTag.upsert({
        where: { imageId_conceptId: { imageId: plan.primary.id, conceptId } },
        update: { score },
        create: { imageId: plan.primary.id, conceptId, score }
      })
    }
    tagsMerged += mergedTagCount
    
    // Also apply merged tags to duplicates (they should match primary)
    for (const dup of plan.duplicates) {
      for (const [conceptId, score] of tagMap.entries()) {
        await prisma.imageTag.upsert({
          where: { imageId_conceptId: { imageId: dup.id, conceptId } },
          update: { score },
          create: { imageId: dup.id, conceptId, score }
        })
      }
    }
    
    console.log(`✓ Processed hash ${plan.contentHash.slice(0, 12)}... (${plan.duplicates.length} duplicates)`)
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  
  // 6. Final report
  console.log('\n' + '═'.repeat(80))
  console.log('📊 Final Report:')
  console.log('═'.repeat(80))
  console.log(`  Duplicate groups processed: ${duplicates.length}`)
  console.log(`  Images updated: ${imagesUpdated}`)
  console.log(`  Embeddings updated: ${embeddingsUpdated}`)
  console.log(`  Embeddings created: ${embeddingsCreated}`)
  console.log(`  Tags merged: ${tagsMerged}`)
  console.log(`  Tags deleted: ${tagsDeleted}`)
  console.log(`  Total time: ${duration}s`)
  console.log('═'.repeat(80))
  console.log('\n✅ Deduplication complete!')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

