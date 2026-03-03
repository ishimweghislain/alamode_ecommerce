import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const user = await getCurrentUser();

        if (user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { isFeatured, isTrending } = body;

        const product = await (prisma.product as any).update({
            where: { id: params.productId },
            data: {
                ...(typeof isFeatured === "boolean" && { isFeatured }),
                ...(typeof isTrending === "boolean" && { isTrending }),
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PRODUCT_PATCH_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
