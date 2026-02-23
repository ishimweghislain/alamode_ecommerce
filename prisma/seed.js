const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@alamode.rw" },
        update: {},
        create: {
            email: "admin@alamode.rw",
            name: "Super Admin",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    // Create Categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: "fashion" },
            update: {},
            create: { name: "Fashion", slug: "fashion" },
        }),
        prisma.category.upsert({
            where: { slug: "decoration" },
            update: {},
            create: { name: "Decoration", slug: "decoration" },
        }),
        prisma.category.upsert({
            where: { slug: "technology" },
            update: {},
            create: { name: "Technology", slug: "technology" },
        }),
    ]);

    console.log("Seed finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
