"use client";

import { useState } from "react";
import { CheckCircle2, Lock, XCircle, LifeBuoy } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface TicketAdminControlsProps {
    ticketId: string;
    currentStatus: string;
}

export default function TicketAdminControls({ ticketId, currentStatus }: TicketAdminControlsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onUpdateStatus = async (status: string) => {
        setLoading(true);
        try {
            await axios.patch(`/api/tickets/${ticketId}`, { status });
            toast.success(`Ticket ${status.toLowerCase()}`);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-3">
            {currentStatus === 'OPEN' ? (
                <button
                    disabled={loading}
                    onClick={() => onUpdateStatus("RESOLVED")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-background-dark font-bold text-xs rounded-xl hover:bg-green-400 transition-all uppercase tracking-widest shadow-[0_5px_15px_rgba(34,197,94,0.3)]"
                >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Resolved
                </button>
            ) : (
                <button
                    disabled={loading}
                    onClick={() => onUpdateStatus("OPEN")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                    <LifeBuoy className="h-4 w-4" />
                    Re-Open Ticket
                </button>
            )}

            <button
                disabled={loading}
                onClick={() => onUpdateStatus("CLOSED")}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white font-bold text-xs rounded-xl hover:bg-red-600 transition-all uppercase tracking-widest"
            >
                <Lock className="h-4 w-4" />
                Close Thread
            </button>
        </div>
    );
}
