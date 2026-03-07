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

        // Use try-catch for each to identify which one fails if any
        const safeCount = async (modelName: string, query: any) => {
            try {
                const model = (prisma as any)[modelName];
                if (!model) {
                    console.error(`[COUNT_ERROR] Model ${modelName} not found on prisma client`);
                    return 0;
                }
                return await model.count(query);
            } catch (err) {
                console.error(`[COUNT_ERROR] ${modelName} count failed:`, err);
                return 0;
            }
        };

        const [
            pendingVendors,
            activePromotions,
            newUsers,
            openTickets,
            pendingWithdrawals,
            unreadNotifications
        ] = await Promise.all([
            safeCount('vendor', { where: { isNew: true } }),
            safeCount('promotion', { where: { isNew: true } }),
            safeCount('user', { where: { isNew: true } }),
            safeCount('ticket', { where: { isNewForAdmin: true } }),
            safeCount('withdrawalRequest', { where: { isNew: true } }),
            safeCount('notification', { where: { userId: user.id, read: false } })
        ]);

        return NextResponse.json({
            pendingVendors,
            activePromotions,
            newUsers,
            openTickets,
            pendingWithdrawals,
            unreadNotifications
        });
    } catch (error) {
        console.error("[GLOBAL_COUNT_ERROR]", error);
        return NextResponse.json({
            pendingVendors: 0,
            activePromotions: 0,
            newUsers: 0,
            openTickets: 0,
            pendingWithdrawals: 0
        });
    }
}
