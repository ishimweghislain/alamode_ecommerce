import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const fullUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    if (!fullUser) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Account Settings</h1>
                <p className="text-gray-400">Configure your personal preferences and security.</p>
            </div>

            <SettingsForm user={fullUser} />
        </div>
    );
}
