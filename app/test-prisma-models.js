const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available models:', Object.keys(prisma).filter(k => k[0] !== '_' && typeof prisma[k] === 'object'));
process.exit(0);
