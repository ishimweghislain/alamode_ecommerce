import Link from "next/link";
import Image from "next/image";

const categories = [
    {
        name: "Fashion",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
        href: "/categories/fashion",
        count: "2.4k+ Products",
    },
    {
        name: "Home Decor",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
        href: "/categories/decor",
        count: "800+ Products",
    },
    {
        name: "Technology",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        href: "/categories/technology",
        count: "1.2k+ Products",
    },
    {
        name: "Accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
        href: "/categories/accessories",
        count: "500+ Products",
    },
];

const CategoryHighlights = () => {
    return (
        <section className="py-20 bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2">Curated Categories</h2>
                        <p className="text-gray-400">Explore our exclusive collections crafted for your lifestyle.</p>
                    </div>
                    <Link href="/categories" className="text-brand-accent hover:text-brand-gold font-medium transition-colors">
                        View All Categories →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative h-80 overflow-hidden rounded-luxury"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-6 left-6">
                                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                                <p className="text-brand-accent text-sm font-medium">{category.count}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryHighlights;
