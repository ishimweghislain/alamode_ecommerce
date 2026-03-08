import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { Search, Shirt, Smartphone, Home, LayoutGrid, Store, ArrowRight, Star, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 18;

const BoutiqueLoading = () => (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
        <div className="h-[3px] bg-brand-accent w-full animate-progress-loading shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
    </div>
);

// --- Sub-components for Streaming ---

async function BoutiqueDirectory({ query }: { query?: string }) {
    const vendors = await prisma.vendor.findMany({
        where: {
            isApproved: true,
            ...(query ? { storeName: { contains: query, mode: 'insensitive' } } : {})
        },
        include: {
            _count: { select: { products: true } }
        }
    });

    if (vendors.length === 0) {
        return (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                <Store className="h-10 w-10 text-gray-700 mx-auto mb-4" />
                <p className="text-white font-bold text-lg mb-2">No shops found</p>
                <p className="text-gray-500 text-sm">Try a different name or <a href="/shop" className="text-brand-accent hover:underline">view all shops</a>.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor) => (
                <Link
                    key={vendor.id}
                    href={`/shop?vendorId=${vendor.id}`}
                    className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-brand-accent/50 transition-all duration-500"
                >
                    <div className="p-8 pb-32">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group-hover:scale-105 transition-all duration-500">
                                {vendor.logo ? (
                                    <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-brand-accent/10">
                                        <Store className="h-8 w-8 text-brand-accent" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">
                                    {vendor.storeName}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Star className="h-3 w-3 text-brand-gold fill-brand-gold" />
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Master Boutique</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                            {vendor.description || "A curation of exceptional quality and timeless design, exclusive to Alamode."}
                        </p>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-8 pt-0">
                        <div className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/20 transition-all">
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inventory</p>
                                <p className="text-white font-bold">{vendor._count.products} Creations</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-brand-accent text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <ArrowRight className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

async function BoutiqueProducts({ query, categorySlug, subcategorySlug, vendorId, page }: any) {
    const now = new Date();
    const skip = (page - 1) * PAGE_SIZE;

    const whereClause: any = {
        AND: [
            query ? {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            } : {},
            categorySlug ? { category: { slug: categorySlug } } : {},
            subcategorySlug ? { subcategory: { slug: subcategorySlug } } : {},
            vendorId ? { vendorId } : {}
        ]
    };

    const [products, totalCount] = (await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            include: {
                category: true,
                promotions: {
                    where: { isActive: true, expiresAt: { gt: now } },
                    take: 1,
                },
            },
            take: PAGE_SIZE,
            skip: skip,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.product.count({ where: whereClause })
    ]).catch(() => [[], 0])) as [any[], number];

    if (products.length === 0) {
        return (
            <div className="py-32 text-center rounded-[40px] border border-dashed border-white/10 bg-white/[0.02]">
                <div className="p-8 inline-block rounded-full bg-white/5 mb-8">
                    <Search className="h-12 w-12 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No matching treasures found</h3>
                <p className="text-gray-400 max-w-xs mx-auto">Try adjusting your filters or browsing a different boutique.</p>
                <Link href="/shop" className="mt-8 inline-block text-brand-accent font-bold uppercase tracking-widest text-xs hover:underline">
                    Reset Discovery
                </Link>
            </div>
        );
    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product: any) => {
                    const promo = product.promotions?.[0];
                    return (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.images[0]}
                            category={product.category.name}
                            salePrice={promo ? promo.salePrice : undefined}
                            discountPct={promo ? promo.discountPct : undefined}
                            sizes={(product as any).sizes || []}
                            sizeType={(product as any).sizeType || undefined}
                        />
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 mt-8 border-t border-white/5 pt-8">
                    <Link
                        href={`/shop?page=${Math.max(1, page - 1)}${vendorId ? `&vendorId=${vendorId}` : ''}${categorySlug ? `&category=${categorySlug}` : ''}${subcategorySlug ? `&subcategory=${subcategorySlug}` : ''}${query ? `&q=${query}` : ''}`}
                        className={clsx(
                            "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                            page <= 1 ? "opacity-20 pointer-events-none" : "text-gray-400 hover:text-brand-accent"
                        )}
                    >
                        <ChevronLeft className="h-4 w-4" /> Previous
                    </Link>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Page {page} of {totalPages}</span>
                    <Link
                        href={`/shop?page=${Math.min(totalPages, page + 1)}${vendorId ? `&vendorId=${vendorId}` : ''}${categorySlug ? `&category=${categorySlug}` : ''}${subcategorySlug ? `&subcategory=${subcategorySlug}` : ''}${query ? `&q=${query}` : ''}`}
                        className={clsx(
                            "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                            page >= totalPages ? "opacity-20 pointer-events-none" : "text-gray-400 hover:text-brand-accent"
                        )}
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}

// Sidebars & UI Helpers

async function ShopSidebarContent({ categorySlug, subcategorySlug, vendorId }: any) {
    const categories = await prisma.category.findMany({ include: { subcategories: true } });
    const vendors = await prisma.vendor.findMany({ where: { isApproved: true } });
    const activeCategory = categorySlug ? categories.find(c => c.slug === categorySlug) : null;

    return (
        <aside className="lg:w-64 space-y-10">
            {activeCategory && activeCategory.subcategories.length > 0 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <h3 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-6 px-1 flex items-center gap-2">
                        <div className="h-1 w-4 bg-brand-accent" />
                        {activeCategory.name} Styles
                    </h3>
                    <div className="space-y-1">
                        <Link href={`/shop?category=${categorySlug}${vendorId ? `&vendorId=${vendorId}` : ''}`} className={clsx("block w-full text-left px-4 py-3 rounded-xl text-xs transition-all", !subcategorySlug ? "bg-white/10 text-white font-bold" : "text-gray-500 hover:bg-white/5 hover:text-white")}>
                            All {activeCategory.name}
                        </Link>
                        {activeCategory.subcategories.map((sub: any) => (
                            <Link key={sub.id} href={`/shop?category=${categorySlug}&subcategory=${sub.slug}${vendorId ? `&vendorId=${vendorId}` : ''}`} className={clsx("block w-full text-left px-4 py-3 rounded-xl text-xs transition-all", subcategorySlug === sub.slug ? "bg-brand-accent/20 text-brand-accent font-bold" : "text-gray-500 hover:bg-white/5 hover:text-white")}>
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            <div>
                <h3 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-6 px-1 flex items-center gap-2">
                    <div className="h-1 w-4 bg-brand-gold" /> Boutiques
                </h3>
                <div className="space-y-1">
                    <Link href={`/shop${categorySlug ? `?category=${categorySlug}` : ''}`} className={clsx("block w-full text-left px-4 py-3 rounded-xl text-xs transition-all", !vendorId ? "bg-white/10 text-white font-bold" : "text-gray-500 hover:bg-white/5 hover:text-white")}>
                        All Boutiques
                    </Link>
                    {vendors.map((v: any) => (
                        <Link key={v.id} href={`/shop?vendorId=${v.id}${categorySlug ? `&category=${categorySlug}` : ''}`} className={clsx("block w-full text-left px-4 py-3 rounded-xl text-xs transition-all", vendorId === v.id ? "bg-brand-gold/20 text-brand-gold font-bold" : "text-gray-500 hover:bg-white/5 hover:text-white")}>
                            {v.storeName}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

// --- Main Page Shell ---

export default async function ShopPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const categorySlug = typeof params.category === 'string' ? params.category : undefined;
    const subcategorySlug = typeof params.subcategory === 'string' ? params.subcategory : undefined;
    const vendorId = typeof params.vendorId === 'string' ? params.vendorId : undefined;
    const pageNum = typeof params.page === 'string' ? parseInt(params.page) : 1;

    const isShowingProducts = !!(categorySlug || subcategorySlug || vendorId);

    const shopCategories = [
        { name: "All Items", slug: null, icon: LayoutGrid },
        { name: "Fashion", slug: "fashion", icon: Shirt },
        { name: "Technology", slug: "technology", icon: Smartphone },
        { name: "Decoration", slug: "decoration", icon: Home },
    ];

    // Vendor header identity (fetched separately or passed down)
    let activeVendorName = "Our Shops";
    let activeVendorDesc = "Browse all our shops below. Click on any shop to see its products.";
    if (vendorId) {
        const v = await prisma.vendor.findUnique({ where: { id: vendorId } });
        if (v) {
            activeVendorName = v.storeName;
            activeVendorDesc = v.description || "";
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-4xl font-outfit font-bold text-white mb-2">{activeVendorName}</h1>
                        <p className="text-gray-400 max-w-xl text-sm leading-relaxed">{activeVendorDesc}</p>
                    </div>
                    {isShowingProducts && (
                        <Link href="/shop" className="shrink-0 text-brand-accent font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:underline">
                            <Store className="h-4 w-4" /> Back to Mall Directory
                        </Link>
                    )}
                </div>
            </div>

            {!isShowingProducts ? (
                <div className="space-y-10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        <form action="/shop" method="GET">
                            <input name="q" placeholder="Search for a shop by name..." defaultValue={query} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-brand-accent text-sm text-white" />
                        </form>
                    </div>

                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-8">{[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse" />)}</div>}>
                        <BoutiqueDirectory query={query} />
                    </Suspense>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-8 px-4 flex items-center gap-4">
                            <LayoutGrid className="text-brand-accent h-6 w-6" /> Browse by Department
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {shopCategories.map((cat: any) => (
                                <Link key={cat.name} href={cat.slug ? `/shop?category=${cat.slug}` : '/shop'} className="relative overflow-hidden p-6 rounded-3xl border border-white/10 bg-white/5 hover:border-white/20 transition-all group">
                                    <cat.icon className="h-8 w-8 mb-4 text-gray-500 transition-transform group-hover:scale-110 group-hover:text-brand-accent" />
                                    <span className="block font-bold text-sm tracking-widest uppercase text-gray-400 group-hover:text-white">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {shopCategories.map((cat: any) => {
                            const isActive = categorySlug === cat.slug || (!categorySlug && cat.slug === null);
                            return (
                                <Link key={cat.name} href={cat.slug ? `/shop?category=${cat.slug}${vendorId ? `&vendorId=${vendorId}` : ''}` : (vendorId ? `/shop?vendorId=${vendorId}` : '/shop')} className={clsx("relative overflow-hidden px-5 py-4 rounded-2xl border transition-all group flex items-center gap-3", isActive ? "border-brand-accent bg-brand-accent/10" : "border-white/10 bg-white/5")}>
                                    <cat.icon className={clsx("h-5 w-5", isActive ? "text-brand-accent" : "text-gray-500")} />
                                    <span className={clsx("font-bold text-xs tracking-widest uppercase", isActive ? "text-white" : "text-gray-400")}>{cat.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        <Suspense fallback={<div className="w-64 space-y-8 animate-pulse">{[1, 2].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl" />)}</div>}>
                            <ShopSidebarContent categorySlug={categorySlug} subcategorySlug={subcategorySlug} vendorId={vendorId} />
                        </Suspense>

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-8 px-2">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Discovering Masterpieces</p>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest"><SlidersHorizontal className="h-3 w-3" /> Sort: Luxury</div>
                            </div>

                            <Suspense key={`${categorySlug}-${subcategorySlug}-${vendorId}-${query}-${pageNum}`} fallback={<BoutiqueLoading />}>
                                <BoutiqueProducts query={query} categorySlug={categorySlug} subcategorySlug={subcategorySlug} vendorId={vendorId} page={pageNum} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
