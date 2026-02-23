import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (user?.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background-dark min-h-screen">
            <DashboardSidebar role="ADMIN" />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
