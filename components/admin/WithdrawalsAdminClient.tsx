"use client";

import { useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign,
    Store,
    AlertCircle,
    Check,
    Search,
    Ghost
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface WithdrawalsAdminClientProps {
    requests: any[];
}

export default function WithdrawalsAdminClient({ requests }: WithdrawalsAdminClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED">("ALL");

    const filtered = requests.filter((req) => {
        const matchesSearch = req.vendor?.storeName?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const onUpdateStatus = async (id: string, status: string) => {
        setLoading(id);
        try {
            await axios.patch(`/api/withdrawals/${id}`, { status });
            toast.success(`Request ${status.toLowerCase()}`);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(null);
        }
    };

    const statusColors: Record<string, string> = {
        COMPLETED: "bg-green-500/10 text-green-500",
        APPROVED: "bg-blue-500/10 text-blue-500",
        PENDING: "bg-brand-gold/10 text-brand-gold",
        REJECTED: "bg-red-500/10 text-red-500",
    };

    return (
        <div className="space-y-8">
            {/* Header + Search + Filter */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Withdrawal Requests</h1>
                    <p className="text-gray-400">Review and approve vendor payout requests.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Status filter tabs */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 overflow-x-auto">
                        {(["ALL", "PENDING", "APPROVED", "COMPLETED", "REJECTED"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                    statusFilter === s ? "bg-brand-accent text-white shadow-lg" : "text-gray-500 hover:text-white"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search store name..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-all w-56 text-white placeholder:text-gray-600"
                        />
                    </div>
                </div>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">Vendor</th>
                            <th className="p-4 font-bold text-gray-300">Request Date</th>
                            <th className="p-4 font-bold text-gray-300">Amount</th>
                            <th className="p-4 font-bold text-gray-300">Status</th>
                            <th className="p-4 font-bold text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map((req: any) => (
                            <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-sm text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                                            <Store className="h-5 w-5 text-brand-accent" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{req.vendor?.storeName}</p>
                                            <p className="text-[10px] text-gray-500 font-mono">ID: {req.vendorId?.slice(-8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-400 font-mono">
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-bold text-brand-gold">
                                    {formatPrice(req.amount)}
                                </td>
                                <td className="p-4">
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                        statusColors[req.status] || "bg-white/5 text-gray-400"
                                    )}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {req.status === 'PENDING' ? (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                disabled={loading === req.id}
                                                onClick={() => onUpdateStatus(req.id, "APPROVED")}
                                                className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
                                                title="Approve"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                disabled={loading === req.id}
                                                onClick={() => onUpdateStatus(req.id, "REJECTED")}
                                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                title="Reject"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : req.status === 'APPROVED' ? (
                                        <button
                                            disabled={loading === req.id}
                                            onClick={() => onUpdateStatus(req.id, "COMPLETED")}
                                            className="px-4 py-1.5 bg-green-500 text-background-dark font-bold text-[10px] rounded-full uppercase tracking-widest hover:bg-green-400 transition-all flex items-center gap-1 ml-auto"
                                        >
                                            <Check className="h-3 w-3" />
                                            Mark Paid
                                        </button>
                                    ) : (
                                        <span className="text-[10px] text-gray-500 font-bold uppercase italic">Processed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-12 flex flex-col items-center gap-3 text-gray-500">
                        <Ghost className="h-10 w-10 opacity-30" />
                        <p className="text-sm italic">
                            {search ? `No requests matching "${search}"` : "No pending withdrawal requests."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
