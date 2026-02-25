"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { clsx } from "clsx";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    category: string;
    rating?: number;
}

const ProductCard = ({ id, name, price, image, images, category, rating = 4.5 }: ProductCardProps) => {
    const productImages = images && images.length > 0 ? images : image ? [image] : ["/placeholder.png"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll when hovered
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovered && productImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
            }, 1200);
        }
        return () => clearInterval(interval);
    }, [isHovered, productImages.length]);

    return (
        <div
            className="group card-luxury p-0 overflow-hidden bg-white/5 flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
        >
            <div className="relative h-72 w-full overflow-hidden">
                <Link href={`/product/${id}`} className="block h-full w-full">
                    {productImages.map((src, idx) => (
                        <div
                            key={src + idx}
                            className={clsx(
                                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                                idx === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                            )}
                        >
                            <Image
                                src={src}
                                alt={name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </Link>

                {/* Progress Indicators */}
                {productImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {productImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={clsx(
                                    "h-1 rounded-full transition-all duration-300",
                                    idx === currentImageIndex ? "w-6 bg-brand-gold" : "w-1 bg-white/30"
                                )}
                            />
                        ))}
                    </div>
                )}

                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-brand-dark/80 backdrop-blur-md text-brand-accent text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/5">
                        {category}
                    </span>
                </div>

                <button className="absolute top-3 right-3 p-2 bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-red-400 hover:scale-110 transition-all z-10">
                    <Heart className="h-4 w-4" />
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="flex items-center gap-1 mb-2.5">
                    {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "text-brand-gold fill-brand-gold" : "text-gray-600"}`} />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1.5 font-medium">({rating})</span>
                </div>

                <Link href={`/product/${id}`}>
                    <h3 className="text-white font-semibold text-lg line-clamp-2 hover:text-brand-accent transition-colors mb-3 leading-snug">
                        {name}
                    </h3>
                </Link>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Current Price</span>
                        <span className="text-brand-gold font-bold text-xl font-outfit">
                            {formatPrice(price)}
                        </span>
                    </div>
                    <button className="p-3 bg-brand-accent hover:bg-brand-gold text-white rounded-2xl shadow-lg shadow-brand-accent/20 transition-all hover:scale-105 active:scale-95 group/btn">
                        <ShoppingCart className="h-5 w-5 group-hover/btn:animate-bounce" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
