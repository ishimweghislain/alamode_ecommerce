import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import SupportClient from "@/components/SupportClient";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CustomerSupportPage() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            redirect("/login");
        }

        const tickets = await prisma.ticket.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' }
        }).catch((err) => {
            console.error("[CUSTOMER_SUPPORT_TICKETS_ERROR]", err);
            return [];
        });

        return (
            <div className="space-y-8">
                <SupportClient tickets={tickets} />
            </div>
        );
    } catch (error) {
        console.error("[CUSTOMER_SUPPORT_PAGE_ERROR]", error);
        return (
            <div className="space-y-8 card-luxury p-12 text-center">
                <h3 className="text-xl font-bold text-white">Concierge Connectivity Error</h3>
                <p className="text-gray-400 max-w-md mx-auto">We are unable to sync with the support desk. Please retry after a brief moment.</p>
                <Link href="/profile/support" className="btn-primary px-8 py-3 mt-4 inline-block">Refresh Connection</Link>
            </div>
        );
    }
}
