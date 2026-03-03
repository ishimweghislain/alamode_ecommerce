const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function test() {
    try {
        const users = await prisma.user.count();
        console.log("Connection successful. User count:", users);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}
test();
