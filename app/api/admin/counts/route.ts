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

        const [pendingVendors, activePromotions, newUsers, openTickets, pendingWithdrawals] = await Promise.all([
            prisma.vendor.count({ where: { isNew: true } }),
            (prisma as any).promotion.count({ where: { isNew: true } }),
            prisma.user.count({ where: { isNew: true } }),
            prisma.ticket.count({ where: { isNew: true } }),
            (prisma.withdrawalRequest as any).count({ where: { isNew: true } })
        ]);

        return NextResponse.json({
            pendingVendors,
            activePromotions,
            newUsers,
            openTickets,
            pendingWithdrawals
        });
    } catch (error) {
        console.error("[COUNT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
