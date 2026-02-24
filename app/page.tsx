import Hero from "@/components/ui/Hero";
import ProductCard from "@/components/ui/ProductCard";
import CategoryHighlights from "@/components/ui/CategoryHighlights";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

const featuredProducts = [
  {
    id: "1",
    name: "Classic Leather Executive Briefcase",
    price: 125000,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop",
    category: "Fashion",
  },
  {
    id: "2",
    name: "Minimalist Ceramic Pendant Lamp",
    price: 45000,
    image: "https://images.unsplash.com/photo-1543198075-8493198a964a?q=80&w=2070&auto=format&fit=crop",
    category: "Home Decor",
  },
  {
    id: "3",
    name: "Ultra-Slim Wireless Mechanical Keyboard",
    price: 85000,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2020&auto=format&fit=crop",
    category: "Technology",
  },
  {
    id: "4",
    name: "Premium Silk Scarf - Midnight Bloom",
    price: 32000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop",
    category: "Accessories",
  },
];

const trendingProducts = [
  {
    id: "5",
    name: "Noise-Cancelling Over-Ear Headphones",
    price: 215000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    category: "Technology",
  },
  {
    id: "6",
    name: "Mid-Century Modern Velvet Armchair",
    price: 340000,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1974&auto=format&fit=crop",
    category: "Home Decor",
  },
  {
    id: "7",
    name: "Signature Gold-Tone Link Watch",
    price: 180000,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop",
    category: "Fashion",
  },
  {
    id: "8",
    name: "Handcrafted Geometric Rug",
    price: 155000,
    image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?q=80&w=2070&auto=format&fit=crop",
    category: "Home Decor",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      <CategoryHighlights />

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2">Featured Products</h2>
              <p className="text-gray-400">Exclusive items selected for their exceptional quality.</p>
            </div>
            <Link href="/shop" className="text-brand-accent hover:text-brand-gold font-medium transition-colors">
              Explore All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner / Promotion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-luxury overflow-hidden relative h-[400px] flex items-center">
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
            <button className="btn-gold px-8 py-3">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2">Trending Now</h2>
              <p className="text-gray-400">What&apos;s currently captivating our elite community.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
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
