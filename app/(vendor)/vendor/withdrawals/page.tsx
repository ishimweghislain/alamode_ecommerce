import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import WithdrawalsClient from "@/components/vendor/WithdrawalsClient";
import { CreditCard } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VendorWithdrawalsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) {
        return (
            <div className="card-luxury p-12 text-center space-y-6">
                <div className="h-20 w-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard className="h-10 w-10 text-brand-gold" />
                </div>
                <h3 className="text-xl font-bold text-white">Boutique Not Found</h3>
                <p className="text-gray-400 max-w-sm mx-auto">Your financial profile could not be initialized as your boutique profile is missing. Please contact support.</p>
                <Link href="/" className="btn-primary px-8 py-3 inline-block">Return Home</Link>
            </div>
        );
    }

    // Financial calculations
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const items = await prisma.orderItem.findMany({
        where: {
            product: { vendorId: vendor.id },
            order: {
                status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
            }
        },
        include: { order: true }
    });

    let totalCleared = 0;
    let totalPending = 0;

    items.forEach(item => {
        const netAmount = (item.price * item.quantity) * 0.95;
        if (item.order.status === 'SHIPPED' || item.order.status === 'DELIVERED') {
            totalCleared += netAmount;
        } else {
            totalPending += netAmount;
        }
    });

    const withdrawals = await prisma.withdrawalRequest.findMany({
        where: { vendorId: vendor.id },
        orderBy: { createdAt: 'desc' }
    });

    const withdrawalSum = await prisma.withdrawalRequest.aggregate({
        where: {
            vendorId: vendor.id,
            status: { in: ['PENDING', 'APPROVED', 'COMPLETED'] }
        },
        _sum: { amount: true }
    });

    const availableBalance = Math.max(0, totalCleared - (withdrawalSum._sum.amount || 0));

    return (
        <WithdrawalsClient
            availableBalance={availableBalance}
            pendingClearance={totalPending}
            withdrawals={withdrawals}
        />
    );
}
