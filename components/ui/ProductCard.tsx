"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartProvider";
import { clsx } from "clsx";

import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    category: string;
    rating?: number;
    salePrice?: number;
    discountPct?: number;
    sizes?: string[];
    sizeType?: string;
}

const ProductCard = ({ id, name, price, image, images, category, rating = 4.5, salePrice, discountPct, sizes = [], sizeType }: ProductCardProps) => {
    const { data: session } = useSession();
    const { addItem } = useCart();
    const [isWishlisting, setIsWishlisting] = useState(false);
    const [showSizePicker, setShowSizePicker] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const productImages = images && images.length > 0 ? images : image ? [image] : ["/placeholder.png"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const displayPrice = salePrice ?? price;
    const isOnSale = !!salePrice && salePrice < price;

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            toast.error("Please login to save your masterpieces.", {
                icon: "🔒",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }

        try {
            setIsWishlisting(true);
            const response = await axios.post("/api/wishlist", { productId: id });
            if (response.data.status === "added") {
                toast.success("Saved to your collection", { icon: "❤️" });
            } else {
                toast.success("Removed from collection", { icon: "💔" });
            }
        } catch (error) {
            toast.error("Fulfillment interrupted. Please try again.");
        } finally {
            setIsWishlisting(false);
        }
    };

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

                {/* Discount badge */}
                {isOnSale && discountPct && (
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        <span className="bg-brand-gold text-background-dark text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                            -{discountPct}% OFF
                        </span>
                        <span className="bg-brand-dark/80 backdrop-blur-md text-brand-accent text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/5">
                            {category}
                        </span>
                    </div>
                )}
                {!isOnSale && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-brand-dark/80 backdrop-blur-md text-brand-accent text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/5">
                            {category}
                        </span>
                    </div>
                )}

                <button
                    onClick={toggleWishlist}
                    disabled={isWishlisting}
                    className={clsx(
                        "absolute top-3 right-3 p-2 bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-red-400 hover:scale-110 transition-all z-10",
                        isWishlisting && "opacity-50"
                    )}
                >
                    <Heart className={clsx("h-4 w-4", isWishlisting && "animate-pulse")} />
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
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                            {isOnSale ? 'Sale Price' : 'Current Price'}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-brand-gold font-bold text-xl font-outfit">
                                {formatPrice(displayPrice)}
                            </span>
                            {isOnSale && (
                                <span className="text-gray-500 line-through text-sm">
                                    {formatPrice(price)}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (sizes.length > 0) {
                                setShowSizePicker(true);
                            } else {
                                addItem({ id, name, price: displayPrice, image: productImages[0], quantity: 1 });
                            }
                        }}
                        className="p-3 bg-brand-accent hover:bg-brand-gold text-white rounded-2xl shadow-lg shadow-brand-accent/20 transition-all hover:scale-105 active:scale-95 group/btn"
                    >
                        <ShoppingCart className="h-5 w-5 group-hover/btn:animate-bounce" />
                    </button>
                </div>
            </div>

            {/* Size Picker Modal */}
            {showSizePicker && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                    onClick={(e) => { e.stopPropagation(); setShowSizePicker(false); }}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                    <div
                        className="relative bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-white font-bold text-xl mb-1">Select Your Size</h3>
                        <p className="text-gray-400 text-xs mb-5">{sizeType === 'shoe' ? 'Shoe size' : 'Clothing size'} for <span className="text-brand-accent">{name}</span></p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {sizes.map((sz) => (
                                <button
                                    key={sz}
                                    onClick={() => setSelectedSize(sz)}
                                    className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${selectedSize === sz
                                            ? 'border-brand-accent bg-brand-accent/20 text-brand-accent'
                                            : 'border-white/20 text-gray-300 hover:border-white/40'
                                        }`}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSizePicker(false)}
                                className="flex-1 py-3 rounded-xl bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!selectedSize}
                                onClick={() => {
                                    addItem({
                                        id: `${id}-${selectedSize}`,
                                        name: `${name} (${selectedSize})`,
                                        price: displayPrice,
                                        image: productImages[0],
                                        quantity: 1
                                    });
                                    setShowSizePicker(false);
                                    setSelectedSize("");
                                }}
                                className="flex-[2] py-3 rounded-xl bg-brand-accent text-white text-sm font-bold hover:bg-brand-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
