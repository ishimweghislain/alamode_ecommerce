import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { type } = await req.json();

        if (type === "support") {
            await prisma.ticket.updateMany({
                where: { userId: user.id, isNewForUser: true },
                data: { isNewForUser: false }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[PROFILE_RESET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
