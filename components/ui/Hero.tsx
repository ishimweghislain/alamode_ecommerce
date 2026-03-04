"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveRight, TrendingUp, Sparkles, Search } from "lucide-react";
import PremiumRedirect from "./PremiumRedirect";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Hero = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [redirectConfig, setRedirectConfig] = useState<{
        isOpen: boolean;
        message: string;
        submessageText: string;
        duration: number;
        targetUrl: string;
    }>({
        isOpen: false,
        message: "",
        submessageText: "",
        duration: 3,
        targetUrl: ""
    });

    const triggerRedirect = (url: string, message: string, sub: string, duration: number) => {
        setRedirectConfig({
            isOpen: true,
            message,
            submessageText: sub,
            duration,
            targetUrl: url
        });
    };

    const handleHeroSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <>
            <section className="relative h-[90vh] w-full flex items-center overflow-hidden bg-brand-dark">
                {/* Background Layer with Parallax-like effect */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                        alt="Luxury Marketplace"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-bold tracking-[0.2em] uppercase text-[10px] mb-8">
                                <Sparkles className="h-3 w-3" />
                                Exclusively for Rwanda
                            </span>

                            <h1 className="text-3xl md:text-5xl font-outfit font-black text-white leading-tight mb-8 uppercase tracking-tighter">
                                Sell Well <br />
                                <span className="text-brand-accent italic font-serif opacity-90">&</span> Buy Better
                            </h1>

                            <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed max-w-xl font-medium">
                                Rwanda's most sophisticated sanctuary for high-end fashion, technology, and home masterpieces. Curated for the few.
                            </p>

                            <div className="flex flex-col gap-6">
                                {/* Search Bar Integration */}
                                <form onSubmit={handleHeroSearch} className="relative w-full max-w-xl group">
                                    <div className="absolute inset-0 bg-brand-accent/5 blur-2xl group-focus-within:bg-brand-accent/10 transition-all" />
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-6 h-5 w-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Hunt for masterpieces, boutiques, or styles..."
                                            className="w-full bg-white/5 border border-white/10 rounded-luxury py-5 pl-14 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-accent/50 focus:bg-white/[0.08] transition-all text-sm md:text-base font-medium"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-3 px-6 py-2.5 bg-brand-accent hover:bg-brand-gold text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/20"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </form>

                                {/* Primary Action Row */}
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <button
                                        onClick={() => triggerRedirect("/shop", "Entering Marketplace", "Curation of exceptional quality awaits...", 3)}
                                        className="group btn-primary flex items-center justify-center min-w-[200px] h-16 text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-accent/20"
                                    >
                                        Shop Now
                                        <MoveRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => triggerRedirect("/register?role=VENDOR", "Partner with ALAMODE", "To showcase your boutique, presence is required. Creating your vendor sanctuary...", 5)}
                                        className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 rounded-luxury flex items-center justify-center min-w-[200px] h-16 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Sell on Alamode
                                    </button>
                                </div>

                                {/* Secondary Shortcut Row */}
                                <div className="flex flex-wrap items-center gap-4">
                                    <a
                                        href="#featured-products"
                                        className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-brand-accent/30 px-6 py-4 rounded-xl flex items-center gap-3 group transition-all hover:scale-105 active:scale-95"
                                    >
                                        <div className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                                        <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-[0.2em] transition-colors">View Featured</span>
                                    </a>

                                    <a
                                        href="#trending-products"
                                        className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-brand-gold/30 px-6 py-4 rounded-xl flex items-center gap-3 group transition-all hover:scale-105 active:scale-95"
                                    >
                                        <TrendingUp className="h-4 w-4 text-brand-gold group-hover:translate-y-[-2px] transition-transform" />
                                        <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-[0.2em] transition-colors">View Trending</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Side Element Decorative */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute right-[-5%] top-[20%] w-[30%] aspect-square rounded-full bg-brand-accent/5 blur-[120px] z-10 pointer-events-none"
                />
            </section>

            <PremiumRedirect
                isOpen={redirectConfig.isOpen}
                message={redirectConfig.message}
                submessageText={redirectConfig.submessageText}
                duration={redirectConfig.duration}
                onComplete={() => router.push(redirectConfig.targetUrl)}
            />
        </>
    );
};

export default Hero;
