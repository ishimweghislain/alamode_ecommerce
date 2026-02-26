"use client";

import { useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign,
    Store,
    AlertCircle,
    Check
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Withdrawal Requests</h1>
                <p className="text-gray-400">Review and approve vendor payout requests.</p>
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
                        {requests.map((req: any) => (
                            <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-sm text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                                            <Store className="h-5 w-5 text-brand-accent" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{req.vendor.storeName}</p>
                                            <p className="text-[10px] text-gray-500 font-mono">ID: {req.vendorId.slice(-8)}</p>
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
                                        req.status === 'COMPLETED' && "bg-green-500/10 text-green-500",
                                        req.status === 'APPROVED' && "bg-blue-500/10 text-blue-500",
                                        req.status === 'PENDING' && "bg-brand-gold/10 text-brand-gold",
                                        req.status === 'REJECTED' && "bg-red-500/10 text-red-500"
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
                {requests.length === 0 && (
                    <div className="p-12 text-center text-gray-500 italic text-sm">
                        No pending withdrawal requests.
                    </div>
                )}
            </div>
        </div>
    );
}
