"use client";

import { useState } from "react";
import { Search, Check, X, ShieldAlert, Store, Ghost } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface VendorsAdminClientProps {
    vendors: any[];
}

export default function VendorsAdminClient({ vendors }: VendorsAdminClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");
    const [loading, setLoading] = useState<string | null>(null);

    const filtered = vendors.filter((v) => {
        const matchesSearch =
            v.storeName.toLowerCase().includes(search.toLowerCase()) ||
            v.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            v.user?.email?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filter === "ALL" ||
            (filter === "APPROVED" && v.isApproved) ||
            (filter === "PENDING" && !v.isApproved);
        return matchesSearch && matchesFilter;
    });

    const onToggle = async (id: string, approve: boolean) => {
        setLoading(id);
        try {
            await axios.patch(`/api/vendors/${id}/approve`, { isApproved: approve });
            toast.success(approve ? "Vendor approved" : "Vendor deactivated");
            router.refresh();
        } catch {
            // Fallback: try generic update route
            try {
                await axios.patch(`/api/vendors/profile`, { id, isApproved: approve });
                toast.success(approve ? "Vendor approved" : "Vendor deactivated");
                router.refresh();
            } catch {
                toast.error("Could not update vendor status. Please refresh and try again.");
            }
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Vendor Management</h1>
                    <p className="text-gray-400">Review and manage marketplace sellers.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                        {(["ALL", "APPROVED", "PENDING"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === f
                                        ? "bg-brand-accent text-white shadow-lg"
                                        : "text-gray-500 hover:text-white"
                                )}
                            >
                                {f}
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
                            placeholder="Search store or owner..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-all w-64 text-white placeholder:text-gray-600"
                        />
                    </div>
                </div>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">Store Name</th>
                            <th className="p-4 font-bold text-gray-300">Owner</th>
                            <th className="p-4 font-bold text-gray-300">Status</th>
                            <th className="p-4 font-bold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map((vendor: any) => (
                            <tr key={vendor.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-brand-accent/10">
                                            <Store className="h-4 w-4 text-brand-accent" />
                                        </div>
                                        <span className="text-white font-medium">{vendor.storeName}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-400">
                                    {vendor.user?.name} <br />
                                    <span className="text-xs opacity-50">{vendor.user?.email}</span>
                                </td>
                                <td className="p-4">
                                    {vendor.isApproved ? (
                                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-wider">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {vendor.isApproved ? (
                                            <button
                                                disabled={loading === vendor.id}
                                                onClick={() => onToggle(vendor.id, false)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-bold uppercase rounded-luxury transition-all disabled:opacity-50"
                                            >
                                                <ShieldAlert className="h-3.5 w-3.5" />
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button
                                                disabled={loading === vendor.id}
                                                onClick={() => onToggle(vendor.id, true)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white text-[10px] font-bold uppercase rounded-luxury transition-all disabled:opacity-50"
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                Activate
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-12 flex flex-col items-center gap-3 text-gray-500">
                        <Ghost className="h-10 w-10 opacity-30" />
                        <p className="text-sm">{search ? `No vendors matching "${search}"` : "No vendors registered yet."}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
