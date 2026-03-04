import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: user.id }
        });

        if (!vendor) return new NextResponse("Vendor not found", { status: 404 });

        const { type } = await req.json();

        if (type === "orders") {
            await (prisma.orderItem as any).updateMany({
                where: {
                    product: { vendorId: vendor.id },
                    isNew: true
                },
                data: { isNew: false }
            });
        } else if (type === "support") {
            await prisma.ticket.updateMany({
                where: { userId: user.id, isNew: true },
                data: { isNew: false }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[VENDOR_RESET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
