import Hero from "@/components/ui/Hero";
import CategoryHighlights from "@/components/ui/CategoryHighlights";
import Link from "next/link";
import Image from "next/image";
import MotionInView from "@/components/ui/MotionInView";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCarousel from "../components/ui/ProductCarousel";
import TextReveal from "../components/ui/TextReveal";
import { Suspense } from "react";

export const revalidate = 3600; // Cache for 1 hour

// Skeleton Component for Loading state
const HomeSkeleton = () => (
  <div className="space-y-20 animate-pulse px-4 sm:px-6 lg:px-8 py-20">
    <div className="h-10 w-64 bg-white/5 rounded-full mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-white/5 rounded-3xl" />)}
    </div>
  </div>
);

async function FeaturedProductsSection({ now }: { now: Date }) {
  try {
    const featuredProductsRaw = await (prisma.product as any).findMany({
      where: { isFeatured: true },
      include: {
        category: true,
        promotions: {
          where: { isActive: true, expiresAt: { gt: now } },
          take: 1
        }
      },
      take: 20,
      orderBy: { updatedAt: 'desc' }
    }).catch(() => []);

    const products = (featuredProductsRaw as any[]).map(p => ({
      ...p,
      category: p.category?.name || "Category",
      salePrice: p.promotions?.[0]?.salePrice,
      discountPct: p.promotions?.[0]?.discountPct
    }));

    if (products.length === 0) return null;

    return (
      <section id="featured-products" className="py-20 scroll-mt-20 overflow-hidden text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <MotionInView className="flex justify-between items-end">
            <div className="text-left">
              <TextReveal className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2 uppercase tracking-tighter">
                Featured Collection
              </TextReveal>
              <p className="text-gray-400">Exclusive items selected for their exceptional quality.</p>
            </div>
            <Link href="/products" className="text-brand-accent hover:text-brand-gold font-medium transition-colors">
              Explore All →
            </Link>
          </MotionInView>
        </div>
        <ProductCarousel products={products} />
      </section>
    );
  } catch (error) {
    return null;
  }
}

async function TrendingProductsSection({ now }: { now: Date }) {
  try {
    const trendingProductsRaw = await (prisma.product as any).findMany({
      where: { isTrending: true },
      include: {
        category: true,
        promotions: {
          where: { isActive: true, expiresAt: { gt: now } },
          take: 1
        }
      },
      take: 20,
      orderBy: { updatedAt: 'desc' }
    }).catch(() => []);

    const products = (trendingProductsRaw as any[]).map(p => ({
      ...p,
      category: p.category?.name || "Category",
      salePrice: p.promotions?.[0]?.salePrice,
      discountPct: p.promotions?.[0]?.discountPct
    }));

    if (products.length === 0) return null;

    return (
      <section id="trending-products" className="py-20 mb-20 scroll-mt-20 overflow-hidden text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <MotionInView className="flex justify-between items-end">
            <div className="text-left">
              <TextReveal className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2 uppercase tracking-tighter">
                Trending Now
              </TextReveal>
              <p className="text-gray-400">What&apos;s currently captivating our elite community.</p>
            </div>
          </MotionInView>
        </div>
        <ProductCarousel products={products} reverse />
      </section>
    );
  } catch (error) {
    return null;
  }
}

async function CategoriesSection() {
  try {
    const categories = await prisma.category.findMany({
      take: 4,
      include: {
        _count: {
          select: { products: true }
        }
      }
    }).catch(() => []);

    if (categories.length === 0) return null;

    return <CategoryHighlights categories={categories} />;
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const now = new Date();

  return (
    <div className="flex flex-col">
      {/* Handlers redirects in a non-blocking way */}
      <Suspense fallback={null}>
        <UserRedirect />
      </Suspense>

      <Hero />

      {/* We wrap individual heavy sections in Suspense */}
      {/* This allows Hero to be visible immediately while data loads in background */}

      <Suspense fallback={<HomeSkeleton />}>
        <CategoriesSection />
      </Suspense>

      <Suspense fallback={<div className="h-[400px] flex items-center justify-center opacity-10 font-black text-4xl">LOADING COLLECTIONS...</div>}>
        <FeaturedProductsSection now={now} />
      </Suspense>

      {/* Static Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <MotionInView direction="none" className="max-w-7xl mx-auto rounded-luxury overflow-hidden relative h-[400px] flex items-center shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Promotion"
            fill
            className="object-cover"
            loading="lazy"
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

      <Suspense fallback={<div className="h-[400px] flex items-center justify-center opacity-10 font-black text-4xl uppercase">Trending Incoming...</div>}>
        <TrendingProductsSection now={now} />
      </Suspense>
    </div>
  );
}

// Separate component for user redirection logic to avoid blocking the main shell
async function UserRedirect() {
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "ADMIN") redirect("/admin");
    if (user.role === "VENDOR") redirect("/vendor");
    if (user.role === "CUSTOMER") redirect("/profile");
  }
  return null;
}
