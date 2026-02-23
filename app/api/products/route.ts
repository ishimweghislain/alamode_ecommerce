import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: user.id },
        });

        if (!vendor) {
            return new NextResponse("Vendor profile not found", { status: 404 });
        }

        const body = await req.json();
        const { name, description, price, stock, categoryId, images } = body;

        if (!name || !description || !price || !categoryId || !images || images.length === 0) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock: stock || 0,
                categoryId,
                vendorId: vendor.id,
                images,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PRODUCTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const isFeatured = searchParams.get("isFeatured");

        const products = await prisma.product.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(isFeatured && { isFeatured: true }),
            },
            include: {
                category: true,
                vendor: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
