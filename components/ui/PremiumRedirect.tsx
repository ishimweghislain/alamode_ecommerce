"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface PremiumRedirectProps {
    message: string;
    submessageText?: string;
    duration: number;
    onComplete: () => void;
    isOpen: boolean;
}

export default function PremiumRedirect({ message, submessageText, duration, onComplete, isOpen }: PremiumRedirectProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (isOpen && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (isOpen && timeLeft === 0) {
            onComplete();
        }
    }, [isOpen, timeLeft, onComplete]);

    // Reset timer when reopening
    useEffect(() => {
        if (isOpen) setTimeLeft(duration);
    }, [isOpen, duration]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
                    {/* Dark Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background-dark/80 backdrop-blur-md pointer-events-auto"
                    />

                    {/* Notification Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm mx-4 bg-[#0f0f0f] border border-brand-gold/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(255,184,0,0.1)] pointer-events-auto"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-accent/5 overflow-hidden">
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-1/3 h-full bg-white/5 skew-x-12"
                            />
                        </div>

                        <div className="relative flex flex-col items-center text-center space-y-6">
                            <div className="h-16 w-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center relative">
                                <Sparkles className="h-8 w-8 text-brand-gold animate-pulse" />
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-brand-accent rounded-full animate-ping" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-outfit font-black text-white uppercase tracking-wider">
                                    {message}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                    {submessageText || "Preparing your elite experience..."}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/10">
                                <Loader2 className="h-4 w-4 text-brand-gold animate-spin" />
                                <span className="text-[10px] font-black font-mono text-gray-300 tracking-[0.2em] uppercase">
                                    Redirect in {timeLeft}s
                                </span>
                            </div>
                        </div>

                        {/* Top Right Decorative Tag */}
                        <div className="absolute top-6 right-6 h-1 w-8 bg-brand-gold/40 rounded-full" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
