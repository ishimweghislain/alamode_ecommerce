import "dotenv/config";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash("password123", 10);

    console.log("Seeding database...");

    // 1. Create Admin
    await prisma.user.upsert({
        where: { email: "admin@alamode.com" },
        update: { password: hashedPassword },
        create: {
            email: "admin@alamode.com",
            name: "Super Admin",
            password: hashedPassword,
            role: "ADMIN",
        },
    });
    console.log("Admin created: admin@alamode.com");

    // 2. Create Vendor
    const vendorUser = await prisma.user.upsert({
        where: { email: "vendor@alamode.com" },
        update: { password: hashedPassword },
        create: {
            email: "vendor@alamode.com",
            name: "Luxury Vendor",
            password: hashedPassword,
            role: "VENDOR",
        },
    });

    // Use a unique store name for the seed to avoid constraint conflicts if re-running
    const storeName = "Elite Boutique";
    const existingStore = await prisma.vendor.findFirst({
        where: { storeName, NOT: { userId: vendorUser.id } }
    });

    await prisma.vendor.upsert({
        where: { userId: vendorUser.id },
        update: {
            isApproved: true,
            storeName: existingStore ? `${storeName} ${Math.floor(Math.random() * 1000)}` : storeName
        },
        create: {
            storeName: existingStore ? `${storeName} ${Math.floor(Math.random() * 1000)}` : storeName,
            userId: vendorUser.id,
            isApproved: true,
            description: "Premium luxury items for the discerning customer.",
        },
    });
    console.log("Vendor created: vendor@alamode.com");

    // 3. Create Customer
    await prisma.user.upsert({
        where: { email: "customer@alamode.com" },
        update: { password: hashedPassword },
        create: {
            email: "customer@alamode.com",
            name: "Valued Customer",
            password: hashedPassword,
            role: "CUSTOMER",
        },
    });
    console.log("Customer created: customer@alamode.com");

    // 4. Create Categories
    const fashion = await prisma.category.upsert({
        where: { slug: "fashion" },
        update: {},
        create: { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" },
    });

    await prisma.category.upsert({
        where: { slug: "decoration" },
        update: {},
        create: { name: "Decoration", slug: "decoration", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" },
    });

    const tech = await prisma.category.upsert({
        where: { slug: "technology" },
        update: {},
        create: { name: "Technology", slug: "technology", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" },
    });
    console.log("Categories seeded.");

    // 5. Create some products for the vendor
    const vendor = await prisma.vendor.findUnique({ where: { userId: vendorUser.id } });
    if (vendor) {
        await prisma.product.deleteMany({ where: { vendorId: vendor.id } });
        await prisma.product.createMany({
            data: [
                {
                    name: "Diamond Encrusted Watch",
                    description: "A timeless masterpiece of luxury and precision.",
                    price: 4500000,
                    stock: 5,
                    categoryId: tech.id,
                    vendorId: vendor.id,
                    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop"],
                    isFeatured: true,
                },
                {
                    name: "Handcrafted Leather Bag",
                    description: "Pure Rwandan craftsmanship with imported Italian leather.",
                    price: 125000,
                    stock: 12,
                    categoryId: fashion.id,
                    vendorId: vendor.id,
                    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop"],
                    isFeatured: true,
                }
            ],
        });
        console.log("Products seeded.");
    }

    console.log("Seed finished successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
