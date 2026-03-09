import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import VendorProductsClient from "@/components/vendor/VendorProductsClient";

export default async function VendorProductsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) return <div>Store not found.</div>;

    const products = await prisma.product.findMany({
        where: { vendorId: vendor.id },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return <VendorProductsClient products={products} storeName={vendor.storeName} />;
}
