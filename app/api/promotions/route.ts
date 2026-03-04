import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET all active promotions (for the public promotions page)
export async function GET() {
    try {
        const now = new Date();
        const promotions = await prisma.promotion.findMany({
            where: {
                isActive: true,
                expiresAt: { gt: now },
            },
            include: {
                product: {
                    include: { category: true, vendor: true }
                },
                vendor: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(promotions);
    } catch (error) {
        console.error("[PROMOTIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST create a new promotion (vendor only)
export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
        if (!vendor) return new NextResponse("Vendor not found", { status: 404 });

        const { productId, discountPct, durationDays, label } = await req.json();

        if (!productId || !discountPct || !durationDays) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Verify this product belongs to this vendor
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product || product.vendorId !== vendor.id) {
            return new NextResponse("Product not found or not yours", { status: 403 });
        }

        // Deactivate any existing active promotion for this product first
        await prisma.promotion.updateMany({
            where: { productId, isActive: true },
            data: { isActive: false },
        });

        const salePrice = product.price * (1 - discountPct / 100);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + Number(durationDays));

        const promotion = await prisma.promotion.create({
            data: {
                productId,
                vendorId: vendor.id,
                discountPct: Number(discountPct),
                originalPrice: product.price,
                salePrice: Math.round(salePrice),
                durationDays: Number(durationDays),
                expiresAt,
                label: label || null,
                isActive: true,
            },
        });

        return NextResponse.json(promotion);
    } catch (error) {
        console.error("[PROMOTIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
