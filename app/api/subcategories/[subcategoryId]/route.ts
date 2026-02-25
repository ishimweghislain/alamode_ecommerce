import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ subcategoryId: string }> }
) {
    try {
        const { subcategoryId } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, slug, categoryId } = body;

        const subcategory = await (prisma as any).subcategory.update({
            where: { id: subcategoryId },
            data: { name, slug, categoryId }
        });

        return NextResponse.json(subcategory);
    } catch (error) {
        console.error("[SUBCATEGORY_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ subcategoryId: string }> }
) {
    try {
        const { subcategoryId } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await (prisma as any).subcategory.delete({
            where: { id: subcategoryId }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[SUBCATEGORY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
