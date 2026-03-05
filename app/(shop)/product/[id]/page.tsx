import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { ArrowLeft, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star, Edit, Trash, Clock, Ruler } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import ProductGallery from "@/components/ui/ProductGallery";
import WishlistToggle from "@/components/ui/WishlistToggle";
import ProductActions from "@/components/product/ProductActions";

export const dynamic = "force-dynamic";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const user = await getCurrentUser();
    const isAdmin = user?.role === "ADMIN";

    const product = await (prisma.product as any).findUnique({
        where: { id },
        include: {
            category: true,
            vendor: true,
            wishlistedBy: user?.id ? { where: { id: user.id } } : false,
            reviews: { include: { user: true } },
            promotions: {
                where: { isActive: true, expiresAt: { gt: new Date() } },
                take: 1,
            },
        }
    });

    const isWishlisted = !!(product as any)?.wishlistedBy?.length;

    if (!product) {
        return notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Navigation Bar */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <Link
                        href={isAdmin ? "/admin/products" : (product.vendor?.id ? `/shop?vendorId=${product.vendor.id}` : "/shop")}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to {isAdmin ? "Inventory" : "Shop"}</span>
                    </Link>

                    {!isAdmin && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-accent/10 border border-brand-accent/30 rounded-full animate-in zoom-in slide-in-from-left duration-500 shadow-[0_0_20px_rgba(255,184,76,0.1)]">
                            <Store className="h-3.5 w-3.5 text-brand-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                Currently in <span className="text-brand-gold">{product.vendor.storeName}</span>
                            </span>
                        </div>
                    )}
                </div>

                {isAdmin && (
                    <div className="flex gap-3">
                        <Link href={`/vendor/products/${product.id}/edit`} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
                            <Edit className="h-5 w-5" />
                        </Link>
                        <button className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all">
                            <Trash className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <ProductGallery images={product.images} name={product.name} />

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-brand-dark text-brand-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                {product.category.name}
                            </span>
                            {!isAdmin && (
                                <WishlistToggle productId={product.id} initialIsWishlisted={isWishlisted} />
                            )}
                        </div>
                        <h1 className="text-4xl font-outfit font-bold text-white mb-4 leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-brand-gold fill-brand-gold" />
                                ))}
                            </div>
                            <span className="text-gray-400 text-sm">({product.reviews.length} reviews)</span>
                            <span className="h-4 w-[1px] bg-white/10"></span>
                            <span className="text-brand-accent text-sm font-bold">In Stock ({product.stock})</span>
                        </div>
                        {/* Price — show promotion if active */}
                        {(() => {
                            const promo = (product as any).promotions?.[0];
                            if (promo) {
                                const daysLeft = Math.max(0, Math.ceil(
                                    (new Date(promo.expiresAt).getTime() - Date.now()) / 86400000
                                ));
                                return (
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-3xl font-bold text-brand-gold font-outfit">
                                                {formatPrice(promo.salePrice)}
                                            </span>
                                            <span className="text-xl text-gray-500 line-through">
                                                {formatPrice(promo.originalPrice)}
                                            </span>
                                            <span className="bg-brand-gold text-background-dark text-xs font-black px-2.5 py-1 rounded-full">
                                                -{promo.discountPct}% OFF
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="h-3 w-3 text-brand-gold" />
                                            <span>Sale ends in <strong className="text-brand-gold">{daysLeft}d</strong></span>
                                            {promo.label && <span className="text-brand-accent">· {promo.label}</span>}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className="text-3xl font-bold text-brand-gold mb-8 font-outfit">
                                    {formatPrice(product.price)}
                                </div>
                            );
                        })()}
                    </div>

                    <div className="space-y-6 mb-10">
                        <p className="text-gray-300 leading-relaxed">
                            {product.description}
                        </p>

                        <ProductActions
                            isAdmin={isAdmin}
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                salePrice: (product as any).promotions?.[0]?.isActive && new Date((product as any).promotions[0].expiresAt) > new Date() ? (product as any).promotions[0].salePrice : undefined,
                                image: product.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop",
                                sizes: (product as any).sizes || [],
                                sizeType: (product as any).sizeType
                            }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <Truck className="h-5 w-5 text-brand-accent" />
                                <span>Express Delivery in Rwanda</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <ShieldCheck className="h-5 w-5 text-brand-accent" />
                                <span>2 Year Premium Warranty</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <RotateCcw className="h-5 w-5 text-brand-accent" />
                                <span>30-Day Luxury Return Policy</span>
                            </div>
                        </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="card-luxury p-4 flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-brand-dark">
                            {product.vendor.logo ? (
                                <Image src={product.vendor.logo} alt={product.vendor.storeName} fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-brand-gold font-bold">
                                    {product.vendor.storeName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-brand-accent font-bold uppercase tracking-wider">Sold by</p>
                            <Link href={`/vendors#${product.vendor.id}`} className="text-white font-bold hover:text-brand-gold transition-colors">
                                {product.vendor.storeName}
                            </Link>
                        </div>
                        <Link href={`/vendors#${product.vendor.id}`} className="ml-auto text-sm text-gray-400 hover:text-white transition-colors">
                            View Store →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

