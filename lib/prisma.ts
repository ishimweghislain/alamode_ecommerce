import { Pool, types } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
// @ts-ignore
import { PrismaClient } from '@prisma/client'

// Fix for BigInt serialization in pg
types.setTypeParser(20, (val) => parseInt(val, 10))

const globalForPrisma = global as any

const connectionString = process.env.DATABASE_URL

const poolConfig = {
    connectionString,
    ssl: connectionString?.includes('sslmode=require') || connectionString?.includes('verify-full') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
}

const pool = new Pool(poolConfig)
const adapter = new PrismaPg(pool)

export const prisma: any =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
