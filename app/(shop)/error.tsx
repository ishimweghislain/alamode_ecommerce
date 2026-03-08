"use client";

import { useEffect } from "react";
import { RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ShopError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[SHOP_ERROR]", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-background-dark">
            <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <div className="w-10 h-10 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
            </div>

            <h1 className="text-3xl md:text-5xl font-outfit font-black text-white mb-4 uppercase tracking-tighter">
                Connection Refinement
            </h1>

            <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
                We are currently synchronizing our luxury vaults. This brief pause ensures you receive the most accurate inventory data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                    onClick={() => reset()}
                    className="btn-primary px-8 py-3 flex items-center gap-2 group"
                >
                    <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    Retry Connection
                </button>

                <Link
                    href="/"
                    className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-luxury text-white font-bold transition-all flex items-center gap-2"
                >
                    <Home className="h-4 w-4" />
                    Back to Gallery
                </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
                <div className="mt-12 p-6 bg-black/40 border border-white/5 rounded-3xl text-left max-w-3xl overflow-auto">
                    <p className="text-red-400 font-mono text-xs mb-2 font-bold uppercase tracking-widest">Diagnostic Log:</p>
                    <pre className="text-gray-500 font-mono text-[10px] leading-relaxed">
                        {error.message}
                        {"\n\n"}
                        Stack: {error.stack}
                        {"\n"}
                        Digest: {error.digest}
                    </pre>
                </div>
            )}
        </div>
    );
}
