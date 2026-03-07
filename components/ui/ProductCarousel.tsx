"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import ProductCard from "./ProductCard";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
    products: any[];
    reverse?: boolean;
}

const ProductCarousel = ({ products, reverse = false }: ProductCarouselProps) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const controls = useAnimationControls();

    // If no products, don't render
    if (!products || products.length === 0) return null;

    const validProducts = products.filter(p => p.id && p.name);
    // Increase duplication for smoother loop
    const displayProducts = [...validProducts, ...validProducts, ...validProducts, ...validProducts];

    const itemWidth = 332; // 300px + 32px gap (8 * 4)
    const totalWidth = validProducts.length * itemWidth;

    useEffect(() => {
        if (isPlaying) {
            controls.start({
                x: reverse ? [0, -totalWidth] : [-totalWidth, 0],
                transition: {
                    duration: validProducts.length * 10, // 10s per item for smooth slow crawl
                    repeat: Infinity,
                    ease: "linear",
                }
            });
        } else {
            controls.stop();
        }
    }, [isPlaying, controls, totalWidth, reverse, validProducts.length]);

    const xPos = useRef(0);

    const handleNext = () => {
        setIsPlaying(false);
        xPos.current -= itemWidth;
        controls.set({ x: xPos.current });
    };

    const handlePrev = () => {
        setIsPlaying(false);
        xPos.current += itemWidth;
        controls.set({ x: xPos.current });
    };

    return (
        <div className="relative w-full overflow-hidden py-10 group">
            {/* Controls */}
            <div className="absolute top-0 right-10 flex gap-3 z-20">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-brand-accent hover:text-black transition-all shadow-xl"
                >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <div className="flex gap-1">
                    <button
                        onClick={handlePrev}
                        className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-brand-gold hover:text-black transition-all"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-brand-gold hover:text-black transition-all"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Gradient Mask for Edges */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex gap-8 px-4"
                animate={controls}
                style={{
                    width: "fit-content",
                }}
            >
                {displayProducts.map((product, idx) => (
                    <div key={`${product.id}-${idx}`} className="w-[300px] flex-shrink-0">
                        <ProductCard {...product} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default ProductCarousel;
