"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { ShoppingCart, Ruler } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
    product: {
        id: string;
        name: string;
        price: number;
        salePrice?: number;
        image: string;
        sizes: string[];
        sizeType?: string;
    };
    isAdmin?: boolean;
}

export default function ProductActions({ product, isAdmin }: ProductActionsProps) {
    const { addItem } = useCart();
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState("");
    const displayPrice = product.salePrice ?? product.price;

    const handleAddToCart = () => {
        if (product.sizes.length > 0 && !selectedSize) {
            toast.error("Please select a size first", { icon: "📏" });
            return;
        }

        addItem({
            id: selectedSize ? `${product.id}-${selectedSize}` : product.id,
            productId: product.id,
            name: selectedSize ? `${product.name} (${selectedSize})` : product.name,
            price: displayPrice,
            image: product.image,
            quantity: 1,
            size: selectedSize || undefined
        });
    };

    const handleBuyNow = () => {
        if (product.sizes.length > 0 && !selectedSize) {
            toast.error("Please select a size first", { icon: "📏" });
            return;
        }

        addItem({
            id: selectedSize ? `${product.id}-${selectedSize}` : product.id,
            productId: product.id,
            name: selectedSize ? `${product.name} (${selectedSize})` : product.name,
            price: displayPrice,
            image: product.image,
            quantity: 1,
            size: selectedSize || undefined
        });
        router.push("/cart");
    };

    if (isAdmin) return null;

    return (
        <div className="space-y-8">
            {/* Size Selector */}
            {product.sizes.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                        <Ruler className="h-4 w-4 text-brand-accent" />
                        <p className="font-bold text-white uppercase tracking-widest text-[10px]">
                            {product.sizeType === "shoe" ? "Shoe Sizes" : "Available Sizes"}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 border rounded-xl text-sm transition-all ${selectedSize === size
                                        ? "border-brand-accent bg-brand-accent/20 text-brand-accent font-bold"
                                        : "border-white/20 text-gray-300 hover:border-brand-accent/50 hover:text-white"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleAddToCart}
                    className="flex-[1.5] btn-primary h-14 text-lg flex items-center justify-center gap-3 group"
                >
                    <ShoppingCart className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                    Add to Bag
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 btn-gold h-14 text-lg font-bold flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,184,0,0.3)] transition-all"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
}
