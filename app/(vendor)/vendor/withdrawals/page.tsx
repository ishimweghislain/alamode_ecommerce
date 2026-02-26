import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import WithdrawalsClient from "@/components/vendor/WithdrawalsClient";

export const dynamic = "force-dynamic";

export default async function VendorWithdrawalsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) return <div>Store not found.</div>;

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
        const amount = item.price * item.quantity;
        if (new Date(item.order.createdAt) < sevenDaysAgo) {
            totalCleared += amount;
        } else {
            totalPending += amount;
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
