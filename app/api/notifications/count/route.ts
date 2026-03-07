import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const count = await prisma.notification.count({
            where: { userId: user.id, read: false },
        });

        return NextResponse.json({ count });
    } catch (error) {
        return NextResponse.json({ count: 0 });
    }
}
