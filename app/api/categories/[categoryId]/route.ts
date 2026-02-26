import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, slug, image, subcategories } = body;

        // Perform the update in a transaction to ensure consistency
        const category = await prisma.$transaction(async (tx) => {
            // 1. Update the category basic info
            const updatedCategory = await tx.category.update({
                where: { id: categoryId },
                data: { name, slug, image }
            });

            if (subcategories) {
                // 2. Get existing subcategories to identify deletions
                const existingSubcategories = await tx.subcategory.findMany({
                    where: { categoryId }
                });

                const existingIds = existingSubcategories.map(s => s.id);
                const incomingIds = subcategories.map((s: any) => s.id).filter(Boolean);

                const toDelete = existingIds.filter(id => !incomingIds.includes(id));

                // 3. Delete removed subcategories
                if (toDelete.length > 0) {
                    await tx.subcategory.deleteMany({
                        where: { id: { in: toDelete } }
                    });
                }

                // 4. Upsert incoming subcategories
                for (const sub of subcategories) {
                    if (sub.id) {
                        await tx.subcategory.update({
                            where: { id: sub.id },
                            data: { name: sub.name, slug: sub.slug }
                        });
                    } else {
                        await tx.subcategory.create({
                            data: {
                                name: sub.name,
                                slug: sub.slug,
                                categoryId
                            }
                        });
                    }
                }
            }

            return updatedCategory;
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.category.delete({
            where: { id: categoryId }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
