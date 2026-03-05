import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const [openTickets] = await Promise.all([
            prisma.ticket.count({
                where: {
                    userId: user.id,
                    isNewForUser: true
                }
            }).catch(() => 0)
        ]);

        return NextResponse.json({
            openTickets
        });
    } catch (error) {
        console.error("[PROFILE_COUNT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
