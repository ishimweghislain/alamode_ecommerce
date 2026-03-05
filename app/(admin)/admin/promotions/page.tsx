import { prisma } from "@/lib/prisma";
import { Tag, Zap, Clock, Store, Package, TrendingDown } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
    const now = new Date();
    let allPromotions: any[] = [];
    try {
        allPromotions = await (prisma as any).promotion.findMany({
            include: {
                product: { include: { category: true } },
                vendor: true,
            },
            orderBy: { createdAt: "desc" },
        }).catch(() => []);
    } catch (error) {
        allPromotions = [];
    }

    const active = allPromotions.filter((p: any) => p.isActive && new Date(p.expiresAt) > now);
    const expired = allPromotions.filter((p: any) => !p.isActive || new Date(p.expiresAt) <= now);

    const totalSavingsGenerated = active.reduce((acc: number, p: any) => acc + (p.originalPrice - p.salePrice), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Promotions Tracker</h1>
                <p className="text-gray-400 text-sm">Monitor all vendor-created promotions across the marketplace.</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Now", value: active.length, icon: Zap, color: "text-brand-gold" },
                    { label: "Total Promotions", value: allPromotions.length, icon: Tag, color: "text-brand-accent" },
                    { label: "Total Discount Given", value: formatPrice(totalSavingsGenerated), icon: TrendingDown, color: "text-green-400" },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="card-luxury p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                            <Icon className={`h-6 w-6 ${color}`} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">{label}</p>
                            <p className="text-white font-bold text-2xl">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active promotions */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-brand-gold" />
                    Active Promotions ({active.length})
                </h2>
                <div className="space-y-3">
                    {active.map((promo: any) => {
                        const daysLeft = Math.max(0, Math.ceil((new Date(promo.expiresAt).getTime() - now.getTime()) / 86400000));
                        return (
                            <div key={promo.id} className="card-luxury p-5 flex items-center gap-5 border-brand-gold/10">
                                <div className="h-12 w-12 rounded-xl overflow-hidden relative flex-shrink-0">
                                    <Image src={promo.product.images[0] || "/placeholder.png"} alt={promo.product.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{promo.product.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Store className="h-3 w-3 text-gray-500" />
                                        <span className="text-[10px] text-gray-500">{promo.vendor.storeName}</span>
                                    </div>
                                </div>
                                <div className="text-center flex-shrink-0">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Discount</p>
                                    <p className="text-brand-gold font-bold text-lg">{promo.discountPct}% OFF</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Original → Sale</p>
                                    <p className="text-sm text-white">
                                        <span className="line-through text-gray-500">{formatPrice(promo.originalPrice)}</span>
                                        {" → "}
                                        <span className="text-brand-gold font-bold">{formatPrice(promo.salePrice)}</span>
                                    </p>
                                </div>
                                <div className="text-center flex-shrink-0">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Expires</p>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Clock className="h-3 w-3 text-brand-gold" />
                                        <span className="text-brand-gold font-bold">{daysLeft}d</span>
                                    </div>
                                </div>
                                {promo.label && (
                                    <span className="px-2 py-1 bg-brand-accent/10 text-brand-accent text-[10px] font-bold rounded-full border border-brand-accent/20 flex-shrink-0">
                                        {promo.label}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                    {active.length === 0 && (
                        <div className="py-12 text-center card-luxury border-dashed border-white/10">
                            <Tag className="h-8 w-8 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No active promotions running</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Expired / cancelled */}
            {expired.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        Expired / Cancelled ({expired.length})
                    </h2>
                    <div className="space-y-3 opacity-60">
                        {expired.slice(0, 10).map((promo: any) => (
                            <div key={promo.id} className="card-luxury p-4 flex items-center gap-4">
                                <Package className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm truncate">{promo.product.name}</p>
                                    <p className="text-[10px] text-gray-500">{promo.vendor.storeName}</p>
                                </div>
                                <p className="text-gray-500 text-sm">{promo.discountPct}% — <span className="line-through">{formatPrice(promo.originalPrice)}</span> → {formatPrice(promo.salePrice)}</p>
                                <p className="text-xs text-gray-600">{new Date(promo.expiresAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
