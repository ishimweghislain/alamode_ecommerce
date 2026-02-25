"use client";

import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
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
                await axios.patch(`/api/categories/${initialData.id}`, { ...formData, image });
                toast.success("Category updated");
            } else {
                await axios.post("/api/categories", { ...formData, image });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-background-dark border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{initialData ? "Edit Category" : "Add Category"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Category Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                            placeholder="e.g. Men's Fashion"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Slug</label>
                        <input
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="e.g. mens-fashion"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Banner Image</label>
                        {image ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                                <Image fill src={image} alt="Category" className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImage("")}
                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-brand-accent hover:bg-white/5 cursor-pointer transition-all">
                                <UploadCloud className="h-8 w-8 text-gray-500" />
                                <span className="text-xs text-gray-500 mt-2">Upload banner</span>
                                <input type="file" onChange={onUpload} className="hidden" />
                            </label>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 mt-4 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : initialData ? "Update Category" : "Create Category"}
                    </button>
                </form>
            </div>
        </div>
    );
}
