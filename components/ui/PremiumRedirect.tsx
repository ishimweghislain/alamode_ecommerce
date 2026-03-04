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
                <div className="fixed top-8 right-8 z-[9999] w-full max-w-sm pointer-events-none">
                    {/* Notification Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        className="relative bg-[#0f0f0f] border border-brand-gold/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto overflow-hidden group"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-accent/5" />

                        <div className="relative flex items-start gap-4">
                            <div className="h-12 w-12 shrink-0 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center relative">
                                <Sparkles className="h-6 w-6 text-brand-gold" />
                                <div className="absolute -top-1 -right-1 h-2 w-2 bg-brand-accent rounded-full animate-ping" />
                            </div>

                            <div className="flex-1 space-y-1">
                                <h3 className="text-sm font-outfit font-black text-white uppercase tracking-widest">
                                    {message}
                                </h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                                    {submessageText || "Elite transition in progress..."}
                                </p>

                                <div className="pt-3 flex items-center gap-2">
                                    <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "100%" }}
                                            animate={{ width: "0%" }}
                                            transition={{ duration: duration, ease: "linear" }}
                                            className="h-full bg-brand-gold"
                                        />
                                    </div>
                                    <span className="text-[9px] font-black font-mono text-brand-gold uppercase">
                                        {timeLeft}s
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Loader icon in corner */}
                        <div className="absolute bottom-4 right-4 h-6 w-6 flex items-center justify-center opacity-20">
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
