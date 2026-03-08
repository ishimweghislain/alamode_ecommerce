"use client";

import { useState } from "react";
import { Truck, Search, AlertTriangle, CheckCircle, Info, Ghost } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { RWANDA_DISTRICTS } from "@/lib/constants";

interface DeliveryClientProps {
    initialVendors: any[];
}

export default function DeliveryClient({ initialVendors }: DeliveryClientProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredVendors = initialVendors.filter(v =>
        v.storeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatus = (vendor: any) => {
        const setFees = vendor.deliveryFees.filter((f: any) => f.fee > 0);
        if (setFees.length === 0) return { label: "Not Configured", color: "text-red-500", icon: AlertTriangle };
        if (setFees.length < RWANDA_DISTRICTS.length) return { label: "Partially Set", color: "text-brand-gold", icon: Info };
        return { label: "Fully Configured", color: "text-green-500", icon: CheckCircle };
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="text-left">
                    <h1 className="text-4xl font-outfit font-bold text-white uppercase tracking-tighter">Vendor Logistics</h1>
                    <p className="text-gray-400">Monitoring delivery fee configurations across all boutique partners.</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Boutique Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-luxury w-full py-4 pl-12"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredVendors.length === 0 ? (
                    <div className="card-luxury p-20 flex flex-col items-center opacity-50">
                        <Ghost className="h-16 w-16 mb-4" />
                        <p className="font-bold uppercase tracking-widest">No vendors found</p>
                    </div>
                ) : (
                    filteredVendors.map((vendor) => {
                        const status = getStatus(vendor);
                        return (
                            <div key={vendor.id} className="card-luxury p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />

                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    <div className="flex items-center gap-6 lg:w-1/3">
                                        <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-brand-gold group-hover:scale-110 transition-transform shadow-xl">
                                            {vendor.storeName.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">
                                                {vendor.storeName}
                                            </h2>
                                            <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest mt-1 ${status.color}`}>
                                                <status.icon className="h-3 w-3" />
                                                {status.label}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 text-left">Configuration Map</div>
                                        <div className="flex flex-wrap gap-2">
                                            {RWANDA_DISTRICTS.map(district => {
                                                const feeObj = vendor.deliveryFees.find((f: any) => f.district === district);
                                                const hasFee = feeObj && feeObj.fee > 0;
                                                return (
                                                    <div
                                                        key={district}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${hasFee
                                                            ? 'bg-brand-accent/10 border-brand-accent/30 text-white'
                                                            : 'bg-red-500/5 border-red-500/20 text-red-500/50 grayscale'
                                                            }`}
                                                    >
                                                        {district}: {hasFee ? formatPrice(feeObj.fee) : "0"}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="lg:w-48 text-right flex flex-col items-end gap-1 shrink-0">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Fees</span>
                                        <span className="text-3xl font-outfit font-bold text-white">
                                            {vendor.deliveryFees.filter((f: any) => f.fee > 0).length}
                                            <span className="text-sm text-gray-600 ml-1">/ {RWANDA_DISTRICTS.length}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
