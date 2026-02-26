import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import SupportClient from "@/components/SupportClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SupportOverviewPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    const tickets = await prisma.ticket.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
            <SupportClient tickets={tickets} />
        </div>
    );
}
