import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import TicketDetailClient from "@/components/TicketDetailClient";
import { notFound, redirect } from "next/navigation";

interface TicketPageProps {
    params: Promise<{
        ticketId: string;
    }>;
}

export const dynamic = "force-dynamic";

export default async function SupportTicketPage({ params }: TicketPageProps) {
    const { ticketId } = await params;
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

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

    if (!ticket) return notFound();

    // Check permissions
    if (ticket.userId !== user.id && user.role !== "ADMIN") {
        return forbidden();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
            <TicketDetailClient ticket={ticket} currentUserId={user.id} />
        </div>
    );
}

function forbidden() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-4xl text-red-500">🔒</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Access Denied</h1>
            <p className="text-gray-400 max-w-md">You do not have permission to view this ticket. Our security team has been notified of this attempt.</p>
            <Link href="/support" className="btn-primary px-8">Return to Center</Link>
        </div>
    );
}

import Link from "next/link";
