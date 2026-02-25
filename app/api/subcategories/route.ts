import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, slug, categoryId } = body;

        if (!name || !slug || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const subcategory = await (prisma as any).subcategory.create({
            data: { name, slug, categoryId }
        });

        return NextResponse.json(subcategory);
    } catch (error) {
        console.error("[SUBCATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
