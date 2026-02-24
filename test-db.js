
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log('User count:', userCount);
    } catch (e) {
        console.error('Error connecting to DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
