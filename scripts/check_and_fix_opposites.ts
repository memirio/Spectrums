import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Concept {
  id: string
  label: string
  opposites: string[] | null
}

async function main() {
  console.log('Checking concept opposites...\n')

  // Fetch all concepts
  const concepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      opposites: true,
    },
  })

  console.log(`Found ${concepts.length} concepts\n`)

  // Build a map of concept ID -> concept data
  const conceptMap = new Map<string, Concept>()
  for (const concept of concepts) {
    const opposites = (concept.opposites as string[] | null) || []
    conceptMap.set(concept.id, {
      id: concept.id,
      label: concept.label,
      opposites: opposites,
    })
  }

  // Check for missing opposites and non-bidirectional relationships
  const issues: Array<{
    conceptId: string
    conceptLabel: string
    issue: string
  }> = []

  for (const concept of conceptMap.values()) {
    // Check if concept has no opposites
    if (!concept.opposites || concept.opposites.length === 0) {
      issues.push({
        conceptId: concept.id,
        conceptLabel: concept.label,
        issue: 'No opposites defined',
      })
      continue
    }

    // Check if each opposite has this concept as its opposite (bidirectional)
    for (const oppositeId of concept.opposites) {
      const oppositeConcept = conceptMap.get(oppositeId)
      
      if (!oppositeConcept) {
        issues.push({
          conceptId: concept.id,
          conceptLabel: concept.label,
          issue: `Opposite "${oppositeId}" does not exist`,
        })
        continue
      }

      // Check if opposite has this concept in its opposites list
      const oppositeOpposites = oppositeConcept.opposites || []
      if (!oppositeOpposites.includes(concept.id)) {
        issues.push({
          conceptId: concept.id,
          conceptLabel: concept.label,
          issue: `Opposite "${oppositeConcept.label}" (${oppositeId}) does not have "${concept.label}" as its opposite`,
        })
      }
    }
  }

  // Report issues
  if (issues.length === 0) {
    console.log('✅ All concepts have opposites and all relationships are bidirectional!\n')
  } else {
    console.log(`❌ Found ${issues.length} issues:\n`)
    
    // Group by issue type
    const noOpposites = issues.filter(i => i.issue === 'No opposites defined')
    const missingBidirectional = issues.filter(i => i.issue.includes('does not have'))
    const invalidOpposite = issues.filter(i => i.issue.includes('does not exist'))

    if (noOpposites.length > 0) {
      console.log(`📋 Concepts with no opposites (${noOpposites.length}):`)
      for (const issue of noOpposites) {
        console.log(`   - "${issue.conceptLabel}" (${issue.conceptId})`)
      }
      console.log()
    }

    if (invalidOpposite.length > 0) {
      console.log(`📋 Concepts with invalid opposite IDs (${invalidOpposite.length}):`)
      for (const issue of invalidOpposite) {
        console.log(`   - "${issue.conceptLabel}" (${issue.conceptId}): ${issue.issue}`)
      }
      console.log()
    }

    if (missingBidirectional.length > 0) {
      console.log(`📋 Non-bidirectional relationships (${missingBidirectional.length}):`)
      for (const issue of missingBidirectional) {
        console.log(`   - "${issue.conceptLabel}" (${issue.conceptId}): ${issue.issue}`)
      }
      console.log()
    }

    // Ask if user wants to fix
    console.log('Would you like to fix these issues?')
    console.log('This will:')
    console.log('1. Add missing opposite relationships to make them bidirectional')
    console.log('2. Remove invalid opposite IDs')
    console.log('3. Note concepts with no opposites (these need manual assignment)')
    console.log('\nRun with --fix flag to automatically fix bidirectional relationships')
  }

  // If --fix flag is provided, fix bidirectional relationships
  if (process.argv.includes('--fix')) {
    console.log('\n🔧 Fixing bidirectional relationships...\n')
    
    let fixedCount = 0
    
    for (const concept of conceptMap.values()) {
      if (!concept.opposites || concept.opposites.length === 0) {
        continue // Skip concepts with no opposites (need manual assignment)
      }

      const updatedOpposites: string[] = []
      
      for (const oppositeId of concept.opposites) {
        const oppositeConcept = conceptMap.get(oppositeId)
        
        if (!oppositeConcept) {
          // Skip invalid opposite IDs
          console.log(`⚠️  Skipping invalid opposite ID "${oppositeId}" for concept "${concept.label}"`)
          continue
        }

        updatedOpposites.push(oppositeId)

        // Ensure opposite has this concept in its opposites list
        const oppositeOpposites = (oppositeConcept.opposites || []) as string[]
        if (!oppositeOpposites.includes(concept.id)) {
          const updatedOppositeOpposites = [...oppositeOpposites, concept.id]
          await prisma.concept.update({
            where: { id: oppositeId },
            data: { opposites: updatedOppositeOpposites },
          })
          console.log(`✅ Added "${concept.label}" as opposite to "${oppositeConcept.label}"`)
          fixedCount++
        }
      }

      // Update concept with cleaned opposites list (removed invalid IDs)
      if (updatedOpposites.length !== concept.opposites.length) {
        await prisma.concept.update({
          where: { id: concept.id },
          data: { opposites: updatedOpposites },
        })
        console.log(`✅ Cleaned opposites for "${concept.label}"`)
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} bidirectional relationships`)
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

