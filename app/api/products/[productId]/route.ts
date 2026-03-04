import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const user = await getCurrentUser();
        const { productId } = await params;

        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();

        // ADMIN: toggle featured/trending
        if (user.role === "ADMIN") {
            const { isFeatured, isTrending } = body;
            const product = await prisma.product.update({
                where: { id: productId },
                data: {
                    ...(typeof isFeatured === "boolean" && { isFeatured }),
                    ...(typeof isTrending === "boolean" && { isTrending }),
                },
            });
            return NextResponse.json(product);
        }

        // VENDOR: full product update
        if (user.role === "VENDOR") {
            const vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
            if (!vendor) return new NextResponse("Vendor not found", { status: 404 });

            // Ensure vendor owns this product
            const existing = await prisma.product.findUnique({ where: { id: productId } });
            if (!existing || existing.vendorId !== vendor.id) {
                return new NextResponse("Forbidden", { status: 403 });
            }

            const { name, description, price, stock, categoryId, subcategoryId, images, sizes, sizeType } = body;
            const product = await prisma.product.update({
                where: { id: productId },
                data: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(price && { price: parseFloat(price) }),
                    ...(stock !== undefined && { stock: parseInt(stock) }),
                    ...(categoryId && { categoryId }),
                    subcategoryId: subcategoryId || null,
                    ...(images && { images }),
                    ...(sizes !== undefined && { sizes }),
                    sizeType: sizeType || null,
                },
            });
            return NextResponse.json(product);
        }

        return new NextResponse("Forbidden", { status: 403 });
    } catch (error) {
        console.error("[PRODUCT_PATCH_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { productId } = await params;
        await prisma.product.delete({ where: { id: productId } });
        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        console.error("[PRODUCT_DELETE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

