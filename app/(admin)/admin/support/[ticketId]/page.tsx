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
                        <p className="text-[10px] b-gray-500 font-mono text-gray-500">USER: {ticket.user.email} • ID: {ticket.id}</p>
                    </div>
                </div>
                <TicketAdminControls ticketId={ticket.id} currentStatus={ticket.status} />
            </div>

            <TicketDetailClient ticket={ticket} currentUserId={user.id} />
        </div>
    );
}
