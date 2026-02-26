import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

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

        // Calculate available balance
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
        items.forEach(item => {
            if (new Date(item.order.createdAt) < sevenDaysAgo) {
                totalCleared += item.price * item.quantity;
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

        if (amount > availableBalance) {
            return new NextResponse("Insufficient balance", { status: 400 });
        }

        const withdrawal = await prisma.withdrawalRequest.create({
            data: {
                amount: parseFloat(amount),
                vendorId: vendor.id,
                status: "PENDING"
            }
        });

        return NextResponse.json(withdrawal);
    } catch (error) {
        console.error("[WITHDRAWALS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
