"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
    products: any[];
    reverse?: boolean;
}

const ProductCarousel = ({ products, reverse = false }: ProductCarouselProps) => {
    // If no products, don't render
    if (!products || products.length === 0) return null;

    // Filter out products with missing critical data if necessary
    const validProducts = products.filter(p => p.id && p.name);

    // We double the products to ensure a seamless infinite loop
    const displayProducts = [...validProducts, ...validProducts, ...validProducts];

    return (
        <div className="relative w-full overflow-hidden py-10">
            {/* Gradient Mask for Edges */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex gap-8 px-4"
                initial={{ x: reverse ? "-66.66%" : "0%" }}
                animate={{ x: reverse ? "0%" : "-66.66%" }}
                transition={{
                    duration: 60, // Slow, elegant crawl
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    width: "fit-content",
                }}
                onHoverStart={(e) => {
                    // This is a bit tricky with linear animation, but keeping it simple for now
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
