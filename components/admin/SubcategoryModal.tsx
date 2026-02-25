"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

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
        name: initialData?.name || "",
        slug: initialData?.slug || "",
    });

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-background-dark border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{initialData ? "Edit Subcategory" : "Add Subcategory"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Subcategory Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                            placeholder="e.g. T-Shirts"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Slug</label>
                        <input
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="e.g. t-shirts"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent outline-none transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 mt-4 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : initialData ? "Update Subcategory" : "Create Subcategory"}
                    </button>
                </form>
            </div>
        </div>
    );
}
