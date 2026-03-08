"use client";

import Link from "next/link";
import { MoveRight, Ghost } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-background-dark">
            <div className="w-24 h-24 bg-brand-accent/10 rounded-[3rem] flex items-center justify-center mb-8 rotate-12 group hover:rotate-0 transition-transform duration-700 shadow-2xl shadow-brand-accent/5">
                <Ghost className="w-12 h-12 text-brand-accent" />
            </div>

            <h1 className="text-5xl md:text-7xl font-outfit font-black text-white mb-4 uppercase tracking-tighter">
                Lost in <span className="text-brand-gold italic text-4xl md:text-5xl block md:inline">Elegance.</span>
            </h1>

            <p className="text-gray-400 max-w-md mx-auto mb-12 text-sm md:text-base leading-relaxed font-medium">
                The gallery you are looking for has been moved or curated into another collection. Let us guide you back to the main stage.
            </p>

            <Link
                href="/"
                className="group btn-primary px-10 py-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-accent/20"
            >
                Return to Gallery
                <MoveRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="mt-20 opacity-10 font-black text-6xl md:text-9xl tracking-[0.3em] font-outfit select-none">
                404
            </div>
        </div>
    );
}
