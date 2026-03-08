"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminNotificationsSync() {
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
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
        >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Updating..." : "Update Notifications"}
        </button>
    );
}
