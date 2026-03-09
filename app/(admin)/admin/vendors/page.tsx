import { prisma } from "@/lib/prisma";
import VendorsAdminClient from "@/components/admin/VendorsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminVendorsPage() {
    let vendors: any[] = [];
    try {
        vendors = await prisma.vendor.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        vendors = [];
    }

    return <VendorsAdminClient vendors={vendors} />;
}
