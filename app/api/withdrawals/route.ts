import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notifyAdmins } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: user.id }
        });

        if (!vendor) {
            return new NextResponse("Vendor profile not found", { status: 404 });
        }

        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return new NextResponse("Invalid amount", { status: 400 });
        }

        // Calculate available balance (95% after platform fee)
        const items = await prisma.orderItem.findMany({
            where: {
                product: { vendorId: vendor.id },
                order: {
                    status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
                }
            },
            include: { order: true }
        }) as any[];

        let totalCleared = 0;
        items.forEach(item => {
            // Funds clear when Shipped or Delivered
            if (['SHIPPED', 'DELIVERED'].includes(item.order.status)) {
                totalCleared += (item.price * item.quantity) * 0.95;
            }
        });

        const withdrawalSum = await prisma.withdrawalRequest.aggregate({
            where: {
                vendorId: vendor.id,
                status: { in: ['PENDING', 'APPROVED', 'COMPLETED'] }
            },
            _sum: { amount: true }
        });

        const availableBalance = Math.max(0, totalCleared - (withdrawalSum._sum.amount || 0));

        if (parseFloat(amount) > availableBalance) {
            return new NextResponse("Insufficient cleared balance", { status: 400 });
        }

        const withdrawal = await prisma.withdrawalRequest.create({
            data: {
                amount: parseFloat(amount),
                vendorId: vendor.id,
                status: "PENDING"
            }
        });

        await notifyAdmins({
            title: "New Withdrawal Request",
            message: `${vendor.storeName} has requested a withdrawal of RWF ${parseFloat(amount).toLocaleString()}.`,
            type: "INFO",
            link: "/admin/withdrawals"
        });

        return NextResponse.json(withdrawal);
    } catch (error) {
        console.error("[WITHDRAWALS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
