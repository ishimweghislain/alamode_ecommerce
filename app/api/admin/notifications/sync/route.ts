import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";
import { notifyAdmins, createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let syncCount = 0;

        // 1. Sync Pending Vendors -> Notifications for Admins
        const pendingVendors = await prisma.vendor.findMany({
            where: { isNew: true },
            select: { id: true, storeName: true, createdAt: true }
        });

        for (const v of pendingVendors) {
            await notifyAdmins({
                title: "New Boutique Application",
                message: `Boutique "${v.storeName}" is awaiting approval. Received: ${v.createdAt.toLocaleDateString()}`,
                type: "WARNING",
                link: `/admin/vendors`
            });
            await prisma.vendor.update({ where: { id: v.id }, data: { isNew: false } });
            syncCount++;
        }

        // 2. Sync Pending Withdrawals -> Notifications for Admins
        const pendingWithdrawals = await prisma.withdrawalRequest.findMany({
            where: { isNew: true },
            include: { vendor: true }
        });

        for (const w of pendingWithdrawals) {
            await notifyAdmins({
                title: "Withdrawal Request Pending",
                message: `${w.vendor.storeName} has requested a withdrawal of RWF ${w.amount.toLocaleString()}`,
                type: "INFO",
                link: `/admin/withdrawals`
            });
            await prisma.withdrawalRequest.update({ where: { id: w.id }, data: { isNew: false } });
            syncCount++;
        }

        // 3. Sync New Tickets for Admins
        const adminTickets = await prisma.ticket.findMany({
            where: { isNewForAdmin: true },
            include: { user: true }
        });

        for (const t of adminTickets) {
            await notifyAdmins({
                title: "New Support Ticket",
                message: `New ticket from ${t.user.name || t.user.email} regarding "${t.subject}"`,
                type: "INFO",
                link: `/admin/support`
            });
            await prisma.ticket.update({ where: { id: t.id }, data: { isNewForAdmin: false } });
            syncCount++;
        }

        // 4. Sync New Tickets for Users (Vendors or Customers)
        const userTickets = await prisma.ticket.findMany({
            where: { isNewForUser: true },
            include: { user: true }
        });

        for (const t of userTickets) {
            await createNotification({
                userId: t.userId,
                title: "Support Ticket Update",
                message: `An admin has responded to your ticket "${t.subject}"`,
                type: "SUCCESS",
                link: t.user.role === "VENDOR" ? "/vendor/support" : "/profile/support"
            });
            await prisma.ticket.update({ where: { id: t.id }, data: { isNewForUser: false } });
            syncCount++;
        }

        // 5. Sync New Orders -> Notifications for Vendors
        // For orders, it's more complex since one order has multiple items from different vendors
        const newOrderItems = await prisma.orderItem.findMany({
            where: { isNewForVendor: true },
            include: {
                product: { include: { vendor: true } },
                order: true
            }
        });

        // Group by vendor to avoid duplicate notifications for the same order
        const vendorOrderData: Record<string, Set<string>> = {};
        for (const item of newOrderItems) {
            const vendorUserId = item.product.vendor.userId;
            if (!vendorOrderData[vendorUserId]) vendorOrderData[vendorUserId] = new Set();
            vendorOrderData[vendorUserId].add(item.order.id);
            await prisma.orderItem.update({ where: { id: item.id }, data: { isNewForVendor: false } });
        }

        for (const [vUserId, orderIds] of Object.entries(vendorOrderData)) {
            for (const orderId of Array.from(orderIds)) {
                await createNotification({
                    userId: vUserId,
                    title: "New Order Confirmed",
                    message: `You have received a new order ${orderId.slice(-6).toUpperCase()} waiting for shipment.`,
                    type: "SUCCESS",
                    link: "/vendor/orders"
                });
                syncCount++;
            }
        }

        // 6. Sync New Users -> Notifications for Admins
        const newUsersCount = await prisma.user.count({ where: { isNew: true, role: "CUSTOMER" } });
        if (newUsersCount > 0) {
            await notifyAdmins({
                title: "User Growth Milestone",
                message: `You have ${newUsersCount} new users recently registered in the marketplace.`,
                type: "SUCCESS",
                link: "/admin/users"
            });
            await prisma.user.updateMany({ where: { isNew: true, role: "CUSTOMER" }, data: { isNew: false } });
            syncCount++;
        }

        return NextResponse.json({ syncCount });
    } catch (error) {
        console.error("[SYNC_NOTIFICATIONS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
