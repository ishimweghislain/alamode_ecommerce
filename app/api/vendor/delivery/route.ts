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

    try {
        const fees = await prisma.deliveryFee.findMany({
            where: { vendorId: vendor.id }
        });

        return NextResponse.json(fees);
    } catch (error) {
        console.error("[VENDOR_DELIVERY_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
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

    const parsedFee = isNaN(parseFloat(fee)) ? 0 : parseFloat(fee);

    try {
        const deliveryFee = await (prisma.deliveryFee as any).upsert({
            where: {
                vendorId_district: {
                    vendorId: vendor.id,
                    district
                }
            },
            update: { fee: parsedFee },
            create: {
                vendorId: vendor.id,
                district,
                fee: parsedFee
            }
        });

        return NextResponse.json(deliveryFee);
    } catch (error) {
        console.error("[VENDOR_DELIVERY_POST_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
