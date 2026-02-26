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

        // Check Permissions: ADMIN or VENDOR (if vendor owns a product in the order)
        const isOwner = order.items.some(item => item.product.vendorId === user.vendor?.id);
        const isAdmin = user.role === "ADMIN";

        if (!isAdmin && !isOwner) {
            return new NextResponse("Forbidden", { status: 403 });
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
