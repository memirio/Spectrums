import * as fs from 'fs'
import * as path from 'path'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  category?: string
}

type ReviewedOpposites = Record<string, {
  current: string[]
  improved: string[]
  issues: string[]
}>

async function main() {
  console.log('═'.repeat(70))
  console.log('📝 Applying Reviewed Opposites to seed_concepts.json')
  console.log('═'.repeat(70))
  console.log()
  
  // Load reviewed opposites
  const reviewedPath = path.join(process.cwd(), 'scripts/generated_opposites/reviewed_opposites.json')
  if (!fs.existsSync(reviewedPath)) {
    console.error(`❌ Reviewed opposites file not found: ${reviewedPath}`)
    console.error(`   Run review_opposites_with_openai.ts first`)
    process.exit(1)
  }
  
  const reviewedData = JSON.parse(fs.readFileSync(reviewedPath, 'utf-8')) as ReviewedOpposites
  console.log(`📚 Loaded reviewed opposites for ${Object.keys(reviewedData).length} concepts`)
  console.log()
  
  // Load seed concepts
  const conceptsPath = path.join(process.cwd(), 'src/concepts/seed_concepts.json')
  const conceptsData = JSON.parse(fs.readFileSync(conceptsPath, 'utf-8')) as Concept[]
  console.log(`📚 Loaded ${conceptsData.length} concepts from seed_concepts.json`)
  console.log()
  
  // Apply improvements
  let updated = 0
  let unchanged = 0
  let errors = 0
  
  for (const concept of conceptsData) {
    const reviewed = reviewedData[concept.id]
    if (!reviewed) continue
    
    const currentOpposites = concept.opposites || []
    const improvedOpposites = reviewed.improved || []
    
    // Check if there are actual changes
    const hasChanges = 
      currentOpposites.length !== improvedOpposites.length ||
      !currentOpposites.every((opp, i) => improvedOpposites[i] === opp) ||
      !improvedOpposites.every((opp, i) => currentOpposites[i] === opp)
    
    if (hasChanges) {
      concept.opposites = improvedOpposites
      updated++
      console.log(`  ✅ ${concept.label}: ${currentOpposites.length} → ${improvedOpposites.length} opposites`)
      if (reviewed.issues.length > 0) {
        console.log(`     Issues: ${reviewed.issues.join(', ')}`)
      }
    } else {
      unchanged++
    }
  }
  
  // Save updated concepts
  const backupPath = conceptsPath + '.backup'
  console.log()
  console.log(`💾 Creating backup: ${backupPath}`)
  fs.copyFileSync(conceptsPath, backupPath)
  
  console.log(`💾 Saving updated concepts to: ${conceptsPath}`)
  fs.writeFileSync(conceptsPath, JSON.stringify(conceptsData, null, 2))
  
  console.log()
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  console.log(`✅ Concepts updated: ${updated}`)
  console.log(`✓ Concepts unchanged: ${unchanged}`)
  console.log(`❌ Errors: ${errors}`)
  console.log()
  console.log(`💾 Backup saved to: ${backupPath}`)
  console.log(`📄 Updated file: ${conceptsPath}`)
  console.log()
  console.log('═'.repeat(70))
}

main().catch(console.error)

