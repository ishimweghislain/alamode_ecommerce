import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { district, items } = await req.json();

        if (!district || !items || items.length === 0) {
            return NextResponse.json({ fee: 0 });
        }

        // Get unique vendor IDs from items
        // We need to fetch the products to get their vendor IDs if they aren't in the item object
        const productIds = items.map((item: any) => item.productId || item.id.split("-")[0]);

        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { vendorId: true }
        });

        const vendorIds = Array.from(new Set(products.map(p => p.vendorId)));

        // Fetch delivery fees for these vendors in the selected district
        const deliveryFees = await prisma.deliveryFee.findMany({
            where: {
                district,
                vendorId: { in: vendorIds }
            }
        });

        // Sum up the fees. If a vendor has no fee set, it defaults to 0 as intended
        const totalFee = deliveryFees.reduce((sum: number, feeObj: any) => sum + (feeObj.fee || 0), 0);

        return NextResponse.json({ fee: totalFee });
    } catch (error) {
        console.error("Error calculating delivery fee:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
