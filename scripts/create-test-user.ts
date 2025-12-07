#!/usr/bin/env tsx
/**
 * Create a test user for authentication
 * Usage: tsx scripts/create-test-user.ts <username> <password>
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const username = process.argv[2]
  const password = process.argv[3]

  if (!username || !password) {
    console.error('Usage: tsx scripts/create-test-user.ts <username> <password>')
    process.exit(1)
  }

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { username },
    })

    if (existing) {
      console.error(`❌ User "${username}" already exists`)
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    })

    console.log('✅ User created successfully!')
    console.log('   Username:', user.username)
    console.log('   ID:', user.id)
    console.log('   Created:', user.createdAt)
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

