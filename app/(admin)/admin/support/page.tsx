import { prisma } from "@/lib/prisma";
import SupportAdminClient from "@/components/admin/SupportAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return <SupportAdminClient tickets={tickets} />;
    } catch (error) {
        console.error("[ADMIN_SUPPORT_PAGE_ERROR]", error);
        return (
            <div className="card-luxury p-12 text-center space-y-6">
                <h3 className="text-xl font-bold text-white">Support Database Integration Error</h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                    We encountered an issue connecting to the tickets database. Please ensure the database is synchronized or contact the system administrator.
                </p>
                <div className="text-xs text-red-500/50 mt-4 font-mono">
                    ERROR: {error instanceof Error ? error.message : "System Exception"}
                </div>
            </div>
        );
    }
}
