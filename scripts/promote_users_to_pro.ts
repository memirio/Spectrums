#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const usernames = ['Jacob', 'Victor']

  console.log('🔼 Promoting users to Pro account type:', usernames.join(', '))

  for (const username of usernames) {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      console.log(`⚠️  User not found: ${username}`)
      continue
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        // @ts-expect-error: accountType is likely a string enum in the schema
        accountType: 'Pro',
      },
    })

    console.log(`✅ Promoted ${username} (id=${user.id}) to Pro`)
  }

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error('❌ Error promoting users to Pro:', err)
  try {
    await prisma.$disconnect()
  } catch {
    // ignore
  }
  process.exit(1)
})


