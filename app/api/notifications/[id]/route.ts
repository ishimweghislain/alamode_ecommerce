import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { read } = body;

        const updated = await prisma.notification.update({
            where: { id, userId: user.id },
            data: { read: !!read },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[NOTIFICATION_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        await prisma.notification.delete({
            where: { id, userId: user.id },
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[NOTIFICATION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
