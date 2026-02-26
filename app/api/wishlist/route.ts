import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                wishlist: {
                    include: {
                        category: true,
                        vendor: true,
                    }
                }
            }
        });

        return NextResponse.json(fullUser?.wishlist || []);
    } catch (error) {
        console.error("[WISHLIST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { productId } = await req.json();

        if (!productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { wishlist: true }
        });

        const isWishlisted = fullUser?.wishlist.some(p => p.id === productId);

        if (isWishlisted) {
            // Remove
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    wishlist: {
                        disconnect: { id: productId }
                    }
                }
            });
            return NextResponse.json({ message: "Removed from wishlist", status: "removed" });
        } else {
            // Add
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    wishlist: {
                        connect: { id: productId }
                    }
                }
            });
            return NextResponse.json({ message: "Added to wishlist", status: "added" });
        }
    } catch (error) {
        console.error("[WISHLIST_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
