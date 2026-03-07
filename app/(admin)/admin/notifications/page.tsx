import NotificationList from "@/components/ui/NotificationList";
import { Bell, RefreshCw } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminNotificationsPage() {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const { data } = await axios.post("/api/admin/notifications/sync");
            toast.success(`Synchronized ${data.syncCount} legacy signals.`);
            window.location.reload();
        } catch (error) {
            toast.error("Synchronization failed.");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-[2rem] bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center shadow-2xl shadow-brand-accent/10">
                        <Bell className="h-7 w-7 text-brand-accent" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Command Center <span className="text-brand-gold italic">Alerts.</span></h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time system synchronization and logistics signals.</p>
                    </div>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? "Syncing..." : "Sync Legacy"}
                </button>
            </div>

            <NotificationList />
        </div>
    );
}
