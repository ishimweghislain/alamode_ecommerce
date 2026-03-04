import Hero from "@/components/ui/Hero";
import ProductCard from "@/components/ui/ProductCard";
import CategoryHighlights from "@/components/ui/CategoryHighlights";
import Link from "next/link";
import Image from "next/image";
import MotionInView from "@/components/ui/MotionInView";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "ADMIN") redirect("/admin");
    if (user.role === "VENDOR") redirect("/vendor");
    if (user.role === "CUSTOMER") redirect("/profile");
  }

  const featuredProductsRaw = await (prisma.product as any).findMany({
    where: { isFeatured: true },
    include: { category: true },
    take: 4,
    orderBy: { updatedAt: 'desc' }
  });

  const trendingProductsRaw = await (prisma.product as any).findMany({
    where: { isTrending: true },
    include: { category: true },
    take: 4,
    orderBy: { updatedAt: 'desc' }
  });

  const featuredProducts = (featuredProductsRaw as any[]).map(p => ({
    ...p,
    category: p.category?.name || "Category"
  }));

  const trendingProducts = (trendingProductsRaw as any[]).map(p => ({
    ...p,
    category: p.category?.name || "Category"
  }));

  return (
    <div className="flex flex-col">
      <Hero />

      <CategoryHighlights />

      {/* Featured Products */}
      <section id="featured-products" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionInView className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2">Featured Products</h2>
              <p className="text-gray-400">Exclusive items selected for their exceptional quality.</p>
            </div>
            <Link href="/shop" className="text-brand-accent hover:text-brand-gold font-medium transition-colors">
              Explore All →
            </Link>
          </MotionInView>

          <MotionInView stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </MotionInView>
        </div>
      </section>

      {/* Banner / Promotion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <MotionInView direction="none" className="max-w-7xl mx-auto rounded-luxury overflow-hidden relative h-[400px] flex items-center">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Promotion"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-[2px]" />
          <div className="relative z-10 p-8 md:p-16 max-w-xl">
            <h2 className="text-4xl font-outfit font-bold text-white mb-6">Elevate Your <br /> Shopping Experience</h2>
            <p className="text-gray-200 mb-8 leading-relaxed">
              Join our exclusive membership program for early access to limited edition releases and white-glove delivery services.
            </p>
            <Link href="/how-it-works" className="btn-gold px-8 py-3 inline-block">
              Learn More
            </Link>
          </div>
        </MotionInView>
      </section>

      {/* Trending Products */}
      <section id="trending-products" className="py-20 mb-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionInView className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2">Trending Now</h2>
              <p className="text-gray-400">What&apos;s currently captivating our elite community.</p>
            </div>
          </MotionInView>

          <MotionInView stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </MotionInView>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-brand-dark/30 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-6">Stay Ahead of the Curve</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Receive curated inspiration, exclusive previews, and the latest marketplace insights directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/5 border border-white/10 rounded-luxury px-6 py-4 focus:outline-none focus:border-brand-accent transition-all"
            />
            <button className="btn-primary h-14 px-8">
              Subscribe
            </button>
          </form>
          <p className="mt-6 text-xs text-gray-500">
            By subscribing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  );
}
