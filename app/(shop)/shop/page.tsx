import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : undefined;
    const category = typeof params.category === 'string' ? params.category : undefined;

    const products = await prisma.product.findMany({
        where: {
            AND: [
                query ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                } : {},
                category ? {
                    category: {
                        slug: category
                    }
                } : {}
            ]
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const categories = await prisma.category.findMany();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-4">The Collection</h1>
                    <p className="text-gray-400 text-lg">Exquisite pieces curated for the modern elite.</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                            placeholder="Search collection..."
                            defaultValue={query}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-brand-accent transition-all text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white text-sm hover:border-brand-accent transition-all group">
                        <Filter className="h-4 w-4 group-hover:text-brand-accent" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="lg:w-64 space-y-8 hidden lg:block">
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 px-1">Categories</h3>
                        <div className="space-y-2">
                            <button className={`block w-full text-left px-4 py-2 rounded-luxury text-sm transition-all ${!category ? 'bg-brand-accent text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                All Items
                            </button>
                            {categories.map((cat: any) => (
                                <button key={cat.id} className={`block w-full text-left px-4 py-2 rounded-luxury text-sm transition-all ${category === cat.slug ? 'bg-brand-accent text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 px-1">Price Range</h3>
                        <div className="px-1">
                            <input type="range" className="w-full accent-brand-accent" />
                            <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
                                <span>$0</span>
                                <span>$10,000+</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
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

                    {products.length === 0 && (
                        <div className="py-20 text-center card-luxury">
                            <div className="p-6 inline-block rounded-full bg-white/5 mb-6">
                                <Search className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No items match your hunt</h3>
                            <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
