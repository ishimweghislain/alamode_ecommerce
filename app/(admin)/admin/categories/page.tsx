import { prisma } from "@/lib/prisma";
import CategoriesClient from "@/components/admin/CategoriesClient";

export default async function AdminCategoriesPage() {
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

    return <CategoriesClient categories={categories} />;
}
