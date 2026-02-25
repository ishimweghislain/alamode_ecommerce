export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { notFound } from "next/navigation";


interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                include: {
                    category: true,
                },
            },
        },
    });

    if (!category) {
        return notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-12">
                <div className="flex items-center gap-2 text-brand-accent text-sm font-bold uppercase tracking-widest mb-2">
                    <span>Categories</span>
                    <span>/</span>
                    <span className="text-white">{category.name}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-4">{category.name}</h1>
                <p className="text-gray-400 text-lg">
                    Exploring our {category.products.length} exclusive items in {category.name}.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.products.map((product: any) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop"}
                        category={category.name}
                    />
                ))}
            </div>

            {category.products.length === 0 && (
                <div className="text-center py-40 card-luxury">
                    <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
                    <p className="text-gray-400">We couldn't find any products in this category yet.</p>
                </div>
            )}
        </div>
    );
}
