import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
    try {
        console.log("Seeding verified data for Linda and Ghislain...");

        // 1. Create Admin
        const hashedAdminPassword = await bcrypt.hash("admin123", 10);
        await prisma.user.upsert({
            where: { email: "admin@alamode.com" },
            update: {},
            create: {
                name: "Admin User",
                email: "admin@alamode.com",
                password: hashedAdminPassword,
                role: "ADMIN",
            },
        });

        // 2. Create Vendor (Ghislain)
        const hashedVendorPassword = await bcrypt.hash("ghislain123", 10);
        const vendorUser = await prisma.user.upsert({
            where: { email: "ghislain@gmail.com" },
            update: { role: "VENDOR" },
            create: {
                name: "Ishimwe Ghislain",
                email: "ghislain@gmail.com",
                password: hashedVendorPassword,
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

        // 3. Create Customer (Linda)
        const hashedCustomerPassword = await bcrypt.hash("linda123", 10);
        const customerUser = await prisma.user.upsert({
            where: { email: "linda@gmail.com" },
            update: {},
            create: {
                name: "Linda",
                email: "linda@gmail.com",
                password: hashedCustomerPassword,
                role: "CUSTOMER",
            },
        });

        // 4. Create Category
        const category = await prisma.category.upsert({
            where: { slug: "luxury-watches" },
            update: {},
            create: {
                name: "Luxury Watches",
                slug: "luxury-watches",
            },
        });

        // 5. Create Product for Ghislain (Only one)
        const watch = await (prisma.product.upsert as any)({
            where: { id: "luxury-watch-01" },
            update: {
                vendorId: vendor.id,
                categoryId: category.id,
            },
            create: {
                id: "luxury-watch-01",
                name: "Rolex Submariner Gold",
                description: "The classic divers' watch, now in 18ct yellow gold. Waterproof to 300 metres.",
                price: 35000,
                stock: 10,
                images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1974&auto=format&fit=crop"],
                vendorId: vendor.id,
                categoryId: category.id,
                isFeatured: true,
                isTrending: true
            },
        });

        // 6. Delete old orders for these users
        await prisma.order.deleteMany({
            where: { userId: customerUser.id }
        });

        // 7. Create Multiple Orders for Linda (Many revenues for Ghislain)
        console.log("Creating specific orders for Linda buying from Ghislain...");
        const orderDates = [
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),  // 5 days ago
            new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),  // 1 day ago
            new Date() // Today
        ];

        for (let i = 0; i < orderDates.length; i++) {
            const paymentMethod = i % 2 === 0 ? "MOMO" : "CARD";
            const amount = watch.price;
            // The user said: "when customer pays the admin gets 5% and the vendor receives 95% left"
            // So we'll record the totalAmount as price + 0.
            // But we'll display the 5% split in dashboards.

            await prisma.order.create({
                data: {
                    userId: customerUser.id,
                    status: "PAID",
                    totalAmount: amount, // Keeping it simple, price = total
                    shippingAddress: "Kigali, Rwanda",
                    phone: "0788123456",
                    paymentMethod: paymentMethod,
                    createdAt: orderDates[i],
                    items: {
                        create: {
                            productId: watch.id,
                            quantity: 1,
                            price: watch.price,
                        },
                    },
                },
            });
        }

        return NextResponse.json({ message: "Seeding completed successfully!" });
    } catch (error: any) {
        console.error("Seeding failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
