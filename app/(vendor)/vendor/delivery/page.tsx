"use client";

import { useState, useEffect } from "react";
import { RWANDA_DISTRICTS } from "@/lib/constants";
import { Truck, Save, Loader2, Info } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function VendorDeliveryPage() {
    const [fees, setFees] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const { data } = await axios.get("/api/vendor/delivery");
                const feeMap = data.reduce((acc: any, item: any) => {
                    acc[item.district] = item.fee;
                    return acc;
                }, {});
                setFees(feeMap);
            } catch (error) {
                toast.error("Failed to load delivery fees");
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, []);

    const handleSave = async (district: string) => {
        setSaving(district);
        try {
            const fee = fees[district] || 0;
            await axios.post("/api/vendor/delivery", { district, fee });
            toast.success(`Updated fee for ${district}`);
        } catch (error) {
            toast.error("Failed to save fee");
        } finally {
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 text-brand-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent shadow-lg shadow-brand-accent/10">
                    <Truck className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white uppercase tracking-tighter">Delivery Configuration</h1>
                    <p className="text-gray-400 text-sm">Set your own delivery rates for each of the 30 districts in Rwanda.</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl mb-12">
                <div className="p-6 border-b border-white/10 flex items-center gap-2 bg-white/[0.02]">
                    <Info className="h-4 w-4 text-brand-gold" />
                    <p className="text-xs text-brand-gold font-bold uppercase tracking-widest">Pricing Strategy</p>
                </div>
                <div className="p-8">
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        Configure how much customers will be charged for shipping based on their district.
                        If a district is not configured (or set to 0), the customer will not be charged a delivery fee for items from your store.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {RWANDA_DISTRICTS.map((district) => (
                            <div
                                key={district}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-all group"
                            >
                                <span className="text-sm font-semibold text-white uppercase tracking-wider">{district}</span>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={fees[district] || ""}
                                            onChange={(e) => setFees({ ...fees, [district]: parseFloat(e.target.value) || 0 })}
                                            placeholder="0.00"
                                            className="w-28 bg-background-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-brand-gold font-bold focus:border-brand-accent outline-none transition-all"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 uppercase font-bold">RWF</span>
                                    </div>
                                    <button
                                        onClick={() => handleSave(district)}
                                        disabled={saving === district}
                                        className="h-9 w-9 flex items-center justify-center bg-brand-accent rounded-xl text-black hover:bg-brand-gold transition-all disabled:opacity-50 shadow-lg shadow-brand-accent/20"
                                    >
                                        {saving === district ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
