import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Concept {
  id: string
  label: string
  opposites: string[] | null
  related: string[] | null
  synonyms: string[] | null
}

// Common acronyms that should stay uppercase
const ACRONYMS = new Set(['2D', '3D', 'AI', 'AR', 'VR', 'XR', 'CGI', 'ASCII', 'DIY', 'HUD', 'UI', 'UX', 'SaaS', 'Y2K'])

// Check if a word is an acronym
function isAcronym(word: string): boolean {
  // All uppercase and 2-4 characters, or contains numbers
  if (word.length <= 4 && word === word.toUpperCase() && /^[A-Z0-9]+$/.test(word)) {
    return true
  }
  return ACRONYMS.has(word.toUpperCase())
}

// Standardize concept labels: Title Case for multi-word, handle acronyms
function standardizeLabel(label: string): string {
  // Handle special cases first
  if (label.includes('/')) {
    // Keep slashes as-is (e.g., "UI/UX")
    const parts = label.split('/')
    return parts.map(part => {
      const trimmed = part.trim()
      if (isAcronym(trimmed)) {
        return trimmed.toUpperCase()
      }
      return standardizeLabel(trimmed)
    }).join('/')
  }
  
  if (label.includes('-')) {
    // Hyphenated: Title-Case each part, but preserve acronyms
    return label
      .split('-')
      .map(word => {
        const trimmed = word.trim()
        if (trimmed.length === 0) return trimmed
        if (isAcronym(trimmed)) {
          return trimmed.toUpperCase()
        }
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
      })
      .join('-')
  }
  
  // Single word or space-separated: Title Case, but preserve acronyms
  return label
    .split(/\s+/)
    .map(word => {
      if (word.length === 0) return word
      if (isAcronym(word)) {
        return word.toUpperCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

// Standardize concept ID: lowercase with hyphens
function standardizeId(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-') // Convert slashes to hyphens
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  console.log('Reviewing concept taxonomy...\n')

  // Fetch all concepts
  const concepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      opposites: true,
      related: true,
      synonyms: true,
    },
    orderBy: {
      label: 'asc',
    },
  })

  console.log(`Found ${concepts.length} concepts\n`)

  // Analyze inconsistencies
  const issues: Array<{
    conceptId: string
    currentLabel: string
    issue: string
    suggestedFix?: string
  }> = []

  const idIssues: Array<{
    conceptId: string
    label: string
    issue: string
    suggestedId?: string
  }> = []

  for (const concept of concepts) {
    const standardizedLabel = standardizeLabel(concept.label)
    const standardizedId = standardizeId(standardizedLabel)

    // Check label capitalization
    if (concept.label !== standardizedLabel) {
      issues.push({
        conceptId: concept.id,
        currentLabel: concept.label,
        issue: 'Inconsistent capitalization',
        suggestedFix: standardizedLabel,
      })
    }

    // Check ID format (only if label would change, since ID should match standardized label)
    if (concept.label !== standardizedLabel) {
      const newId = standardizeId(standardizedLabel)
      if (concept.id !== newId) {
        idIssues.push({
          conceptId: concept.id,
          label: concept.label,
          issue: 'ID will need update after label fix',
          suggestedId: newId,
        })
      }
    }

    // Check for invalid characters in ID
    if (!/^[a-z0-9-]+$/.test(concept.id)) {
      idIssues.push({
        conceptId: concept.id,
        label: concept.label,
        issue: 'ID contains invalid characters',
        suggestedId: standardizeId(standardizedLabel),
      })
    }
  }

  // Report issues
  if (issues.length === 0 && idIssues.length === 0) {
    console.log('✅ All concepts have consistent formatting!\n')
  } else {
    if (issues.length > 0) {
      console.log(`📋 Label capitalization issues (${issues.length}):\n`)
      
      // Group by pattern
      const titleCase = issues.filter(i => i.currentLabel !== i.currentLabel.toLowerCase() && i.currentLabel !== i.currentLabel.toUpperCase())
      const allLower = issues.filter(i => i.currentLabel === i.currentLabel.toLowerCase() && i.currentLabel !== i.suggestedFix?.toLowerCase())
      const allUpper = issues.filter(i => i.currentLabel === i.currentLabel.toUpperCase())
      const mixed = issues.filter(i => !titleCase.includes(i) && !allLower.includes(i) && !allUpper.includes(i))

      if (allLower.length > 0) {
        console.log(`  All lowercase (${allLower.length}):`)
        allLower.slice(0, 20).forEach(issue => {
          console.log(`    "${issue.currentLabel}" → "${issue.suggestedFix}" (id: ${issue.conceptId})`)
        })
        if (allLower.length > 20) {
          console.log(`    ... and ${allLower.length - 20} more`)
        }
        console.log()
      }

      if (allUpper.length > 0) {
        console.log(`  All uppercase (${allUpper.length}):`)
        allUpper.slice(0, 20).forEach(issue => {
          console.log(`    "${issue.currentLabel}" → "${issue.suggestedFix}" (id: ${issue.conceptId})`)
        })
        if (allUpper.length > 20) {
          console.log(`    ... and ${allUpper.length - 20} more`)
        }
        console.log()
      }

      if (mixed.length > 0) {
        console.log(`  Mixed case (${mixed.length}):`)
        mixed.slice(0, 20).forEach(issue => {
          console.log(`    "${issue.currentLabel}" → "${issue.suggestedFix}" (id: ${issue.conceptId})`)
        })
        if (mixed.length > 20) {
          console.log(`    ... and ${mixed.length - 20} more`)
        }
        console.log()
      }
    }

    if (idIssues.length > 0) {
      console.log(`📋 ID format issues (${idIssues.length}):\n`)
      idIssues.slice(0, 30).forEach(issue => {
        console.log(`    "${issue.label}" (id: ${issue.conceptId}) → suggested: ${issue.suggestedId}`)
      })
      if (idIssues.length > 30) {
        console.log(`    ... and ${idIssues.length - 30} more`)
      }
      console.log()
    }

    console.log('\nRun with --fix flag to automatically fix these issues')
  }

  // If --fix flag is provided, fix the issues
  if (process.argv.includes('--fix')) {
    console.log('\n🔧 Fixing label capitalization...\n')
    
    let fixedLabels = 0
    const idMapping = new Map<string, string>() // old ID -> new ID

    // First pass: fix labels and collect ID changes
    for (const issue of issues) {
      const standardizedLabel = standardizeLabel(issue.currentLabel)
      const standardizedId = standardizeId(standardizedLabel)
      
      // Check if new ID conflicts with existing concept
      const existingWithNewId = concepts.find(c => c.id === standardizedId && c.id !== issue.conceptId)
      if (existingWithNewId) {
        console.log(`⚠️  Skipping "${issue.currentLabel}" (${issue.conceptId}): new ID "${standardizedId}" conflicts with existing concept "${existingWithNewId.label}"`)
        continue
      }

      await prisma.concept.update({
        where: { id: issue.conceptId },
        data: { label: standardizedLabel },
      })

      if (issue.conceptId !== standardizedId) {
        idMapping.set(issue.conceptId, standardizedId)
      }

      fixedLabels++
      console.log(`✅ Fixed: "${issue.currentLabel}" → "${standardizedLabel}"`)
    }

    // Second pass: update IDs (need to be careful about references)
    if (idMapping.size > 0) {
      console.log(`\n⚠️  Found ${idMapping.size} concepts that need ID changes.`)
      console.log('   ID changes require updating all references (opposites, related, synonyms).')
      console.log('   This is a complex operation. Please review the mapping above first.')
      console.log('   For now, only labels have been fixed.\n')
    }

    console.log(`✅ Fixed ${fixedLabels} label capitalization issues`)
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

