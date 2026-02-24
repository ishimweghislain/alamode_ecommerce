import { Pool, types } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Fix for BigInt serialization in pg
types.setTypeParser(20, (val) => parseInt(val, 10))

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const connectionString = process.env.DATABASE_URL

// Configure SSL based on the connection string to avoid warnings and ensure production connectivity
const poolConfig = {
    connectionString,
    ssl: connectionString?.includes('sslmode=require') || connectionString?.includes('verify-full') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
}

const pool = new Pool(poolConfig)
const adapter = new PrismaPg(pool)

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
