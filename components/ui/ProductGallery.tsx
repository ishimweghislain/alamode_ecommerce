"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const productImages = images.length > 0 ? images : ["/placeholder.png"];

    const next = () => setActiveIndex((prev) => (prev + 1) % productImages.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

    return (
        <div className="space-y-4">
            <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 group shadow-2xl">
                {productImages.map((img, i) => (
                    <div
                        key={img + i}
                        className={clsx(
                            "absolute inset-0 transition-opacity duration-500",
                            i === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`${name} viewed from angle ${i + 1}`}
                            fill
                            className="object-cover"
                            priority={i === 0}
                        />
                    </div>
                ))}

                {productImages.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-accent"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-accent"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                            {productImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={clsx(
                                        "h-1.5 rounded-full transition-all duration-300",
                                        i === activeIndex ? "w-8 bg-brand-accent" : "w-2 bg-white/40 hover:bg-white/60"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {productImages.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={clsx(
                            "relative aspect-square rounded-xl overflow-hidden border-2 transition-all active:scale-95 shadow-lg",
                            i === activeIndex ? "border-brand-accent scale-105" : "border-white/10 hover:border-white/30"
                        )}
                    >
                        <Image src={img} alt={`${name} thumb ${i}`} fill className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
