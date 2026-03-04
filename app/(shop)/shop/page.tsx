import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { Search, Filter, SlidersHorizontal, Shirt, Smartphone, Home, LayoutGrid, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export const dynamic = "force-dynamic";

export default async function ShopPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const categorySlug = typeof params.category === 'string' ? params.category : undefined;
    const subcategorySlug = typeof params.subcategory === 'string' ? params.subcategory : undefined;

    const categories = await prisma.category.findMany({
        include: { subcategories: true }
    });

    const activeCategory = categorySlug ? categories.find(c => c.slug === categorySlug) : null;

    const products = await prisma.product.findMany({
        where: {
            AND: [
                query ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                } : {},
                categorySlug ? {
                    category: {
                        slug: categorySlug
                    }
                } : {},
                subcategorySlug ? {
                    subcategory: {
                        slug: subcategorySlug
                    }
                } : {}
            ]
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const shopCategories = [
        { name: "All Items", slug: null, icon: LayoutGrid, color: "from-gray-900 to-gray-800" },
        { name: "Fashion", slug: "fashion", icon: Shirt, color: "from-pink-900/20 to-brand-dark" },
        { name: "Technology", slug: "technology", icon: Smartphone, color: "from-blue-900/20 to-brand-dark" },
        { name: "Decoration", slug: "decoration", icon: Home, color: "from-amber-900/20 to-brand-dark" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header Area */}
            <div className="mb-12">
                <h1 className="text-4xl font-outfit font-bold text-white mb-4">The Collection</h1>
                <p className="text-gray-400">Curated excellence for Rwanda's most discerning tastes.</p>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {shopCategories.map((cat) => {
                    const isActive = categorySlug === cat.slug || (!categorySlug && cat.slug === null);
                    return (
                        <Link
                            key={cat.name}
                            href={cat.slug ? `/shop?category=${cat.slug}` : '/shop'}
                            className={clsx(
                                "relative overflow-hidden p-6 rounded-3xl border transition-all hover:scale-[1.02] active:scale-[0.98] group",
                                isActive
                                    ? "border-brand-accent bg-brand-accent/5 shadow-2xl shadow-brand-accent/10"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                            )}
                        >
                            <div className={clsx(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity",
                                cat.color
                            )} />
                            <div className="relative z-10">
                                <cat.icon className={clsx(
                                    "h-8 w-8 mb-4 transition-transform group-hover:scale-110",
                                    isActive ? "text-brand-accent" : "text-gray-500"
                                )} />
                                <span className={clsx(
                                    "block font-bold text-sm tracking-widest uppercase",
                                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                                )}>
                                    {cat.name}
                                </span>
                            </div>
                            {isActive && (
                                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                            )}
                        </Link>
                    )
                })}
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Enhanced Sidebar Filters */}
                <aside className="lg:w-64 space-y-10">
                    {/* Search Component inside Sidebar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <form action="/shop" method="GET">
                            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                            <input
                                name="q"
                                placeholder="Search here..."
                                defaultValue={query}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-accent transition-all text-xs text-white"
                            />
                        </form>
                    </div>

                    {/* Dynamic Subcategories */}
                    {activeCategory && activeCategory.subcategories.length > 0 && (
                        <div>
                            <h3 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-6 px-1 flex items-center gap-2">
                                <div className="h-1 w-4 bg-brand-accent" />
                                {activeCategory.name} Styles
                            </h3>
                            <div className="space-y-1">
                                <Link
                                    href={`/shop?category=${categorySlug}`}
                                    className={clsx(
                                        "block w-full text-left px-4 py-3 rounded-xl text-xs transition-all",
                                        !subcategorySlug ? "bg-white/10 text-white font-bold" : "text-gray-500 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    All {activeCategory.name}
                                </Link>
                                {activeCategory.subcategories.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        href={`/shop?category=${categorySlug}&subcategory=${sub.slug}`}
                                        className={clsx(
                                            "block w-full text-left px-4 py-3 rounded-xl text-xs transition-all",
                                            subcategorySlug === sub.slug ? "bg-brand-accent/20 text-brand-accent font-bold" : "text-gray-500 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Filter (Static Placeholder) */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-6 px-1 flex items-center gap-2">
                            <div className="h-1 w-4 bg-brand-gold" />
                            Price Window
                        </h3>
                        <div className="px-1">
                            <input type="range" className="w-full accent-brand-accent" />
                            <div className="flex justify-between mt-3 text-[10px] text-gray-500 font-mono">
                                <span>$0</span>
                                <span>$10,000+</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Products Display Row */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Showing <span className="text-white">{products.length}</span> Masterpieces
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                            <SlidersHorizontal className="h-3 w-3" />
                            Sort: Newest
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {products.map((product: any) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.images[0]}
                                category={product.category.name}
                            />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="py-32 text-center rounded-[40px] border border-dashed border-white/10 bg-white/[0.02]">
                            <div className="p-8 inline-block rounded-full bg-white/5 mb-8">
                                <Search className="h-12 w-12 text-gray-700" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No matching treasures found</h3>
                            <p className="text-gray-400 max-w-xs mx-auto">Try adjusting your filters or browsing a different category.</p>
                            <Link href="/shop" className="mt-8 inline-block text-brand-accent font-bold uppercase tracking-widest text-xs hover:underline">
                                Reset Filters
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
