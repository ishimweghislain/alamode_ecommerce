"use client";

import { useState } from "react";
import { X, UploadCloud, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function CategoryModal({ isOpen, onClose, initialData }: CategoryModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(initialData?.image || "");
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
    });
    const [subcategories, setSubcategories] = useState<{ id?: string, name: string, slug: string }[]>(
        initialData?.subcategories || []
    );

    const addSubcategory = () => {
        setSubcategories([...subcategories, { name: "", slug: "" }]);
    };

    const removeSubcategory = (index: number) => {
        setSubcategories(subcategories.filter((_, i) => i !== index));
    };

    const updateSubcategory = (index: number, name: string) => {
        const newSubs = [...subcategories];
        newSubs[index] = {
            ...newSubs[index],
            name,
            slug: name.toLowerCase().replace(/ /g, '-')
        };
        setSubcategories(newSubs);
    };

    if (!isOpen) return null;

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const toastId = toast.loading("Uploading image...");

        try {
            const data = new FormData();
            data.append("file", file);
            const res = await axios.post("/api/upload", data);
            setImage(res.data.secure_url);
            toast.success("Image uploaded", { id: toastId });
        } catch (error) {
            toast.error("Upload failed", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await axios.patch(`/api/categories/${initialData.id}`, { ...formData, image, subcategories });
                toast.success("Category updated");
            } else {
                await axios.post("/api/categories", { ...formData, image, subcategories });
                toast.success("Category created");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Sophisticated glass backdrop */}
            <div
                className="absolute inset-0 bg-background-dark/40 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            <div className="relative bg-background-dark/90 border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
                {/* Decorative gradients */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-8 md:p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-3xl font-outfit font-bold text-white mb-2">
                                {initialData ? "Refine Category" : "New Collection"}
                            </h2>
                            <p className="text-gray-400 text-sm">Define the look and hierarchy of your shop category.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Identity</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    placeholder="Category Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-accent outline-none transition-all placeholder:text-gray-600 focus:bg-white/[0.07]"
                                />
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-[10px] text-gray-500 font-mono">SLUG:</span>
                                    <span className="text-[10px] text-brand-gold font-mono">{formData.slug || "auto-generated"}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Visual Preview</label>
                                {image ? (
                                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                                        <Image fill src={image} alt="Category" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setImage("")}
                                                className="p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all active:scale-95"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-[2rem] border-2 border-dashed border-white/10 hover:border-brand-accent hover:bg-white/5 cursor-pointer transition-all group overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/5 to-transparent" />
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                                <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-brand-accent transition-colors" />
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">Click to upload banner</span>
                                            <span className="text-[10px] text-gray-600 mt-1 uppercase tracking-tighter">High resolution recommended</span>
                                        </div>
                                        <input type="file" onChange={onUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6 flex flex-col h-full">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subcategories</label>
                                <button
                                    type="button"
                                    onClick={addSubcategory}
                                    className="p-1.5 bg-brand-accent/10 text-brand-accent rounded-lg hover:bg-brand-accent hover:text-white transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-3 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                {subcategories.map((sub, index) => (
                                    <div key={index} className="flex gap-3 group/sub animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                        <div className="flex-1 relative">
                                            <input
                                                required
                                                value={sub.name}
                                                onChange={(e) => updateSubcategory(index, e.target.value)}
                                                placeholder="Sub-label"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-accent outline-none transition-all"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSubcategory(index)}
                                            className="p-3 bg-white/5 text-gray-500 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover/sub:opacity-100"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {subcategories.length === 0 && (
                                    <div className="h-32 flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-white/[0.02]">
                                        <p className="text-xs text-gray-600 font-medium">No sub-levels defined</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-4 rounded-2xl bg-brand-accent text-white font-bold hover:bg-brand-gold hover:shadow-[0_0_30px_rgba(255,184,76,0.3)] transition-all disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {loading ? "Syncing..." : initialData ? "Confirm Edit" : "Create Now"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
