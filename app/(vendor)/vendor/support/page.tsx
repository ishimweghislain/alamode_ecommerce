import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import SupportClient from "@/components/SupportClient";
import { redirect } from "next/navigation";
import { HelpCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VendorSupportPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) {
        return (
            <div className="card-luxury p-12 text-center space-y-6">
                <div className="h-20 w-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="h-10 w-10 text-brand-gold" />
                </div>
                <h3 className="text-xl font-bold text-white">Boutique Not Found</h3>
                <p className="text-gray-400 max-w-sm mx-auto">Your boutique profile could not be located. Please contact support via WhatsApp/Call for immediate assistance.</p>
                <Link href="/" className="btn-primary px-8 py-3 inline-block">Return Home</Link>
            </div>
        );
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
