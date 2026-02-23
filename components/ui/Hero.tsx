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
                    <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white leading-tight mb-6">
                        Redefining <span className="text-brand-accent">Luxury</span> <br />
                        Shopping
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
                        Discover a curated world of premium fashion, decor, and technology from elite vendors. Excellence delivered to your doorstep.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/categories" className="btn-primary flex items-center justify-center min-w-[160px] h-14 text-lg">
                            Shop Now
                        </Link>
                        <Link href="/vendors" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-luxury flex items-center justify-center min-w-[160px] h-14 text-lg transition-all">
                            Sell on Alamode
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
