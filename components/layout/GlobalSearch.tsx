"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Package, Store, Tag, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import axios from "axios";
import { clsx } from "clsx";

interface GlobalSearchProps {
    variant?: "navbar" | "hero";
}

export default function GlobalSearch({ variant = "navbar" }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const isHero = variant === "hero";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`/api/search?q=${query}`);
                    setResults(response.data);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults(null);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div ref={searchRef} className={clsx(
            "relative group",
            isHero ? "w-full lg:max-w-2xl" : "w-full max-w-md hidden md:block"
        )}>
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isHero ? "What are you looking for today? (e.g. Jordan, iPhone...)" : "Search collection..."}
                    className={clsx(
                        "w-full bg-white/5 border border-white/10 rounded-luxury text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-accent focus:bg-white/[0.08] transition-all group-hover:border-white/20",
                        isHero ? "py-6 pl-14 pr-24 text-base" : "py-2.5 pl-11 pr-4 text-sm rounded-full"
                    )}
                />
                <Search className={clsx(
                    "absolute top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-accent transition-colors",
                    isHero ? "left-6 h-5 w-5" : "left-4 h-4 w-4"
                )} />

                {isHero && (
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-brand-accent hover:bg-brand-gold text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/20"
                    >
                        Search
                    </button>
                )}

                {isLoading && (
                    <Loader2 className={clsx(
                        "absolute top-1/2 -translate-y-1/2 text-brand-accent animate-spin",
                        isHero ? "right-24" : "right-4 h-4 w-4"
                    )} />
                )}
            </form>

            {isOpen && results && (
                <div className={clsx(
                    "absolute top-[calc(100%+12px)] left-0 min-w-full w-max max-w-[90vw] bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-[200] overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-300",
                )}>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-4">
                        {/* Products */}
                        {results.products?.length > 0 && (
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] px-3 mb-2 flex items-center gap-2">
                                    <Package className="h-3 w-3" />
                                    Boutique Pieces
                                </p>
                                <div className="space-y-1">
                                    {results.products.map((p: any) => (
                                        <button
                                            key={p.id}
                                            onClick={() => { router.push(`/product/${p.id}`); setIsOpen(false); }}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors group/item"
                                        >
                                            <div className="h-10 w-10 relative rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                                <Image src={p.images[0] || "/placeholder.png"} alt={p.name} fill className="object-cover" />
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-white text-sm font-bold truncate group-hover/item:text-brand-gold transition-colors">{p.name}</p>
                                                    <span className="shrink-0 bg-brand-gold/10 text-brand-gold text-[8px] font-black px-1.5 py-0.5 rounded-full border border-brand-gold/20 uppercase tracking-tighter">
                                                        {p.vendor?.storeName}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-mono">{formatPrice(p.price)}</p>
                                            </div>
                                            <ArrowRight className="h-3 w-3 text-gray-600 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Vendors */}
                        {results.vendors?.length > 0 && (
                            <div className="pt-2 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] px-3 mb-2 flex items-center gap-2">
                                    <Store className="h-3 w-3" />
                                    Curated Boutiques
                                </p>
                                <div className="space-y-1">
                                    {results.vendors.map((v: any) => (
                                        <button
                                            key={v.id}
                                            onClick={() => { router.push(`/shop?vendorId=${v.id}`); setIsOpen(false); }}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors group/item"
                                        >
                                            <div className="h-10 w-10 relative rounded-full overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                                                <Image src={v.logo || "/placeholder-vendor.png"} alt={v.storeName} fill className="object-cover" />
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                                <p className="text-white text-sm font-bold truncate group-hover/item:text-brand-accent transition-colors">{v.storeName}</p>
                                                <p className="text-[10px] text-gray-500 lowercase truncate italic">{v.description?.slice(0, 40)}...</p>
                                            </div>
                                            <Tag className="h-3 w-3 text-brand-accent opacity-0 group-hover/item:opacity-100 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        {results.categories?.length > 0 && (
                            <div className="pt-2 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] px-3 mb-2 flex items-center gap-2">
                                    <Tag className="h-3 w-3" />
                                    Collections
                                </p>
                                <div className="flex flex-wrap gap-2 px-3 pb-2">
                                    {results.categories.map((c: any) => (
                                        <button
                                            key={c.id}
                                            onClick={() => { router.push(`/shop?category=${c.slug}`); setIsOpen(false); }}
                                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-gray-400 hover:text-white hover:border-brand-accent hover:bg-brand-accent/10 transition-all font-bold"
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(!results.products?.length && !results.vendors?.length && !results.categories?.length) && (
                            <div className="py-8 text-center">
                                <Search className="h-8 w-8 text-gray-800 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No matches in our collection</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSearch}
                        className="w-full p-3 bg-brand-accent/10 border-t border-white/5 text-brand-accent text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-accent hover:text-white transition-all"
                    >
                        View all results in Mall
                    </button>
                </div>
            )}
        </div>
    );
}
