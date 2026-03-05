"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveRight, TrendingUp, Sparkles, Search, HelpCircle } from "lucide-react";
import PremiumRedirect from "./PremiumRedirect";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GlobalSearch from "../layout/GlobalSearch";

const Hero = () => {
    const router = useRouter();
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

                            <h1 className="text-4xl md:text-6xl font-outfit font-black text-white leading-none mb-8 uppercase tracking-tighter">
                                Buy & Sell <br />
                                at ALAMODE.RW
                            </h1>

                            <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed max-w-xl font-medium">
                                The best place in Rwanda to buy and sell quality fashion, phones, and home goods. Easy and fast.
                            </p>

                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full bg-white/[0.03] backdrop-blur-xl p-2 lg:p-2 rounded-[2rem] border border-white/10 shadow-2xl">
                                    <div className="flex-1">
                                        <GlobalSearch variant="hero" />
                                    </div>

                                    <div className="flex items-center gap-2 px-2 overflow-x-auto no-scrollbar py-2 lg:py-0">
                                        <a
                                            href="#featured-products"
                                            className="whitespace-nowrap bg-white/5 hover:bg-brand-accent/20 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-2 group transition-all"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                                            <span className="text-[10px] font-bold text-gray-300 group-hover:text-white uppercase tracking-widest">Featured</span>
                                        </a>

                                        <a
                                            href="#trending-products"
                                            className="whitespace-nowrap bg-white/5 hover:bg-brand-gold/20 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-2 group transition-all"
                                        >
                                            <TrendingUp className="h-4 w-4 text-brand-gold" />
                                            <span className="text-[10px] font-bold text-gray-300 group-hover:text-white uppercase tracking-widest">Trending</span>
                                        </a>

                                        <Link
                                            href="/how-it-works"
                                            className="whitespace-nowrap bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-2 group transition-all"
                                        >
                                            <HelpCircle className="h-4 w-4 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-300 group-hover:text-white uppercase tracking-widest">Help</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        onClick={() => triggerRedirect("/shop", "Redirecting...", "Please wait...", 2)}
                                        className="group btn-primary flex items-center justify-center min-w-[180px] h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-accent/20"
                                    >
                                        Shop Now
                                        <MoveRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => triggerRedirect("/register?role=VENDOR", "Joining Alamode", "Create a store to start selling...", 3)}
                                        className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 rounded-luxury flex items-center justify-center min-w-[180px] h-14 text-xs font-black uppercase tracking-widest transition-all"
                                    >
                                        Sell With Us
                                    </button>
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
                onComplete={() => {
                    // Reset and redirect
                    setRedirectConfig(prev => ({ ...prev, isOpen: false }));
                    router.push(redirectConfig.targetUrl);
                }}
            />
        </>
    );
};

export default Hero;
