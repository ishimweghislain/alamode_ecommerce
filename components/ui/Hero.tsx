import Link from "next/link";
import Image from "next/image";

const Hero = () => {
    return (
        <section className="relative h-[80vh] w-full flex items-center overflow-hidden">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Marketplace"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                    <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-4 block">
                        Exclusively for Rwanda
                    </span>
                    <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white leading-tight mb-6 uppercase tracking-tighter">
                        Sell Well <br />
                        <span className="text-brand-accent">&</span> Buy Better
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
                        Experience Rwanda's most exclusive marketplace for high-end fashion, technology, and home masterpieces.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/shop" className="btn-primary flex items-center justify-center min-w-[200px] h-14 text-sm font-bold uppercase tracking-widest">
                            Shop Now
                        </Link>
                        <Link href="/login" className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-luxury flex items-center justify-center min-w-[200px] h-14 text-sm font-bold uppercase tracking-widest transition-all">
                            Sell on Alamode
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-10">
                        <a href="#featured-products" className="text-xs font-black text-gray-500 hover:text-brand-accent uppercase tracking-[0.3em] transition-all flex items-center gap-2 group">
                            <span className="w-8 h-[1px] bg-gray-500 group-hover:bg-brand-accent group-hover:w-12 transition-all" />
                            View Featured
                        </a>
                        <a href="#trending-products" className="text-xs font-black text-gray-500 hover:text-brand-gold uppercase tracking-[0.3em] transition-all flex items-center gap-2 group">
                            <span className="w-8 h-[1px] bg-gray-500 group-hover:bg-brand-gold group-hover:w-12 transition-all" />
                            View Trending
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
