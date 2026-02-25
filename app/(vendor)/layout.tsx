import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (user?.role !== "VENDOR") {
        redirect("/");
    }

    return (
        <div className="flex max-w-7xl mx-auto bg-background-dark min-h-screen">
            <DashboardSidebar role="VENDOR" />
            <main className="flex-1 p-4 md:p-8 mb-40 lg:mb-0">
                {children}
            </main>
        </div>
    );
}
