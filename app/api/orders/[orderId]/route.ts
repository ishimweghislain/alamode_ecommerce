import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        const user = await getCurrentUser();
        const body = await req.json();
        const { status } = body;

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        // Check Permissions
        const isAdmin = user.role === "ADMIN";
        const isCustomer = user.role === "CUSTOMER" && order.userId === user.id;

        if (!isAdmin) {
            // Customers can ONLY mark as DELIVERED if it's currently SHIPPED
            if (isCustomer) {
                if (status !== "DELIVERED" || order.status !== "SHIPPED") {
                    return new NextResponse("Invalid status transition for customer", { status: 400 });
                }
            } else {
                return new NextResponse("Forbidden", { status: 403 });
            }
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("[ORDER_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
