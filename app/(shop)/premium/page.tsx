import { prisma } from "@/lib/prisma";
import { Star, Zap, Tag, Clock, ShoppingBag, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
    const now = new Date();

    const promotions = await prisma.promotion.findMany({
        where: {
            isActive: true,
            expiresAt: { gt: now },
        },
        include: {
            product: {
                include: { category: true, vendor: true }
            },
            vendor: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const hasPromos = promotions.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="text-center mb-16 space-y-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em]">
                    <Zap className="h-3 w-3 fill-brand-gold" />
                    Limited Time Deals
                </div>
                <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white uppercase tracking-tighter">
                    Promotions <br />
                    <span className="text-brand-gold">&amp; Deals</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">
                    Exclusive time-limited offers from our top boutiques. Each deal disappears when the clock runs out.
                </p>
            </div>

            {hasPromos ? (
                <>
                    {/* Deals grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {promotions.map((promo: any) => {
                            const daysLeft = Math.max(0, Math.ceil(
                                (new Date(promo.expiresAt).getTime() - now.getTime()) / 86400000
                            ));
                            const hoursLeft = Math.max(0, Math.ceil(
                                (new Date(promo.expiresAt).getTime() - now.getTime()) / 3600000
                            )) % 24;

                            return (
                                <Link
                                    key={promo.id}
                                    href={`/product/${promo.productId}`}
                                    className="group card-luxury overflow-hidden hover:border-brand-gold/40 transition-all duration-500"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <Image
                                            src={promo.product.images[0] || "/placeholder.png"}
                                            alt={promo.product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {/* Discount badge */}
                                        <div className="absolute top-3 left-3 bg-brand-gold text-background-dark text-xs font-black px-3 py-1.5 rounded-full">
                                            -{promo.discountPct}% OFF
                                        </div>
                                        {/* Timer badge */}
                                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-white/10">
                                            <Clock className="h-3 w-3 text-brand-gold" />
                                            <span className="text-[10px] text-white font-bold">
                                                {daysLeft > 0 ? `${daysLeft}d` : `${hoursLeft}h`} left
                                            </span>
                                        </div>
                                        {promo.label && (
                                            <div className="absolute top-3 right-3 bg-brand-accent/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                                                {promo.label}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <p className="text-[10px] text-brand-accent font-bold uppercase tracking-widest mb-1">
                                            {promo.product.category.name}
                                        </p>
                                        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-brand-gold transition-colors line-clamp-1">
                                            {promo.product.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Store className="h-3 w-3 text-gray-500" />
                                            <span className="text-[10px] text-gray-500">{promo.vendor.storeName}</span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="text-2xl font-bold text-brand-gold">
                                                {formatPrice(promo.salePrice)}
                                            </span>
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(promo.originalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </>
            ) : (
                /* Empty state */
                <div className="space-y-12">
                    <div className="py-24 text-center card-luxury border-dashed border-white/10 bg-white/[0.02]">
                        <div className="p-6 inline-block rounded-full bg-brand-gold/5 border border-brand-gold/10 mb-8">
                            <Tag className="h-14 w-14 text-brand-gold/30" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">No Active Promotions</h2>
                        <p className="text-gray-400 max-w-md mx-auto leading-relaxed mb-8">
                            Our boutique vendors haven&apos;t launched any deals yet. Check back soon —
                            exclusive time-limited offers appear here. In the meantime, browse the full mall.
                        </p>
                        <Link href="/shop" className="btn-gold px-10 py-4 inline-flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            <span>Browse the Mall</span>
                        </Link>
                    </div>

                    {/* Teaser rows */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Zap, title: "Flash Sales", desc: "Lightning-fast deals that go in hours. Be quick." },
                            { icon: Tag, title: "Seasonal Offers", desc: "Special discounts tied to events, seasons, and celebrations." },
                            { icon: Star, title: "Vendor Specials", desc: "Hand-picked deals from your favorite luxury boutiques." },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="card-luxury p-8 border-brand-gold/10 bg-brand-gold/[0.02] text-center">
                                <Icon className="h-8 w-8 text-brand-gold mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
