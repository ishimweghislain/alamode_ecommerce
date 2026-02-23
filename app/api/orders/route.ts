import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { items, shippingAddress, phone, paymentMethod, totalAmount } = body;

        if (!items || items.length === 0) {
            return new NextResponse("Invalid order items", { status: 400 });
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                shippingAddress,
                phone,
                paymentMethod,
                totalAmount,
                status: "PENDING",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        // Here you would integrate with MTN/Airtel/Visa API
        // For now, we return the order ID and simulate success

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
