#!/usr/bin/env tsx
/**
 * Backup SQLite Database
 * 
 * Creates a timestamped backup of the SQLite database.
 * 
 * Usage:
 *   tsx scripts/backup_database.ts [db-path]
 * 
 * Example:
 *   tsx scripts/backup_database.ts prisma/dev-new.db
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const DB_PATH = process.argv[2] || path.join(process.cwd(), 'prisma/dev-new.db')
const BACKUP_DIR = path.join(process.cwd(), 'prisma/backups')

function backupDatabase() {
  console.log('💾 Creating database backup...\n')

  // Check if database exists
  if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ Database not found: ${DB_PATH}`)
    process.exit(1)
  }

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
    console.log(`📁 Created backups directory: ${BACKUP_DIR}`)
  }

  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const backupPath = path.join(BACKUP_DIR, `dev-new.db.backup-${timestamp}`)

  // Copy database file
  console.log(`📋 Source: ${DB_PATH}`)
  console.log(`💾 Backup: ${backupPath}`)
  
  fs.copyFileSync(DB_PATH, backupPath)
  
  const stats = fs.statSync(backupPath)
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
  
  console.log(`✅ Backup created successfully (${sizeMB} MB)`)
  
  // List recent backups
  console.log('\n📚 Recent backups:')
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('dev-new.db.backup-'))
    .sort()
    .reverse()
    .slice(0, 5)
  
  for (const backup of backups) {
    const backupStats = fs.statSync(path.join(BACKUP_DIR, backup))
    const backupSizeMB = (backupStats.size / (1024 * 1024)).toFixed(2)
    console.log(`   ${backup} (${backupSizeMB} MB)`)
  }
  
  console.log(`\n💡 To restore a backup:`)
  console.log(`   cp ${BACKUP_DIR}/${backups[0]} ${DB_PATH}`)
}

backupDatabase()

