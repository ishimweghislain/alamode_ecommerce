import { prisma } from "@/lib/prisma";
import DeliveryClient from "../../../../components/admin/DeliveryClient";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
    try {
        const vendors = await prisma.vendor.findMany({
            include: {
                deliveryFees: true
            },
            orderBy: {
                storeName: 'asc'
            }
        }).catch(() => []);

        return <DeliveryClient initialVendors={vendors} />;
    } catch (error) {
        console.error("[ADMIN_DELIVERY_PAGE_ERROR]", error);
        return <DeliveryClient initialVendors={[]} />;
    }
}
