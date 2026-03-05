import { prisma } from "@/lib/prisma";
import UsersClient from "@/components/admin/UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    let users: any[] = [];
    try {
        users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        users = [];
    }

    return <UsersClient users={users} />;
}
