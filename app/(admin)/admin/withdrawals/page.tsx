import { prisma } from "@/lib/prisma";
import WithdrawalsAdminClient from "@/components/admin/WithdrawalsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminWithdrawalsPage() {
    const requests = await prisma.withdrawalRequest.findMany({
        include: {
            vendor: {
                select: {
                    storeName: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return <WithdrawalsAdminClient requests={requests} />;
}
