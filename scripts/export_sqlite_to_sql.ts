#!/usr/bin/env tsx
/**
 * Export SQLite Database to SQL File
 * 
 * Creates a SQL dump of the SQLite database for portability and inspection.
 * 
 * Usage:
 *   tsx scripts/export_sqlite_to_sql.ts [db-path] [output-path]
 * 
 * Example:
 *   tsx scripts/export_sqlite_to_sql.ts prisma/dev-new.db prisma/backups/database-export.sql
 */

import 'dotenv/config'
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const DB_PATH = process.argv[2] || path.join(process.cwd(), 'prisma/dev-new.db')
const OUTPUT_PATH = process.argv[3] || path.join(
  process.cwd(), 
  'prisma/backups', 
  `database-export-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.sql`
)

function exportToSQL() {
  console.log('📤 Exporting SQLite database to SQL file...\n')
  console.log(`📋 Source: ${DB_PATH}`)
  console.log(`💾 Output: ${OUTPUT_PATH}\n`)

  if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ Database not found: ${DB_PATH}`)
    process.exit(1)
  }

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_PATH)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const db = new Database(DB_PATH, { readonly: true })
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all() as Array<{ name: string }>

  console.log(`📊 Found ${tables.length} tables:`)
  tables.forEach(t => console.log(`   - ${t.name}`))

  const sql: string[] = []
  sql.push('-- SQLite Database Export')
  sql.push(`-- Generated: ${new Date().toISOString()}`)
  sql.push(`-- Source: ${DB_PATH}`)
  sql.push('')

  // Export schema
  sql.push('-- ============================================')
  sql.push('-- SCHEMA')
  sql.push('-- ============================================\n')

  for (const table of tables) {
    const schema = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(table.name) as { sql: string } | undefined
    if (schema?.sql) {
      sql.push(`-- Table: ${table.name}`)
      sql.push(schema.sql + ';')
      sql.push('')
    }
  }

  // Export data
  sql.push('-- ============================================')
  sql.push('-- DATA')
  sql.push('-- ============================================\n')

  for (const table of tables) {
    sql.push(`-- Data for table: ${table.name}`)
    
    const rows = db.prepare(`SELECT * FROM ${table.name}`).all() as any[]
    
    if (rows.length === 0) {
      sql.push(`-- (empty)`)
      sql.push('')
      continue
    }

    // Get column names
    const columns = Object.keys(rows[0])
    
    // Generate INSERT statements (batch for performance)
    const batchSize = 100
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      const values = batch.map(row => {
        const vals = columns.map(col => {
          const val = row[col]
          if (val === null) return 'NULL'
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
          return String(val)
        })
        return `(${vals.join(', ')})`
      })
      
      sql.push(`INSERT INTO ${table.name} (${columns.join(', ')}) VALUES`)
      sql.push(values.join(',\n') + ';')
      sql.push('')
    }
  }

  // Write to file
  fs.writeFileSync(OUTPUT_PATH, sql.join('\n'))
  
  const stats = fs.statSync(OUTPUT_PATH)
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
  
  console.log(`\n✅ Export complete (${sizeMB} MB)`)
  console.log(`💾 Saved to: ${OUTPUT_PATH}`)
  console.log(`\n💡 You can inspect this file or use it to restore the database`)

  db.close()
}

exportToSQL()

