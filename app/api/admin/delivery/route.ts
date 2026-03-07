import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const vendors = await prisma.vendor.findMany({
        include: {
            deliveryFees: true
        }
    });

    return NextResponse.json(vendors);
}
