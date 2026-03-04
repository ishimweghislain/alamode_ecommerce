import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({ products: [], vendors: [] });
        }

        const [products, vendors, categories] = await Promise.all([
            (prisma.product as any).findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    images: true,
                    vendor: {
                        select: { storeName: true }
                    }
                }
            }),
            prisma.vendor.findMany({
                where: {
                    AND: [
                        { isApproved: true },
                        {
                            OR: [
                                { storeName: { contains: query, mode: "insensitive" } },
                                { description: { contains: query, mode: "insensitive" } },
                            ],
                        }
                    ],
                },
                take: 3,
                select: {
                    id: true,
                    storeName: true,
                    logo: true,
                    description: true,
                }
            }),
            prisma.category.findMany({
                where: {
                    name: { contains: query, mode: "insensitive" }
                },
                take: 3,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            })
        ]);

        return NextResponse.json({ products, vendors, categories });
    } catch (error) {
        console.error("[SEARCH_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
