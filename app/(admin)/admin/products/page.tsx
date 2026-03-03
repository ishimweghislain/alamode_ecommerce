import { prisma } from "@/lib/prisma";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            vendor: true,
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Inventory Management</h1>
                    <p className="text-gray-400">Curate the marketplace by featuring the best products.</p>
                </div>
            </div>

            <AdminProductsClient products={products} />
        </div>
    );
}
