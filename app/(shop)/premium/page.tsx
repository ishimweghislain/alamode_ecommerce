import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { Star, ShieldCheck, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
    const products = await prisma.product.findMany({
        where: { isFeatured: true },
        include: { category: true },
        take: 8
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-20 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em]">
                    <Star className="h-3 w-3 fill-brand-gold" />
                    Elite Membership
                </div>
                <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white uppercase tracking-tighter">
                    The Premium <br /> <span className="text-brand-gold">Collection</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">
                    Reserved for those who demand nothing less than perfection. Access exclusive releases and limited edition masterpieces.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="card-luxury p-8 border-brand-gold/20 bg-brand-gold/[0.02]">
                    <Zap className="h-8 w-8 text-brand-gold mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Early Access</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Secure your pieces 48 hours before the general public collection launch.</p>
                </div>
                <div className="card-luxury p-8 border-brand-accent/20 bg-brand-accent/[0.02]">
                    <ShieldCheck className="h-8 w-8 text-brand-accent mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">White-Glove Delivery</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Complimentary climate-controlled transport and personalized white-glove setup.</p>
                </div>
                <div className="card-luxury p-8 border-white/20 bg-white/[0.02]">
                    <Star className="h-8 w-8 text-white mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Private Concierge</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">24/7 dedicated assistance for sourcing rare artifacts across the globe.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

            <div className="mt-20 card-luxury p-12 text-center bg-gradient-to-b from-brand-gold/10 to-transparent border-brand-gold/30">
                <h2 className="text-3xl font-bold text-white mb-6">Experience True Luxury</h2>
                <button className="btn-gold px-12 py-4 text-lg">Apply for Membership</button>
            </div>
        </div>
    );
}
