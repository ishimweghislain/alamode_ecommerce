"use client";

import { useState } from "react";
import { X, Upload, Store, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface VendorProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        storeName: string;
        description: string | null;
        logo: string | null;
    };
}

export default function VendorProfileModal({ isOpen, onClose, initialData }: VendorProfileModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        storeName: initialData.storeName,
        description: initialData.description || "",
        logo: initialData.logo || "",
    });

    if (!isOpen) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await axios.post("/api/upload", data);
            setFormData({ ...formData, logo: res.data.url });
            toast.success("Logo uploaded");
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.patch("/api/vendors/profile", formData);
            toast.success("Profile updated");
            router.refresh();
            onClose();
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-background-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-outfit font-bold text-white">Edit Store Identity</h2>
                        <p className="text-gray-400 text-sm">Refine how customers see your luxury brand.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-8 space-y-6">
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
                                {formData.logo ? (
                                    <Image src={formData.logo} alt="Logo" fill className="object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Store className="h-10 w-10 text-brand-gold/40" />
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 text-brand-accent animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 p-2 bg-brand-accent rounded-xl border-4 border-background-dark cursor-pointer hover:scale-110 transition-all">
                                <Upload className="h-4 w-4 text-white" />
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-widest text-[10px]">Store Brand Name</label>
                            <input
                                required
                                value={formData.storeName}
                                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-accent transition-all"
                                placeholder="Luxury Boutique"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-widest text-[10px]">Store Description / Bio</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-accent transition-all resize-none"
                                placeholder="Describe your brand's heritage and craftsmanship..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="btn-primary px-8 h-12 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
