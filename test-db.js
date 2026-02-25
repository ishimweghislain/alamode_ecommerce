
const { prisma } = require('./lib/prisma');

async function main() {
    console.log('Testing DB connection...');
    try {
        const userCount = await prisma.user.count();
        console.log('--- SUCCESS ---');
        console.log('User count:', userCount);
    } catch (e) {
        console.error('--- FAILURE ---');
        console.error(e);
    } finally {
        if (prisma.$disconnect) {
            console.log('Disconnecting...');
            await prisma.$disconnect();
        }
    }
}

main();
