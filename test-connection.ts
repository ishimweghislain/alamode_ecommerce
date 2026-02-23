import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient({ url: process.env.DATABASE_URL });

async function test() {
    try {
        console.log("Testing connection with URL:", process.env.DATABASE_URL ? "URL present (masked)" : "URL MISSING");
        await prisma.$connect();
        console.log("Connection successful!");
        const users = await prisma.user.count();
        console.log("User count:", users);
    } catch (error) {
        console.error("Connection failed!");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
