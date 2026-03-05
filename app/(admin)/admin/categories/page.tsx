import { prisma } from "@/lib/prisma";
import CategoriesClient from "@/components/admin/CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    try {
        const categories = await (prisma as any).category.findMany({
            include: {
                subcategories: true,
                _count: {
                    select: { products: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        }).catch(() => []);

        return <CategoriesClient categories={categories} />;
    } catch (error) {
        return <CategoriesClient categories={[]} />;
    }
}
