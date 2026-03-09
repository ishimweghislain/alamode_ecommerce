"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminNotificationsSync() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncCount, setLastSyncCount] = useState<number | null>(null);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const { data } = await axios.post("/api/admin/notifications/sync");
            const count = data?.syncCount ?? 0;
            setLastSyncCount(count);

            if (count === 0) {
                toast.success("Everything is up to date — no new items to sync.");
            } else {
                toast.success(`${count} notification${count === 1 ? "" : "s"} refreshed successfully.`);
            }

            // Small delay before reload so the toast is visible
            setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
            // Friendly human message instead of technical jargon
            const status = error?.response?.status;
            if (status === 401) {
                toast.error("You need to be logged in as admin to do this.");
            } else if (status === 500) {
                toast.error("Something went wrong on the server. Please try again in a moment.");
            } else {
                toast.error("Could not connect to the server. Check your internet and try again.");
            }
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-brand-accent/30 transition-all disabled:opacity-50 group"
        >
            <RefreshCw className={`h-4 w-4 text-brand-accent group-hover:text-brand-gold transition-colors ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Refreshing Notifications..." : "Refresh Notifications"}
        </button>
    );
}
