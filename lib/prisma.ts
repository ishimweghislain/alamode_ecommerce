import { Pool, types } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Fix for BigInt serialization in pg
types.setTypeParser(20, (val) => parseInt(val, 10))

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
    pool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

const pool = globalForPrisma.pool || new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: connectionString?.includes('sslmode=require') || connectionString?.includes('verify-full') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool

const adapter = new PrismaPg(pool)

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
