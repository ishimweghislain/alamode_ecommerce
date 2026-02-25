import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { items, shippingAddress, phone } = body;

        if (!items || items.length === 0) {
            return new NextResponse("No items in cart", { status: 400 });
        }

        const line_items = items.map((item: any) => ({
            quantity: item.quantity,
            price_data: {
                currency: "rwf",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price), // Stripe expects cents, but RWF is zero-decimal. Stripe handles RWF correctly.
            },
        }));

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=1`,
            metadata: {
                userId: user.id,
                shippingAddress,
                phone,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
