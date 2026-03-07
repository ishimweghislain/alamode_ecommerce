import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notifyAdmins, createNotification } from "@/lib/notifications";

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

        // Update ticket's updatedAt timestamp and notification flags
        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                updatedAt: new Date(),
                isNewForAdmin: user.role !== "ADMIN",
                isNewForUser: user.role === "ADMIN"
            }
        });

        // Send notifications
        if (user.role === "ADMIN") {
            // Notify the ticket owner
            const owner = await prisma.user.findUnique({ where: { id: ticket.userId } });
            if (owner) {
                await createNotification({
                    userId: owner.id,
                    title: "Support Ticket Response",
                    message: `An admin has responded to your ticket: "${ticket.subject}"`,
                    type: "SUCCESS",
                    link: owner.role === "VENDOR" ? "/vendor/support" : "/profile/support"
                });
            }
        } else {
            // Notify admins
            await notifyAdmins({
                title: "New Message on Ticket",
                message: `New response from ${user.name || user.email} on ticket "${ticket.subject}"`,
                type: "INFO",
                link: "/admin/support"
            });
        }

        return NextResponse.json(newMessage);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
