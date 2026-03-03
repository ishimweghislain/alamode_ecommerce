import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import VendorApprovalCatcher from "@/components/vendor/VendorApprovalCatcher";

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (user?.role !== "VENDOR") {
        redirect("/");
    }

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    const isApproved = vendor?.isApproved;

    return (
        <div className="flex bg-background-dark min-h-screen">
            <DashboardSidebar role="VENDOR" />
            <main className="flex-1 p-4 md:p-8">
                {isApproved ? children : <VendorApprovalCatcher />}
            </main>
        </div>
    );
}
