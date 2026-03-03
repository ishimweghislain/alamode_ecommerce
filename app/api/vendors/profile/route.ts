import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "VENDOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { storeName, description, logo } = body;

        if (!storeName) {
            return new NextResponse("Store name is required", { status: 400 });
        }

        const vendor = await prisma.vendor.update({
            where: { userId: user.id },
            data: {
                storeName,
                description,
                logo,
            },
        });

        return NextResponse.json(vendor);
    } catch (error) {
        console.error("[VENDOR_PATCH_ERROR]", error);
        return new NextResponse(`Internal Error: ${(error as any).message}`, { status: 500 });
    }
}
