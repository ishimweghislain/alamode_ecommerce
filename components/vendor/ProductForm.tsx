"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ImagePlus, Trash2, X, ChevronRight, UploadCloud, Info, Ruler, Plus } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { clsx } from "clsx";

interface ProductFormProps {
    initialData?: any;
    categories: any[];
}

const CLOTHING_PRESETS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const SHOE_PRESETS = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"];

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
        subsubcategoryId: initialData?.subsubcategoryId || "",
        sizeType: initialData?.sizeType || "",
    });

    const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
    const [customSizeInput, setCustomSizeInput] = useState("");
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [subsubcategories, setSubsubcategories] = useState<any[]>([]);

    useEffect(() => {
        if (formData.categoryId) {
            const selectedCat = categories.find(c => c.id === formData.categoryId);
            setSubcategories(selectedCat?.subcategories || []);
        } else {
            setSubcategories([]);
            setSubsubcategories([]);
        }
    }, [formData.categoryId, categories]);

    useEffect(() => {
        if (formData.subcategoryId) {
            const selectedSub = subcategories.find(s => s.id === formData.subcategoryId);
            setSubsubcategories(selectedSub?.subsubcategories || []);
        } else {
            setSubsubcategories([]);
        }
    }, [formData.subcategoryId, subcategories]);

    const togglePresetSize = (size: string) => {
        setSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const addCustomSize = () => {
        const s = customSizeInput.trim().toUpperCase();
        if (!s) return;
        if (sizes.includes(s)) {
            toast.error("Size already added");
            return;
        }
        setSizes(prev => [...prev, s]);
        setCustomSizeInput("");
    };

    const removeSize = (size: string) => {
        setSizes(prev => prev.filter(s => s !== size));
    };

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
        } catch {
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
            const payload = { ...formData, images, sizes };
            if (initialData) {
                await axios.patch(`/api/products/${initialData.id}`, payload);
                toast.success("Product updated");
            } else {
                await axios.post("/api/products", payload);
                toast.success("Product created");
            }
            router.push("/vendor/products");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const currentPresets = formData.sizeType === "shoe" ? SHOE_PRESETS : CLOTHING_PRESETS;

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side - Details */}
                <div className="space-y-6">
                    {/* General Info */}
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

                    {/* Pricing */}
                    <div className="card-luxury p-6 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ChevronRight className="h-5 w-5 text-brand-accent" />
                            Pricing &amp; Inventory
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
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Category</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: "", subsubcategoryId: "" })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none"
                                >
                                    <option value="" className="bg-background-dark">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-background-dark">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Subcategory</label>
                                    <select
                                        value={formData.subcategoryId}
                                        onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value, subsubcategoryId: "" })}
                                        disabled={!formData.categoryId || subcategories.length === 0}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none disabled:opacity-50"
                                    >
                                        <option value="" className="bg-background-dark">Select Subcategory</option>
                                        {subcategories.map((sub) => (
                                            <option key={sub.id} value={sub.id} className="bg-background-dark">{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Micro Category</label>
                                    <select
                                        value={formData.subsubcategoryId}
                                        onChange={(e) => setFormData({ ...formData, subsubcategoryId: e.target.value })}
                                        disabled={!formData.subcategoryId || subsubcategories.length === 0}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent transition-colors outline-none disabled:opacity-50"
                                    >
                                        <option value="" className="bg-background-dark">Optional Sub-subcategory</option>
                                        {subsubcategories.map((ss) => (
                                            <option key={ss.id} value={ss.id} className="bg-background-dark">{ss.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="card-luxury p-6 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Ruler className="h-5 w-5 text-brand-accent" />
                            Sizes Available
                        </h2>
                        <p className="text-xs text-gray-400">
                            Select the size type, then toggle which sizes you carry. You can also add custom sizes.
                        </p>

                        {/* Size Type Toggle */}
                        <div className="flex gap-3">
                            {[
                                { value: "", label: "No Sizes" },
                                { value: "clothing", label: "Clothing" },
                                { value: "shoe", label: "Shoes" },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, sizeType: opt.value });
                                        setSizes([]);
                                    }}
                                    className={clsx(
                                        "flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all",
                                        formData.sizeType === opt.value
                                            ? "bg-brand-accent border-brand-accent text-white"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {formData.sizeType && (
                            <>
                                {/* Preset Size Chips */}
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
                                        {formData.sizeType === "shoe" ? "Shoe Sizes" : "Standard Sizes"}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {currentPresets.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => togglePresetSize(size)}
                                                className={clsx(
                                                    "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                                                    sizes.includes(size)
                                                        ? "bg-brand-accent/20 border-brand-accent text-brand-accent"
                                                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Size Input */}
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
                                        Add Custom Size
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            value={customSizeInput}
                                            onChange={(e) => setCustomSizeInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSize(); } }}
                                            placeholder="e.g. 48, 2XL, PETITE..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-brand-accent outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={addCustomSize}
                                            className="px-3 py-2 bg-brand-accent rounded-lg text-white hover:opacity-90 transition-opacity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Selected Sizes Summary */}
                                {sizes.length > 0 && (
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
                                            Selected ({sizes.length})
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {sizes.map((size) => (
                                                <span
                                                    key={size}
                                                    className="flex items-center gap-1.5 px-3 py-1 bg-brand-accent/10 border border-brand-accent/30 rounded-full text-xs text-brand-accent font-bold"
                                                >
                                                    {size}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSize(size)}
                                                        className="hover:text-white transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
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
                                    <Image fill src={url} alt="Product" className="object-cover" />
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
