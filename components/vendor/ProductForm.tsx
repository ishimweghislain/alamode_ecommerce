"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ImagePlus, Trash2, X, ChevronRight, UploadCloud, Info } from "lucide-react";
import Image from "next/image";
import axios from "axios";

interface ProductFormProps {
    initialData?: any;
    categories: any[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        stock: initialData?.stock || "",
        categoryId: initialData?.categoryId || "",
        subcategoryId: initialData?.subcategoryId || "",
    });

    const [subcategories, setSubcategories] = useState<any[]>([]);

    useEffect(() => {
        if (formData.categoryId) {
            const selectedCat = categories.find(c => c.id === formData.categoryId);
            setSubcategories(selectedCat?.subcategories || []);
        } else {
            setSubcategories([]);
        }
    }, [formData.categoryId, categories]);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setLoading(true);
        const toastId = toast.loading("Uploading images...");

        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const data = new FormData();
                data.append("file", files[i]);
                const res = await axios.post("/api/upload", data);
                uploadedUrls.push(res.data.secure_url);
            }
            setImages([...images, ...uploadedUrls]);
            toast.success("Images uploaded successfully", { id: toastId });
        } catch (error) {
            toast.error("Upload failed", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (url: string) => {
        setImages(images.filter((i) => i !== url));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0) return toast.error("Please upload at least one image");

        setLoading(true);
        try {
            if (initialData) {
                await axios.patch(`/api/products/${initialData.id}`, { ...formData, images });
                toast.success("Product updated");
            } else {
                await axios.post("/api/products", { ...formData, images });
                toast.success("Product created");
            }
            router.push("/vendor/products");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side - Details */}
                <div className="space-y-6">
                    <div className="card-luxury p-6 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Info className="h-5 w-5 text-brand-accent" />
                            General Information
                        </h2>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Product Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Premium Leather Jacket"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Description</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your product in detail..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div className="card-luxury p-6 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ChevronRight className="h-5 w-5 text-brand-accent" />
                            Pricing & Inventory
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Price (RWF)</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Stock Quantity</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    placeholder="0"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6 space-y-4">
                        <h2 className="text-xl font-bold text-white">Categories</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Category</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: "" })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none"
                                >
                                    <option value="" className="bg-background-dark">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-background-dark">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Subcategory</label>
                                <select
                                    value={formData.subcategoryId}
                                    onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                                    disabled={!formData.categoryId}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none disabled:opacity-50"
                                >
                                    <option value="" className="bg-background-dark">Select Subcategory</option>
                                    {subcategories.map((sub) => (
                                        <option key={sub.id} value={sub.id} className="bg-background-dark">{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Images */}
                <div className="space-y-6">
                    <div className="card-luxury p-6 space-y-4 min-h-[400px]">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ImagePlus className="h-5 w-5 text-brand-accent" />
                            Product Images
                        </h2>
                        <p className="text-xs text-gray-400">The first image will be the main display image. You can upload multiple views.</p>

                        <div className="grid grid-cols-2 gap-4">
                            {images.map((url) => (
                                <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                                    <Image
                                        fill
                                        src={url}
                                        alt="Product"
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(url)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-brand-accent hover:bg-white/5 transition-all cursor-pointer group">
                                <UploadCloud className="h-8 w-8 text-gray-500 group-hover:text-brand-accent mb-2" />
                                <span className="text-xs text-gray-500 group-hover:text-gray-300">Click to upload</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={onUpload}
                                    className="hidden"
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </div>
        </form>
    );
}
