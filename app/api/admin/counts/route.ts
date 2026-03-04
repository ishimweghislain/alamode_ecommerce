import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const [pendingVendors, activePromotions, newUsers, openTickets] = await Promise.all([
            prisma.vendor.count({ where: { isApproved: false } }),
            (prisma as any).promotion.count({ where: { isActive: true } }),
            prisma.user.count({
                where: {
                    createdAt: {
                        gt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24h
                    }
                }
            }),
            prisma.ticket.count({ where: { status: "OPEN" } })
        ]);

        return NextResponse.json({
            pendingVendors,
            activePromotions,
            newUsers,
            openTickets
        });
    } catch (error) {
        console.error("[COUNT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
