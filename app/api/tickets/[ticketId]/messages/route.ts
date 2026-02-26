import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const { ticketId } = await params;
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { message } = body;

        if (!message) return new NextResponse("Message is required", { status: 400 });

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId }
        });

        if (!ticket) return new NextResponse("Not Found", { status: 404 });

        // Check Permissions
        if (ticket.userId !== user.id && user.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const newMessage = await prisma.ticketMessage.create({
            data: {
                message,
                userId: user.id,
                ticketId: ticketId,
                isAdmin: user.role === "ADMIN"
            }
        });

        // Update ticket's updatedAt timestamp
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
