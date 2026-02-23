"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Package, Upload, Plus, X, Loader2 } from "lucide-react";
import Image from "next/image";

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        images: [] as string[],
    });

    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/api/categories");
                setCategories(res.data);
            } catch (err) {
                toast.error("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    const addImage = () => {
        if (!imageUrl) return;
        setFormData({ ...formData, images: [...formData.images, imageUrl] });
        setImageUrl("");
    };

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            toast.error("Please add at least one image");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post("/api/products", {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            });
            toast.success("Product created successfully!");
            router.push("/vendor/products");
        } catch (error: any) {
            toast.error(error.response?.data || "Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-outfit font-bold text-white mb-2 font-bold">Add New Luxury Product</h1>
                <p className="text-gray-400">Showcase your masterpiece to the ALAMODE community.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="card-luxury p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 text-sm">
                            <label className="text-gray-300 font-medium">Product Name</label>
                            <input
                                required
                                className="input-luxury w-full"
                                placeholder="Ex: Diamond Encrusted Watch"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 text-sm">
                            <label className="text-gray-300 font-medium">Category</label>
                            <select
                                required
                                className="input-luxury w-full"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <label className="text-gray-300 font-medium">Detailed Description</label>
                        <textarea
                            required
                            rows={5}
                            className="input-luxury w-full py-4"
                            placeholder="Describe the craftsmanship, materials, and essence of this product..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 text-sm">
                            <label className="text-gray-300 font-medium">Price (RWF)</label>
                            <input
                                type="number"
                                required
                                className="input-luxury w-full"
                                placeholder="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 text-sm">
                            <label className="text-gray-300 font-medium">Available Inventory</label>
                            <input
                                type="number"
                                required
                                className="input-luxury w-full"
                                placeholder="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-luxury p-8 space-y-6">
                    <h3 className="text-lg font-bold text-white mb-4">Product Imagery</h3>
                    <div className="flex gap-4 mb-6">
                        <input
                            className="input-luxury flex-1"
                            placeholder="Paste Image URL (Unsplash or secure link)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={addImage}
                            className="h-11 px-4 bg-brand-dark rounded-luxury text-white hover:bg-brand-emerald transition-all flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((img, i) => (
                            <div key={i} className="relative aspect-square rounded-luxury overflow-hidden border border-white/10 group">
                                <Image src={img} alt="Preview" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        {formData.images.length === 0 && (
                            <div className="col-span-full border-2 border-dashed border-white/10 rounded-luxury h-32 flex flex-col items-center justify-center text-gray-500">
                                <Upload className="h-8 w-8 mb-2" />
                                <p className="text-sm italic">No images added yet</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary px-12 py-3 flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Publish Product
                    </button>
                </div>
            </form>
        </div>
    );
}
