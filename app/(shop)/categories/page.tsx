import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-4">Browse Categories</h1>
                <p className="text-gray-400 text-lg">Discover our curated collections across various industries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category: any) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group card-luxury p-0 overflow-hidden flex flex-col h-64 relative"
                    >
                        {category.image ? (
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-brand-dark/40" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent" />

                        <div className="relative z-10 mt-auto p-8">
                            <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                            <p className="text-brand-accent font-medium flex items-center gap-2">
                                {category._count.products} Products
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </p>
                        </div>
                    </Link>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full text-center py-20 card-luxury">
                        <p className="text-gray-400">No categories found. Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
