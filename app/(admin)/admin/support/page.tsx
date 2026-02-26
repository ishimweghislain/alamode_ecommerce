import { prisma } from "@/lib/prisma";
import SupportAdminClient from "@/components/admin/SupportAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
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
}
