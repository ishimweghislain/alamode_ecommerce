import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { items, shippingAddress, district, phone, paymentMethod, totalAmount, deliveryFee } = body;

        if (!items || items.length === 0) {
            return new NextResponse("Invalid order items", { status: 400 });
        }

        // Simulation: Add a 2s delay to mimic payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                shippingAddress,
                district,
                phone,
                paymentMethod,
                totalAmount,
                deliveryFee: deliveryFee || 0,
                status: "PAID", // Simulation: Auto-mark as PAID
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId || item.id.split("-")[0],
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                    })),
                },
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
