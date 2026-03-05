import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import TicketDetailClient from "@/components/TicketDetailClient";
import TicketAdminControls from "@/components/admin/TicketAdminControls";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TicketPageProps {
    params: Promise<{
        ticketId: string;
    }>;
}

export const dynamic = "force-dynamic";

export default async function AdminTicketDetailPage({ params }: TicketPageProps) {
    try {
        const { ticketId } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
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
                        email: true,
                        role: true
                    }
                }
            }
        });

        if (!ticket) return notFound();

        return (
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link href="/admin/support" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Command Center
                        </Link>
                        <h1 className="text-3xl font-outfit font-bold text-white mb-2 leading-tight">Inspecting: {ticket.subject}</h1>
                        <div className="flex items-center gap-4">
                            <p className="text-[10px] font-mono text-gray-500">USER: {ticket.user?.email || "No Email"} • ID: {ticket.id}</p>
                        </div>
                    </div>
                    <TicketAdminControls ticketId={ticket.id} currentStatus={ticket.status} />
                </div>

                <TicketDetailClient ticket={ticket} currentUserId={user.id} />
            </div>
        );
    } catch (error) {
        console.error("[ADMIN_TICKET_DETAIL_ERROR]", error);
        return (
            <div className="card-luxury p-12 text-center space-y-6">
                <h3 className="text-xl font-bold text-white">Ticket Retrieval Error</h3>
                <p className="text-gray-400 max-w-sm mx-auto">This ticket could not be retrieved from the database.</p>
                <Link href="/admin/support" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                    <ArrowLeft className="h-4 w-4" /> Return to Tickets
                </Link>
            </div>
        );
    }
}
