"use client";

import { useState } from "react";
import { Tag, Percent, Calendar, X, Loader2, Zap } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface PromotionFormProps {
    productId: string;
    productName: string;
    productPrice: number;
    activePromotion?: {
        id: string;
        discountPct: number;
        salePrice: number;
        expiresAt: string;
        label?: string | null;
    } | null;
}

export default function PromotionForm({
    productId,
    productName,
    productPrice,
    activePromotion,
}: PromotionFormProps) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        discountPct: "",
        durationDays: "7",
        label: "",
    });

    const previewPrice = form.discountPct
        ? Math.round(productPrice * (1 - Number(form.discountPct) / 100))
        : null;

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.discountPct || Number(form.discountPct) <= 0 || Number(form.discountPct) >= 100) {
            return toast.error("Discount must be between 1% and 99%");
        }
        setLoading(true);
        try {
            await axios.post("/api/promotions", {
                productId,
                discountPct: Number(form.discountPct),
                durationDays: Number(form.durationDays),
                label: form.label || null,
            });
            toast.success("🎉 Promotion launched!");
            router.refresh();
            setShowForm(false);
        } catch {
            toast.error("Failed to create promotion");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (promotionId: string) => {
        if (!confirm("Cancel this promotion? The price will revert.")) return;
        setLoading(true);
        try {
            await axios.delete(`/api/promotions/${promotionId}`);
            toast.success("Promotion cancelled");
            router.refresh();
        } catch {
            toast.error("Failed to cancel promotion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Active Promotion Badge */}
            {activePromotion && (
                <div className="flex items-center justify-between p-4 bg-brand-gold/5 border border-brand-gold/30 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-brand-gold" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Promotion</p>
                            <p className="text-white font-bold text-sm">
                                {activePromotion.discountPct}% OFF → {formatPrice(activePromotion.salePrice)}
                            </p>
                            <p className="text-[10px] text-gray-500">
                                Expires: {new Date(activePromotion.expiresAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleCancel(activePromotion.id)}
                        disabled={loading}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                        title="Cancel promotion"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Add Promotion Button / Form */}
            {!activePromotion && !showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center gap-2 justify-center py-3 px-4 border border-dashed border-brand-gold/30 rounded-2xl text-brand-gold text-sm font-bold hover:bg-brand-gold/5 transition-colors"
                >
                    <Tag className="h-4 w-4" />
                    Add Promotion
                </button>
            )}

            {!activePromotion && showForm && (
                <form onSubmit={handleCreate} className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                            <Tag className="h-4 w-4 text-brand-gold" />
                            New Promotion — {productName}
                        </h4>
                        <button type="button" onClick={() => setShowForm(false)}>
                            <X className="h-4 w-4 text-gray-500 hover:text-white" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Discount %
                            </label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    required
                                    value={form.discountPct}
                                    onChange={(e) => setForm({ ...form, discountPct: e.target.value })}
                                    placeholder="20"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-3 text-white text-sm focus:border-brand-gold outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Duration (days)
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
                                <input
                                    type="number"
                                    min="1"
                                    max="90"
                                    required
                                    value={form.durationDays}
                                    onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                                    placeholder="7"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-3 text-white text-sm focus:border-brand-gold outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Promo Label (optional)
                        </label>
                        <input
                            type="text"
                            value={form.label}
                            onChange={(e) => setForm({ ...form, label: e.target.value })}
                            placeholder="e.g. Summer Sale, Flash Deal..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:border-brand-gold outline-none"
                        />
                    </div>

                    {previewPrice && (
                        <div className="p-3 bg-brand-gold/5 border border-brand-gold/20 rounded-xl flex justify-between items-center">
                            <span className="text-gray-400 text-xs line-through">{formatPrice(productPrice)}</span>
                            <span className="text-brand-gold font-bold">{formatPrice(previewPrice)}</span>
                            <span className="text-xs text-brand-gold font-bold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                                -{form.discountPct}%
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-brand-gold text-background-dark font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                        Launch Promotion
                    </button>
                </form>
            )}
        </div>
    );
}
