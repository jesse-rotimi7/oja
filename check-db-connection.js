// Quick script to test database connection
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('✅ Successfully connected to database!')
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\n📋 Troubleshooting steps:')
    console.log('1. Go to Supabase Dashboard → Settings → Database')
    console.log('2. Copy the connection string from "URI" tab')
    console.log('3. Update DATABASE_URL in your .env file')
    console.log('4. Make sure your Supabase project is active (not paused)')
  }
}

testConnection()

