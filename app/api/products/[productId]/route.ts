import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const product = await (prisma.product.findUnique as any)({
            where: { id: params.productId },
            include: {
                category: true,
                subcategory: true,
                vendor: true,
                reviews: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, description, price, stock, categoryId, subcategoryId, images, isFeatured } = body;

        const product = await prisma.product.findUnique({
            where: { id: params.productId },
            include: { vendor: true }
        });

        if (!product) return new NextResponse("Product not found", { status: 404 });

        // Check ownership
        if (user.role === "VENDOR") {
            const vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
            if (!vendor || product.vendorId !== vendor.id) {
                return new NextResponse("Forbidden", { status: 403 });
            }
        }

        const updatedProduct = await (prisma.product.update as any)({
            where: { id: params.productId },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                stock: stock ? parseInt(stock) : undefined,
                categoryId,
                subcategoryId,
                images,
                isFeatured
            }
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const product = await prisma.product.findUnique({
            where: { id: params.productId }
        });

        if (!product) return new NextResponse("Product not found", { status: 404 });

        // Check ownership
        if (user.role === "VENDOR") {
            const vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
            if (!vendor || product.vendorId !== vendor.id) {
                return new NextResponse("Forbidden", { status: 403 });
            }
        }

        await prisma.product.delete({
            where: { id: params.productId }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
