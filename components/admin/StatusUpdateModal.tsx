"use client";

import { useState } from "react";
import { Truck, CheckCircle2, Clock, X, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface StatusUpdateModalProps {
    orderId: string;
    currentStatus: string;
    onClose: () => void;
}

export default function StatusUpdateModal({ orderId, currentStatus, onClose }: StatusUpdateModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(currentStatus);

    const statuses = [
        { value: 'PENDING', label: 'Pending Confirmation', icon: Clock, color: 'text-brand-gold' },
        { value: 'PAID', label: 'Payment Paid', icon: CheckCircle2, color: 'text-blue-500' },
        { value: 'SHIPPED', label: 'Shipped (In Transit)', icon: Truck, color: 'text-brand-accent' },
        { value: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500' },
        { value: 'CANCELLED', label: 'Cancelled', icon: X, color: 'text-red-500' },
    ];

    const onUpdate = async () => {
        setLoading(true);
        try {
            await axios.patch(`/api/orders/${orderId}`, { status });
            toast.success("Order status updated");
            router.refresh();
            onClose();
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-background-dark border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Update Order Flow</h2>
                <p className="text-sm text-gray-500 mb-8 font-mono">ID: #{orderId.slice(-8).toUpperCase()}</p>

                <div className="space-y-3 mb-8">
                    {statuses.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => setStatus(s.value)}
                            className={clsx(
                                "w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-300",
                                status === s.value
                                    ? "bg-brand-accent/10 border-brand-accent/50 text-white"
                                    : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <s.icon className={clsx("h-5 w-5", status === s.value ? "text-brand-accent" : "text-gray-500")} />
                                <span className="text-sm font-bold uppercase tracking-widest">{s.label}</span>
                            </div>
                            {status === s.value && <CheckCircle2 className="h-4 w-4 text-brand-accent" />}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 px-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors border border-white/10"
                    >
                        Discard
                    </button>
                    <button
                        onClick={onUpdate}
                        disabled={loading || status === currentStatus}
                        className="flex-[2] py-4 px-4 rounded-2xl bg-brand-accent text-background-dark font-bold hover:bg-brand-gold transition-all shadow-[0_0_20px_rgba(255,184,0,0.3)] disabled:opacity-50 disabled:shadow-none"
                    >
                        {loading ? "Updating..." : "Commit Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}
