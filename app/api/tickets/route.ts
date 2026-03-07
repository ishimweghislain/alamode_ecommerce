import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notifyAdmins } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const tickets = await prisma.ticket.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { messages: true }
                }
            }
        });

        return NextResponse.json(tickets);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const { subject, message, priority = "NORMAL" } = await req.json();

        if (!subject || !message) {
            return new NextResponse("Subject and message are required", { status: 400 });
        }

        const ticket = await prisma.ticket.create({
            data: {
                subject,
                priority,
                userId: user.id,
                messages: {
                    create: {
                        message,
                        userId: user.id,
                        isAdmin: user.role === "ADMIN"
                    }
                }
            }
        });

        await notifyAdmins({
            title: "New Support Ticket",
            message: `New ticket from ${user.name || user.email} regarding "${subject}"`,
            type: "INFO",
            link: "/admin/support"
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("[TICKETS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
