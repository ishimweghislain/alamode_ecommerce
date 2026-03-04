import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { type } = await req.json();

        if (type === "vendors") {
            await (prisma.vendor as any).updateMany({ where: { isNew: true }, data: { isNew: false } });
        } else if (type === "promotions") {
            await (prisma as any).promotion.updateMany({ where: { isNew: true }, data: { isNew: false } });
        } else if (type === "users") {
            await (prisma.user as any).updateMany({ where: { isNew: true }, data: { isNew: false } });
        } else if (type === "support") {
            await (prisma.ticket as any).updateMany({ where: { isNewForAdmin: true }, data: { isNewForAdmin: false } });
        } else if (type === "withdrawals") {
            await (prisma.withdrawalRequest as any).updateMany({ where: { isNew: true }, data: { isNew: false } });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[COUNT_RESET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
