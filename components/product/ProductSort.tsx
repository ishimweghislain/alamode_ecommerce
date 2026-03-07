"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { useTransition } from "react";

const ProductSort = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentSort = searchParams.get("sort") || "latest";
    const query = searchParams.get("q");

    const handleSort = (newSort: string) => {
        if (newSort === currentSort) return;

        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (newSort === "latest") {
                params.delete("sort");
            } else {
                params.set("sort", newSort);
            }
            router.push(`/products?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <div className={clsx(
            "flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10 self-stretch sm:self-auto transition-opacity",
            isPending ? "opacity-50" : "opacity-100"
        )}>
            <button
                onClick={() => handleSort("latest")}
                disabled={isPending}
                className={clsx(
                    "flex-1 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 min-w-[140px]",
                    currentSort === "latest" ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" : "text-gray-500 hover:text-white"
                )}
            >
                <Zap className={clsx("h-4 w-4", currentSort === "latest" ? "animate-pulse" : "")} />
                Newest
            </button>
            <button
                onClick={() => handleSort("popular")}
                disabled={isPending}
                className={clsx(
                    "flex-1 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 min-w-[140px]",
                    currentSort === "popular" ? "bg-brand-gold text-background-dark shadow-lg shadow-brand-gold/20" : "text-gray-500 hover:text-white"
                )}
            >
                <Sparkles className={clsx("h-4 w-4", currentSort === "popular" ? "animate-pulse" : "")} />
                Popular
            </button>
        </div>
    );
};

export default ProductSort;
