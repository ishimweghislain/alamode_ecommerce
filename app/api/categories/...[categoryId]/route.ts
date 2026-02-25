import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, slug, image } = body;

        const category = await prisma.category.update({
            where: { id: params.categoryId },
            data: { name, slug, image }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.category.delete({
            where: { id: params.categoryId }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
