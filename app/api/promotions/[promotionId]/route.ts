import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// DELETE deactivate/cancel a promotion
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ promotionId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
        if (!vendor) return new NextResponse("Vendor not found", { status: 404 });

        const { promotionId } = await params;

        const promotion = await prisma.promotion.findUnique({ where: { id: promotionId } });
        if (!promotion || promotion.vendorId !== vendor.id) {
            return new NextResponse("Promotion not found or not yours", { status: 403 });
        }

        await prisma.promotion.update({
            where: { id: promotionId },
            data: { isActive: false },
        });

        return NextResponse.json({ message: "Promotion cancelled" });
    } catch (error) {
        console.error("[PROMOTION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
