import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: user.id }
        });

        if (!vendor) {
            return new NextResponse("Vendor not found", { status: 404 });
        }

        const [newOrders, openTickets] = await Promise.all([
            (prisma.orderItem as any).count({
                where: {
                    product: { vendorId: vendor.id },
                    isNewForVendor: true
                }
            }).catch((err: any) => {
                console.error("[VENDOR_COUNT_ERROR] orderItem count failed:", err);
                return 0;
            }),
            prisma.ticket.count({
                where: {
                    userId: user.id,
                    isNewForUser: true
                }
            }).catch((err: any) => {
                console.error("[VENDOR_COUNT_ERROR] ticket count failed:", err);
                return 0;
            })
        ]);

        return NextResponse.json({
            newOrders,
            openTickets
        });
    } catch (error) {
        console.error("[VENDOR_COUNT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
