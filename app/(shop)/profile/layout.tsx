import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex bg-background-dark min-h-screen">
            <DashboardSidebar role="CUSTOMER" />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
