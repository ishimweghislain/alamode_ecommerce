"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log error to an observability service
        console.error("[ADMIN_DASHBOARD_ERROR]", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-background-dark text-center">
            <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-outfit font-bold text-white mb-4">Dashboard Intelligence Error</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                We encountered an issue while aggregating real-time diagnostics for your ecosystem. This could be due to a brief synchronization lag.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="btn-primary px-8 py-3 flex items-center gap-2"
                >
                    <RotateCcw className="h-4 w-4" />
                    Retry Sync
                </button>
                <a
                    href="/"
                    className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-luxury transition-all text-sm font-bold"
                >
                    Return Home
                </a>
            </div>
            {process.env.NODE_ENV === "development" && (
                <div className="mt-12 p-4 bg-black/50 rounded-xl text-left font-mono text-[10px] text-red-400 max-w-2xl overflow-auto border border-red-500/20">
                    <p className="font-bold mb-2">Internal Diagnostics:</p>
                    <pre>{error.message}</pre>
                    <p className="mt-2 text-gray-500 italic">Digest: {error.digest}</p>
                </div>
            )}
        </div>
    );
}
