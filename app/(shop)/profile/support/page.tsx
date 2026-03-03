import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import SupportClient from "@/components/SupportClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerSupportPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    const tickets = await prisma.ticket.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <SupportClient tickets={tickets} />
        </div>
    );
}
