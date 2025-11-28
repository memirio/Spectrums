#!/usr/bin/env tsx
/**
 * List images in Supabase Storage to verify folder structure
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BUCKET_NAME = 'Images'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  console.log('🔍 Listing images in Supabase Storage...\n')
  
  // List folders (first level)
  const { data: folders, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list('', {
      limit: 20,
      sortBy: { column: 'name', order: 'asc' }
    })
  
  if (listError) {
    console.error('❌ Error listing:', listError.message)
    process.exit(1)
  }
  
  console.log(`📁 Found ${folders.length} folders (showing first 20):\n`)
  
  for (const folder of folders.slice(0, 5)) {
    console.log(`  📂 ${folder.name}/`)
    
    // List files in this folder
    const { data: files, error: filesError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder.name, {
        limit: 3
      })
    
    if (!filesError && files && files.length > 0) {
      files.forEach(file => {
        console.log(`     📄 ${file.name}`)
      })
      if (files.length === 3) {
        console.log(`     ... (and more)`)
      }
    }
    console.log('')
  }
  
  // Test accessing a specific image
  if (folders.length > 0) {
    const testFolder = folders[0].name
    const { data: testFiles } = await supabase.storage
      .from(BUCKET_NAME)
      .list(testFolder, { limit: 1 })
    
    if (testFiles && testFiles.length > 0) {
      const testPath = `${testFolder}/${testFiles[0].name}`
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(testPath)
      
      console.log(`🧪 Test URL: ${urlData.publicUrl}`)
      
      // Try to fetch it
      const response = await fetch(urlData.publicUrl)
      console.log(`   Status: ${response.status} ${response.statusText}`)
      
      if (response.ok) {
        console.log('   ✅ Image is accessible!')
      } else {
        const errorText = await response.text().catch(() => '')
        console.log(`   ❌ Error: ${errorText.substring(0, 100)}`)
      }
    }
  }
}

main().catch(console.error)

