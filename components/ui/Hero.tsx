"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveRight, TrendingUp, Sparkles } from "lucide-react";

const Hero = () => {
    return (
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

                        <div className="flex flex-wrap gap-6 mb-16">
                            <Link href="/shop" className="group btn-primary flex items-center justify-center min-w-[200px] h-16 text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-accent/20">
                                Start Shopping
                                <MoveRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/login" className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 rounded-luxury flex items-center justify-center min-w-[200px] h-16 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Partner with Us
                            </Link>
                        </div>
                    </motion.div>

                    {/* Highly Visible Scroll Buttons */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-10"
                    >
                        <a
                            href="#featured-products"
                            className="bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent/20 hover:border-brand-accent/40 px-6 py-4 rounded-2xl flex items-center gap-3 group transition-all"
                        >
                            <div className="h-2 w-2 rounded-full bg-brand-accent animate-ping" />
                            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">View Featured</span>
                        </a>

                        <a
                            href="#trending-products"
                            className="bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 hover:border-brand-gold/40 px-6 py-4 rounded-2xl flex items-center gap-3 group transition-all"
                        >
                            <TrendingUp className="h-4 w-4 text-brand-gold group-hover:translate-y-[-2px] transition-transform" />
                            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">View Trending</span>
                        </a>
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
    );
};

export default Hero;
