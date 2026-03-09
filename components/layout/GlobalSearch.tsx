"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Search, Package, Store, Tag, ArrowRight, Loader2,
    ChevronDown, ChevronRight, X, LayoutGrid, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import axios from "axios";
import { clsx } from "clsx";

interface Subcategory {
    id: string;
    name: string;
    slug: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    subcategories?: Subcategory[];
    _count?: { products: number };
}

interface GlobalSearchProps {
    variant?: "navbar" | "hero";
}

export default function GlobalSearch({ variant = "navbar" }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Category selector state
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
    const [catsLoaded, setCatsLoaded] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const catRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const isHero = variant === "hero";

    // Load categories once
    useEffect(() => {
        axios.get("/api/categories").then((res) => {
            setCategories(res.data || []);
            setCatsLoaded(true);
        }).catch(() => setCatsLoaded(true));
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsCatOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Live search with debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const catParam = selectedCategory ? `&category=${selectedCategory.slug}` : "";
                    const subParam = selectedSubcategory ? `&subcategory=${selectedSubcategory.slug}` : "";
                    const response = await axios.get(`/api/search?q=${query}${catParam}${subParam}`);
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
    }, [query, selectedCategory, selectedSubcategory]);

    const handleSearch = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (selectedCategory) params.set("category", selectedCategory.slug);
        if (selectedSubcategory) params.set("subcategory", selectedSubcategory.slug);

        const queryString = params.toString();
        router.push(queryString ? `/shop?${queryString}` : "/shop");
        setIsOpen(false);
        setIsCatOpen(false);
    }, [query, selectedCategory, selectedSubcategory, router]);

    const handleCategorySelect = useCallback((cat: Category | null, sub?: Subcategory) => {
        setSelectedCategory(cat);
        setSelectedSubcategory(sub || null);
        setIsCatOpen(false);
        setHoveredCategory(null);
        // Focus input after selection
        setTimeout(() => inputRef.current?.focus(), 50);
    }, []);

    const clearFilters = useCallback(() => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
    }, []);

    const categoryLabel = selectedSubcategory
        ? selectedSubcategory.name
        : selectedCategory
            ? selectedCategory.name
            : "All Categories";

    return (
        <div ref={searchRef} className={clsx(
            "relative group",
            isHero ? "w-full lg:max-w-5xl" : "w-full max-w-md hidden md:block"
        )}>
            <form onSubmit={handleSearch} className="relative">
                {/* ─── UNIFIED SEARCH BAR ─────────────────────────────── */}
                <div className={clsx(
                    "flex items-center w-full bg-white/5 border border-white/10 rounded-luxury text-white transition-all group-hover:border-white/20 focus-within:border-brand-accent focus-within:bg-white/[0.08]",
                    isHero ? "min-h-[64px]" : "min-h-[42px]"
                )}>

                    {/* ── Category Selector Button ── */}
                    <div className="relative flex-shrink-0" ref={catRef}>
                        <button
                            type="button"
                            onClick={() => { setIsCatOpen(!isCatOpen); setIsOpen(false); }}
                            className={clsx(
                                "flex items-center gap-1.5 font-bold whitespace-nowrap transition-all border-r border-white/10 hover:text-brand-accent",
                                isHero
                                    ? "px-5 py-5 text-sm"
                                    : "px-3 py-2.5 text-xs",
                                selectedCategory ? "text-brand-accent" : "text-gray-400"
                            )}
                        >
                            <LayoutGrid className={isHero ? "h-4 w-4 shrink-0" : "h-3.5 w-3.5 shrink-0"} />
                            <span className={isHero ? "max-w-[140px] truncate" : "max-w-[90px] truncate"}>
                                {categoryLabel}
                            </span>
                            <ChevronDown className={clsx(
                                "shrink-0 transition-transform duration-200",
                                isHero ? "h-4 w-4" : "h-3.5 w-3.5",
                                isCatOpen && "rotate-180"
                            )} />
                        </button>

                        {/* Active filter pill */}
                        {selectedCategory && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                                className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-brand-accent rounded-full flex items-center justify-center z-10 hover:bg-brand-gold transition-colors"
                            >
                                <X className="h-2.5 w-2.5 text-white" />
                            </button>
                        )}
                    </div>

                    {/* ── Search Icon ── */}
                    <Search className={clsx(
                        "flex-shrink-0 text-gray-500 group-focus-within:text-brand-accent transition-colors",
                        isHero ? "h-5 w-5 ml-4" : "h-4 w-4 ml-3"
                    )} />

                    {/* ── Text Input ── */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={
                            selectedCategory
                                ? `Search in ${selectedSubcategory?.name || selectedCategory.name}...`
                                : isHero
                                    ? "What are you looking for today? (e.g. Jordan, iPhone...)"
                                    : "Search collection..."
                        }
                        className={clsx(
                            "flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none",
                            isHero ? "py-5 px-4 text-base" : "py-2.5 px-3 text-sm"
                        )}
                    />

                    {/* ── Loading Spinner ── */}
                    {isLoading && (
                        <Loader2 className={clsx(
                            "flex-shrink-0 text-brand-accent animate-spin",
                            isHero ? "h-5 w-5 mr-4" : "h-4 w-4 mr-3"
                        )} />
                    )}

                    {/* ── Submit Button (hero only) ── */}
                    {isHero && (
                        <button
                            type="submit"
                            className="flex-shrink-0 mr-2 px-6 py-2.5 bg-brand-accent hover:bg-brand-gold text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/20"
                        >
                            Search
                        </button>
                    )}
                </div>
            </form>

            {/* ─── CATEGORY DROPDOWN PANEL ──────────────────────────────── */}
            {isCatOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 z-[300] animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_30px_60px_-10px_rgba(0,0,0,0.9)] overflow-hidden flex">

                        {/* Left: Category List */}
                        <div className="w-52 border-r border-white/5 py-2">
                            {/* All option */}
                            <button
                                type="button"
                                onMouseEnter={() => setHoveredCategory(null)}
                                onClick={() => handleCategorySelect(null)}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                                    !selectedCategory ? "text-brand-accent bg-brand-accent/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-semibold">All Categories</span>
                            </button>

                            <div className="h-px bg-white/5 mx-3 my-1" />

                            {!catsLoaded ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 text-brand-accent animate-spin" />
                                </div>
                            ) : categories.length === 0 ? (
                                <p className="text-xs text-gray-600 text-center py-6">No categories found</p>
                            ) : (
                                categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onMouseEnter={() => setHoveredCategory(cat)}
                                        onClick={() => handleCategorySelect(cat)}
                                        className={clsx(
                                            "w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors text-left",
                                            selectedCategory?.id === cat.id && !selectedSubcategory
                                                ? "text-brand-accent bg-brand-accent/10"
                                                : hoveredCategory?.id === cat.id
                                                    ? "text-white bg-white/5"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <span className="font-semibold truncate">{cat.name}</span>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {cat._count && (
                                                <span className="text-[10px] font-mono text-gray-600">{cat._count.products}</span>
                                            )}
                                            {cat.subcategories && cat.subcategories.length > 0 && (
                                                <ChevronRight className="h-3 w-3 text-gray-600" />
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Right: Subcategories Panel */}
                        {hoveredCategory && hoveredCategory.subcategories && hoveredCategory.subcategories.length > 0 && (
                            <div className="w-48 py-2 animate-in fade-in slide-in-from-left-2 duration-150">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-4 py-1.5">
                                    {hoveredCategory.name}
                                </p>
                                <div className="h-px bg-white/5 mx-3 mb-1" />

                                {/* Browse all in this category */}
                                <button
                                    type="button"
                                    onClick={() => handleCategorySelect(hoveredCategory)}
                                    className={clsx(
                                        "w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left",
                                        selectedCategory?.id === hoveredCategory.id && !selectedSubcategory
                                            ? "text-brand-accent"
                                            : "text-gray-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Tag className="h-3 w-3 shrink-0" />
                                    <span className="text-xs font-semibold italic">All in {hoveredCategory.name}</span>
                                </button>

                                {hoveredCategory.subcategories.map((sub) => (
                                    <button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => handleCategorySelect(hoveredCategory, sub)}
                                        className={clsx(
                                            "w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left",
                                            selectedSubcategory?.id === sub.id
                                                ? "text-brand-accent bg-brand-accent/10"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <span className="font-medium">{sub.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Placeholder when no subcategory panel */}
                        {!(hoveredCategory && hoveredCategory.subcategories && hoveredCategory.subcategories.length > 0) && (
                            <div className="w-48 flex flex-col items-center justify-center gap-2 text-center px-4 py-8 border-l border-white/5">
                                <LayoutGrid className="h-6 w-6 text-gray-800" />
                                <p className="text-[11px] text-gray-700 leading-tight">Hover a category to<br />see subcategories</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ─── HERO: Quick Category Chips ──────────────────────────── */}
            {isHero && catsLoaded && categories.length > 0 && !isOpen && !isCatOpen && (
                <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in duration-300">
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold self-center mr-1">Quick:</span>
                    {categories.slice(0, 6).map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                                setSelectedCategory(cat);
                                setSelectedSubcategory(null);
                                inputRef.current?.focus();
                            }}
                            className={clsx(
                                "px-3 py-1 rounded-full text-[11px] font-bold border transition-all",
                                selectedCategory?.id === cat.id
                                    ? "bg-brand-accent/20 border-brand-accent text-brand-accent"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-brand-accent/50 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* ─── SEARCH RESULTS DROPDOWN ──────────────────────────────── */}
            {isOpen && results && (
                <div className={clsx(
                    "absolute top-[calc(100%+12px)] left-0 w-full bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-[200] overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-300",
                )}>
                    {/* Active filter badge */}
                    {selectedCategory && (
                        <div className="flex items-center gap-2 px-5 pt-4 pb-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Filtering by:</span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-[10px] font-black text-brand-accent uppercase tracking-wider">
                                <Tag className="h-2.5 w-2.5" />
                                {selectedSubcategory ? `${selectedCategory.name} › ${selectedSubcategory.name}` : selectedCategory.name}
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="ml-1 hover:text-white transition-colors"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </span>
                        </div>
                    )}

                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-4 space-y-6">

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
                                {selectedCategory && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-3 text-xs text-brand-accent hover:underline"
                                    >
                                        Try without category filter
                                    </button>
                                )}
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
