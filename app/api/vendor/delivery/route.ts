import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser();
    if (!user || user.role !== "VENDOR") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) {
        return new NextResponse("Vendor not found", { status: 404 });
    }

    const fees = await prisma.deliveryFee.findMany({
        where: { vendorId: vendor.id }
    });

    return NextResponse.json(fees);
}

export async function POST(req: Request) {
    const user = await getCurrentUser();
    if (!user || user.role !== "VENDOR") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) {
        return new NextResponse("Vendor not found", { status: 404 });
    }

    const { district, fee } = await req.json();

    const deliveryFee = await prisma.deliveryFee.upsert({
        where: {
            vendorId_district: {
                vendorId: vendor.id,
                district
            }
        },
        update: { fee: parseFloat(fee) },
        create: {
            vendorId: vendor.id,
            district,
            fee: parseFloat(fee)
        }
    });

    return NextResponse.json(deliveryFee);
}
