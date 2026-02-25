import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
    try {
        const categories = await (prisma.category.findMany as any)({
            include: {
                subcategories: true,
                _count: {
                    select: { products: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, slug, image } = body;

        if (!name || !slug) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const category = await prisma.category.create({
            data: { name, slug, image }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
