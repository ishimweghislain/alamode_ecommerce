import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { Search, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { Suspense } from "react";
import ProductSort from "@/components/product/ProductSort";

export const dynamic = "force-dynamic";

export default async function AllProductsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const sortBy = typeof params.sort === 'string' ? params.sort : 'latest';

    const now = new Date();

    // Base query for products
    const whereClause: any = {
        ...(query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
            ]
        } : {})
    };

    let productsRaw: any[];

    if (sortBy === 'popular') {
        // Most bought
        productsRaw = await (prisma.product as any).findMany({
            where: whereClause,
            include: {
                category: true,
                vendor: true,
                _count: {
                    select: { orderItems: true }
                },
                promotions: {
                    where: { isActive: true, expiresAt: { gt: now } },
                    take: 1,
                },
            },
            orderBy: {
                orderItems: {
                    _count: 'desc'
                }
            }
        });
    } else {
        // Latest added
        productsRaw = await (prisma.product as any).findMany({
            where: whereClause,
            include: {
                category: true,
                vendor: true,
                promotions: {
                    where: { isActive: true, expiresAt: { gt: now } },
                    take: 1,
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    return (
        <div className="min-h-screen bg-background-dark pt-6 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="relative mb-16 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-brand-accent/20 via-brand-dark to-brand-dark border border-white/10 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-widest border border-brand-accent/30">
                                    Curated Collection
                                </span>
                                <span className="h-1 w-8 bg-brand-gold rounded-full" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-outfit font-black text-white mb-4 tracking-tighter">
                                All <span className="text-brand-gold italic">Products.</span>
                            </h1>
                            <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                                See everything we have in one place. Find your favorite items from all our shops.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-xs text-brand-accent font-bold uppercase tracking-[0.2em] mb-1 pl-1">Quick Search</p>
                            <div className="relative min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <form action="/products" method="GET">
                                    {sortBy !== 'latest' && <input type="hidden" name="sort" value={sortBy} />}
                                    <input
                                        name="q"
                                        placeholder="Hunt for magnificence..."
                                        defaultValue={query}
                                        className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-accent transition-all text-sm text-white shadow-xl"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Grid */}
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20">
                                <LayoutGrid className="h-5 w-5 text-brand-accent" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Marketplace Inventory</p>
                                <h2 className="text-xl font-bold text-white">{productsRaw.length} Results</h2>
                            </div>
                        </div>

                        <Suspense fallback={<div className="h-12 w-64 bg-white/5 animate-pulse rounded-2xl" />}>
                            <ProductSort />
                        </Suspense>
                    </div>

                    {productsRaw.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {productsRaw.map((product: any) => {
                                const promo = product.promotions?.[0];
                                return (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        images={product.images}
                                        category={product.category.name}
                                        salePrice={promo ? promo.salePrice : undefined}
                                        discountPct={promo ? promo.discountPct : undefined}
                                        sizes={product.sizes || []}
                                        sizeType={product.sizeType || undefined}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-40 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.02]">
                            <div className="p-10 inline-block rounded-full bg-white/5 mb-10">
                                <Search className="h-16 w-16 text-gray-700" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">A Silent Search</h3>
                            <p className="text-gray-500 max-w-sm mx-auto text-lg leading-relaxed">
                                No items matched your criteria. Try adjusting your search or explore our boutiques.
                            </p>
                            <Link href="/products" className="mt-12 inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">
                                View Everything
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
