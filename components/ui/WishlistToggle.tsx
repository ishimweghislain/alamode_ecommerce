"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { clsx } from "clsx";

interface WishlistToggleProps {
    productId: string;
    initialIsWishlisted?: boolean;
}

export default function WishlistToggle({ productId, initialIsWishlisted = false }: WishlistToggleProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [loading, setLoading] = useState(false);

    const onToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        try {
            const res = await axios.post("/api/wishlist", { productId });
            if (res.data.status === "added") {
                setIsWishlisted(true);
                toast.success("Added to wishlist", {
                    icon: '❤️',
                    style: {
                        background: '#1A1A1A',
                        color: '#FFF',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }
                });
            } else {
                setIsWishlisted(false);
                toast.success("Removed from wishlist");
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("Please login to wishlist items");
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={onToggle}
            disabled={loading}
            className={clsx(
                "p-3 rounded-luxury transition-all duration-300 flex items-center justify-center",
                isWishlisted
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "bg-white/5 text-gray-400 hover:text-red-500 border border-transparent hover:border-red-500/20"
            )}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={clsx(
                    "h-5 w-5 transition-transform duration-300",
                    isWishlisted && "fill-current scale-110",
                    loading && "animate-pulse"
                )}
            />
        </button>
    );
}
