import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { enqueueTaggingJob } from '../src/jobs/tagging'

const prisma = new PrismaClient()

async function main() {
  const images = await prisma.image.findMany({ include: { embedding: true } })
  let queued = 0
  for (const img of images) {
    if (!img.embedding) {
      await enqueueTaggingJob(img.id)
      queued++
      if (queued % 25 === 0) console.log(`Queued ${queued} images...`)
    }
  }
  console.log(`Done. Queued ${queued} images for tagging.`)
}

main().catch(e => { console.error(e); process.exit(1) })


