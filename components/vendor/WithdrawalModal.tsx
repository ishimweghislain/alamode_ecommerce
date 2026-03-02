"use client";

import { useState } from "react";
import { X, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Portal from "../ui/Portal";

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
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-background-dark/80 backdrop-blur-xl animate-in fade-in duration-500"
                    onClick={onClose}
                />
                <div className="relative bg-background-dark/95 border border-white/10 p-10 rounded-[2.5rem] max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <h2 className="text-3xl font-outfit font-bold text-white mb-2">Request Payout</h2>
                    <p className="text-sm text-gray-400 mb-8 leading-relaxed">Funds will be sent to your registered payment method upon admin approval.</p>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <DollarSign className="h-12 w-12 text-brand-gold" />
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2 px-1">Maximum Distributable</p>
                        <p className="text-2xl font-bold text-brand-gold">{formatPrice(availableBalance)}</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest px-1">Withdrawal Amount (RWF)</label>
                            <div className="relative group">
                                <input
                                    autoFocus
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-3xl font-bold text-white focus:outline-none focus:border-brand-accent transition-all placeholder:text-gray-800"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-gold text-sm font-bold opacity-50 font-mono tracking-tighter">RWF</div>
                            </div>
                        </div>

                        <div className="p-4 bg-brand-accent/5 rounded-2xl flex gap-4 items-start border border-brand-accent/10">
                            <div className="h-8 w-8 rounded-lg bg-brand-accent/20 flex items-center justify-center shrink-0">
                                <ShieldCheck className="h-5 w-5 text-brand-accent" />
                            </div>
                            <div>
                                <p className="text-xs text-brand-accent font-bold uppercase tracking-tight">Escrow Period NOTICE</p>
                                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed opacity-80">Requests are processed within 24-48 business hours. Ensure your mobile money details are up to date.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 px-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors border border-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !amount}
                                className="flex-[2] py-4 px-4 bg-brand-accent text-white rounded-xl font-bold hover:bg-brand-gold hover:shadow-[0_0_30px_rgba(255,184,76,0.3)] transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 group"
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
        </Portal>
    );
}
