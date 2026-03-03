"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { ExternalLink, Star, TrendingUp, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AdminProductsClientProps {
    products: any[];
}

export default function AdminProductsClient({ products }: AdminProductsClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const onToggleStatus = async (productId: string, field: "isFeatured" | "isTrending", currentValue: boolean) => {
        setLoading(productId + field);
        try {
            await axios.patch(`/api/products/${productId}`, {
                [field]: !currentValue
            });
            toast.success("Product updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update product");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="card-luxury overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-4 font-bold text-gray-300">Product</th>
                        <th className="p-4 font-bold text-gray-300">Vendor</th>
                        <th className="p-4 font-bold text-gray-300">Category</th>
                        <th className="p-4 font-bold text-gray-300">Price</th>
                        <th className="p-4 font-bold text-gray-300">Curation</th>
                        <th className="p-4 font-bold text-gray-300 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 relative rounded overflow-hidden flex-shrink-0 border border-white/10">
                                        <Image
                                            src={product.images[0] || "/placeholder.png"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm line-clamp-1">{product.name}</p>
                                        <p className="text-[10px] text-gray-500 font-mono">{product.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-gray-400">
                                {product.vendor.storeName}
                            </td>
                            <td className="p-4">
                                <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300">
                                    {product.category.name}
                                </span>
                            </td>
                            <td className="p-4 text-sm font-bold text-brand-gold">
                                {formatPrice(product.price)}
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onToggleStatus(product.id, "isFeatured", product.isFeatured)}
                                        disabled={loading === product.id + "isFeatured"}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${product.isFeatured
                                                ? "bg-brand-accent/20 text-brand-accent border-brand-accent/50"
                                                : "bg-white/5 text-gray-500 border-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        {loading === product.id + "isFeatured" ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Star className={`h-3 w-3 ${product.isFeatured ? "fill-current" : ""}`} />
                                        )}
                                        <span>Featured</span>
                                    </button>
                                    <button
                                        onClick={() => onToggleStatus(product.id, "isTrending", product.isTrending)}
                                        disabled={loading === product.id + "isTrending"}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${product.isTrending
                                                ? "bg-brand-gold/20 text-brand-gold border-brand-gold/50"
                                                : "bg-white/5 text-gray-500 border-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        {loading === product.id + "isTrending" ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <TrendingUp className="h-3 w-3" />
                                        )}
                                        <span>Trending</span>
                                    </button>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Link href={`/product/${product.id}`} target="_blank" className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors" title="View Product Page">
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {products.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No products found in the database.
                </div>
            )}
        </div>
    );
}
