import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { Zap, Tag, Clock, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PromotionForm from "@/components/vendor/PromotionForm";

export const dynamic = "force-dynamic";

export default async function VendorPromotionsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
    if (!vendor) return null;

    const now = new Date();

    const products = await prisma.product.findMany({
        where: { vendorId: vendor.id },
        include: {
            category: true,
            promotions: {
                where: { isActive: true, expiresAt: { gt: now } },
                take: 1,
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const activeCount = products.filter((p) => p.promotions.length > 0).length;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Promotions</h1>
                    <p className="text-gray-400 text-sm">
                        Boost sales by setting time-limited discount prices on your products.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl">
                    <Zap className="h-4 w-4 text-brand-gold" />
                    <span className="text-brand-gold font-bold text-sm">{activeCount} Active</span>
                </div>
            </div>

            {/* Info card */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                    <Tag className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                    <p className="text-white font-bold text-sm mb-1">How Promotions Work</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        Set a discount % and a duration. The sale price will appear in the Promotions section of the site.
                        When the duration ends, the original price is automatically restored. You can cancel a promotion early at any time.
                    </p>
                </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product: any) => {
                    const promo = product.promotions[0] || null;
                    return (
                        <div key={product.id} className="card-luxury p-5 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-xl overflow-hidden relative flex-shrink-0 border border-white/10">
                                    <Image
                                        src={product.images[0] || "/placeholder.png"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{product.name}</p>
                                    <p className="text-gray-500 text-xs">{product.category.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-brand-gold font-bold text-sm">{formatPrice(product.price)}</span>
                                        {promo && (
                                            <>
                                                <span className="text-[10px] text-green-400 font-bold bg-green-400/10 px-1.5 py-0.5 rounded-full">
                                                    -{promo.discountPct}%
                                                </span>
                                                <span className="text-[10px] text-brand-gold font-bold">
                                                    → {formatPrice(promo.salePrice)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {promo && (
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 flex-shrink-0">
                                        <Clock className="h-3 w-3" />
                                        <span>{Math.max(0, Math.ceil((new Date(promo.expiresAt).getTime() - now.getTime()) / 86400000))}d left</span>
                                    </div>
                                )}
                            </div>

                            <PromotionForm
                                productId={product.id}
                                productName={product.name}
                                productPrice={product.price}
                                activePromotion={promo ? {
                                    id: promo.id,
                                    discountPct: promo.discountPct,
                                    salePrice: promo.salePrice,
                                    expiresAt: promo.expiresAt.toISOString(),
                                    label: promo.label,
                                } : null}
                            />
                        </div>
                    );
                })}
            </div>

            {products.length === 0 && (
                <div className="py-24 text-center card-luxury border-dashed border-white/10">
                    <Package className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-white font-bold mb-2">No products yet</p>
                    <p className="text-gray-500 text-sm mb-6">Add products first, then you can create promotions.</p>
                    <Link href="/vendor/products/new" className="btn-primary px-8 py-3">
                        Add Your First Product
                    </Link>
                </div>
            )}
        </div>
    );
}
