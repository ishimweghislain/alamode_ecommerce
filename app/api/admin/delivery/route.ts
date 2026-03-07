import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const vendors = await prisma.vendor.findMany({
            include: {
                deliveryFees: true
            }
        });

        return NextResponse.json(vendors);
    } catch (error) {
        console.error("[ADMIN_DELIVERY_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
