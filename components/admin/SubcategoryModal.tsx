"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import Portal from "../ui/Portal";

interface SubcategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryId: string;
    initialData?: any;
}

export default function SubcategoryModal({ isOpen, onClose, categoryId, initialData }: SubcategoryModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
    });

    // Sync state with initialData when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: initialData?.name || "",
                slug: initialData?.slug || "",
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await axios.patch(`/api/subcategories/${initialData.id}`, { ...formData, categoryId });
                toast.success("Subcategory updated");
            } else {
                await axios.post("/api/subcategories", { ...formData, categoryId });
                toast.success("Subcategory created");
            }
            router.refresh();
            onClose();
        } catch (error) {
            toast.error("Something went wrong");
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

                <div className="relative bg-background-dark/95 border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-outfit font-bold text-white">
                                {initialData ? "Edit Sub-item" : "New Sub-category"}
                            </h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">Designation</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    placeholder="e.g. Silk Scarves"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-brand-accent outline-none transition-all placeholder:text-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">Identifier</label>
                                <div className="relative">
                                    <input
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3.5 text-xs text-brand-gold font-mono outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-3 bg-brand-accent text-white rounded-xl font-bold hover:bg-brand-gold transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-brand-accent/20"
                                >
                                    {loading ? "Saving..." : initialData ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
