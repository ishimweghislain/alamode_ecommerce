import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

const CategoryHighlights = async () => {
    const categories = await prisma.category.findMany({
        take: 4,
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    return (
        <section className="py-20 bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2 font-outfit uppercase tracking-tighter">Curated Categories</h2>
                        <p className="text-gray-400">Explore our exclusive collections crafted for your lifestyle.</p>
                    </div>
                    <Link href="/categories" className="text-brand-accent hover:text-brand-gold font-medium transition-colors">
                        View All Categories →
                    </Link>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 ${categories.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group relative h-96 overflow-hidden rounded-3xl border border-white/5 shadow-2xl"
                        >
                            <Image
                                src={category.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                            <div className="absolute bottom-8 left-8">
                                <h3 className="text-2xl font-bold text-white mb-2 font-outfit">{category.name}</h3>
                                <p className="text-brand-accent text-sm font-bold uppercase tracking-widest bg-brand-accent/10 px-3 py-1 rounded-full w-fit">
                                    {category._count.products}+ Products
                                </p>
                            </div>
                        </Link>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-4 py-20 text-center text-gray-500 italic">
                            No categories listed yet.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategoryHighlights;
