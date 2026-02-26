import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const { ticketId } = await params;
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                user: {
                    select: {
                        name: true,
                        role: true
                    }
                }
            }
        });

        if (!ticket) return new NextResponse("Not Found", { status: 404 });

        // Check permissions
        if (ticket.userId !== user.id && user.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const { ticketId } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        const ticket = await prisma.ticket.update({
            where: { id: ticketId },
            data: { status }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
