"use client";

import { useState } from "react";
import { X, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface WithdrawalModalProps {
    availableBalance: number;
    onClose: () => void;
}

export default function WithdrawalModal({ availableBalance, onClose }: WithdrawalModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            return toast.error("Please enter a valid amount");
        }

        if (numAmount > availableBalance) {
            return toast.error("Insufficient balance");
        }

        if (numAmount < 1000) {
            return toast.error("Minimum withdrawal is 1,000 RWF");
        }

        setLoading(true);
        try {
            await axios.post("/api/withdrawals", { amount: numAmount });
            toast.success("Withdrawal request submitted for approval");
            router.refresh();
            onClose();
        } catch (error) {
            toast.error("Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-background-dark border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Request Payout</h2>
                <p className="text-sm text-gray-400 mb-8">Funds will be sent to your registered payment method upon admin approval.</p>

                <div className="card-luxury p-4 bg-white/5 border-white/10 mb-8">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Max Available</p>
                    <p className="text-xl font-bold text-brand-gold">{formatPrice(availableBalance)}</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Withdrawal Amount (RWF)</label>
                        <div className="relative">
                            <input
                                autoFocus
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-2xl font-bold text-white focus:outline-none focus:border-brand-accent transition-all"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold">RWF</div>
                        </div>
                    </div>

                    <div className="p-4 bg-brand-accent/5 rounded-2xl flex gap-3 items-start border border-brand-accent/10">
                        <ShieldCheck className="h-5 w-5 text-brand-accent mt-0.5" />
                        <div>
                            <p className="text-xs text-brand-accent font-bold uppercase">Escrow Notice</p>
                            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Requests are processed within 24-48 business hours. Ensure your mobile money details are up to date.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className="flex-[2] btn-gold py-4 px-4 text-background-dark flex items-center justify-center gap-2 group"
                        >
                            {loading ? "Processing..." : (
                                <>
                                    <span>Confirm Payout</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
