import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create tags for abstract concepts
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Modern' },
      update: {},
      create: { name: 'Modern' },
    }),
    prisma.tag.upsert({
      where: { name: 'Minimalistic' },
      update: {},
      create: { name: 'Minimalistic' },
    }),
    prisma.tag.upsert({
      where: { name: '3D' },
      update: {},
      create: { name: '3D' },
    }),
    prisma.tag.upsert({
      where: { name: 'Dark' },
      update: {},
      create: { name: 'Dark' },
    }),
    prisma.tag.upsert({
      where: { name: 'Colorful' },
      update: {},
      create: { name: 'Colorful' },
    }),
    prisma.tag.upsert({
      where: { name: 'Interactive' },
      update: {},
      create: { name: 'Interactive' },
    }),
    prisma.tag.upsert({
      where: { name: 'Typography' },
      update: {},
      create: { name: 'Typography' },
    }),
    prisma.tag.upsert({
      where: { name: 'Gradient' },
      update: {},
      create: { name: 'Gradient' },
    }),
    prisma.tag.upsert({
      where: { name: 'Animation' },
      update: {},
      create: { name: 'Animation' },
    }),
    prisma.tag.upsert({
      where: { name: 'Portfolio' },
      update: {},
      create: { name: 'Portfolio' },
    }),
  ])

  // Create common tag aliases for fuzzy matching
  const aliasPairs: Array<[string, string[]]> = [
    ['Typography', ['text', 'font', 'type', 'copy', 'lettering', 'typo', 'typography']],
    ['Colorful', ['vibrant', 'color', 'colors', 'multicolor', 'bright', 'rainbow']],
    ['Minimalistic', ['minimal', 'clean', 'simple', 'simplicity', 'cleen', 'minimalist', 'bare', 'sparse', 'uncluttered']],
    ['Interactive', ['interaction', 'interactive', 'webgl', 'gsap', 'clickable', 'hover', 'responsive']],
    ['3D', ['three dimensional', '3d', 'threejs', 'webgl 3d', 'dimensional', 'depth', 'volume']],
    ['Gradient', ['gradients', 'duotone', 'blend', 'fade', 'transition', 'color transition']],
    ['Dark', ['dark mode', 'black', 'noir', 'dark theme', 'night mode', 'shadow']],
    ['Modern', ['contemporary', 'current', 'sleek', 'new', 'fresh', 'cutting edge', 'trendy']],
    ['Portfolio', ['case studies', 'work showcase', 'folio', 'gallery', 'showcase', 'projects']],
    ['Animation', ['motion', 'animated', 'microinteractions', 'movement', 'transition', 'dynamic']]
  ]

  for (const [canonical, aliases] of aliasPairs) {
    const tag = tags.find(t => t.name === canonical)!
    for (const alias of aliases) {
      await prisma.tagAlias.upsert({
        where: { alias: alias.toLowerCase() },
        update: { tagId: tag.id },
        create: { alias: alias.toLowerCase(), tagId: tag.id },
      })
    }
  }

  // Create sample sites
  const sites = [
    await prisma.site.create({
      data: {
        title: 'Modern Minimal Studio',
        description: 'A clean, modern design agency website with minimalistic approach',
        url: 'https://example-modern-minimal.com',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        author: 'Design Studio',
      },
    }),
    await prisma.site.create({
      data: {
        title: '3D Interactive Experience',
        description: 'Immersive 3D web experience with interactive elements',
        url: 'https://example-3d-interactive.com',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        author: '3D Studio',
      },
    }),
    await prisma.site.create({
      data: {
        title: 'Dark Gradient Portfolio',
        description: 'Dark theme portfolio with beautiful gradient effects',
        url: 'https://example-dark-gradient.com',
        imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
        author: 'Creative Agency',
      },
    }),
    await prisma.site.create({
      data: {
        title: 'Colorful Animation Hub',
        description: 'Vibrant website with smooth animations and colorful design',
        url: 'https://example-colorful-animation.com',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
        author: 'Animation Studio',
      },
    }),
    await prisma.site.create({
      data: {
        title: 'Typography Focus',
        description: 'Modern website showcasing beautiful typography and clean design',
        url: 'https://example-typography-modern.com',
        imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800',
        author: 'Type Studio',
      },
    }),
  ]

  // Create site-tag relationships
  const siteTagRelations = [
    // Modern Minimal Studio
    { siteId: sites[0].id, tagId: tags[0].id }, // Modern
    { siteId: sites[0].id, tagId: tags[1].id }, // Minimalistic
    
    // 3D Interactive Experience
    { siteId: sites[1].id, tagId: tags[2].id }, // 3D
    { siteId: sites[1].id, tagId: tags[5].id }, // Interactive
    
    // Dark Gradient Portfolio
    { siteId: sites[2].id, tagId: tags[3].id }, // Dark
    { siteId: sites[2].id, tagId: tags[7].id }, // Gradient
    { siteId: sites[2].id, tagId: tags[9].id }, // Portfolio
    
    // Colorful Animation Hub
    { siteId: sites[3].id, tagId: tags[4].id }, // Colorful
    { siteId: sites[3].id, tagId: tags[8].id }, // Animation
    
    // Typography Focus
    { siteId: sites[4].id, tagId: tags[6].id }, // Typography
    { siteId: sites[4].id, tagId: tags[0].id }, // Modern
  ]

  for (const relation of siteTagRelations) {
    await prisma.siteTag.upsert({
      where: {
        siteId_tagId: {
          siteId: relation.siteId,
          tagId: relation.tagId,
        },
      },
      update: {},
      create: relation,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
