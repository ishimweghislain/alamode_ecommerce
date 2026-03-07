import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT() {
    try {
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        await prisma.notification.updateMany({
            where: { userId: user.id, read: false },
            data: { read: true },
        });

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        console.error("[NOTIFICATIONS_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
