require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding data for Linda and Ghislain...");

    const ghislainHash = await bcrypt.hash("ghislain123", 10);
    const lindaHash = await bcrypt.hash("linda123", 10);

    // 1. Vendor Ghislain
    const vendorUser = await prisma.user.upsert({
        where: { email: "ghislain@gmail.com" },
        update: { role: "VENDOR" },
        create: {
            name: "Ishimwe Ghislain",
            email: "ghislain@gmail.com",
            password: ghislainHash,
            role: "VENDOR",
        },
    });

    const vendor = await prisma.vendor.upsert({
        where: { userId: vendorUser.id },
        update: { isApproved: true },
        create: {
            storeName: "Ishimwe Ghislain's Luxury",
            description: "Exclusive luxury items curated by Ghislain.",
            isApproved: true,
            userId: vendorUser.id,
        },
    });

    // 2. Customer Linda
    const customerUser = await prisma.user.upsert({
        where: { email: "linda@gmail.com" },
        update: {},
        create: {
            name: "Linda",
            email: "linda@gmail.com",
            password: lindaHash,
            role: "CUSTOMER",
        },
    });

    // 3. Category & Product
    const category = await prisma.category.findFirst({ where: { name: "Fashion" } }) || await prisma.category.create({ data: { name: "Fashion", slug: "fashion" } });

    const watch = await prisma.product.upsert({
        where: { id: "luxury-watch-01" },
        update: {
            vendorId: vendor.id,
            categoryId: category.id,
        },
        create: {
            id: "luxury-watch-01",
            name: "Rolex Submariner Gold",
            description: "Classical divers' watch.",
            price: 35000,
            stock: 10,
            images: ["https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=1000"],
            vendorId: vendor.id,
            categoryId: category.id,
            isFeatured: true,
            isTrending: true
        },
    });

    // 4. Multiple Orders
    console.log("Creating orders for Linda buying from Ghislain...");
    for (let i = 0; i < 5; i++) {
        await prisma.order.create({
            data: {
                userId: customerUser.id,
                status: "PAID",
                totalAmount: 35000,
                shippingAddress: "Kigali Sanctuary",
                phone: "0788123456",
                paymentMethod: i % 2 === 0 ? "MOMO" : "CARD",
                createdAt: new Date(Date.now() - i * 86400000),
                items: {
                    create: {
                        productId: watch.id,
                        quantity: 1,
                        price: 35000,
                    },
                },
            },
        });
    }

    console.log("Seed completed!");
}

main()
    .catch((e) => {
        console.error("Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
