import { prisma } from "@/lib/prisma";
import { Plus, Trash2, Edit } from "lucide-react";
import Image from "next/image";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Categories</h1>
                    <p className="text-gray-400">Manage shop categories and collections.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 px-6">
                    <Plus className="h-4 w-4" />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="card-luxury p-0 overflow-hidden flex flex-col group">
                        <div className="h-32 relative">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-brand-accent/10 flex items-center justify-center">
                                    <ShoppingBag className="text-brand-accent" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-xl font-bold text-white">{category.name}</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">{category._count.products} Products</p>
                            </div>
                        </div>
                        <div className="p-4 flex justify-between items-center border-t border-white/5">
                            <span className="text-xs font-mono text-gray-500">{category.slug}</span>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-2 hover:bg-red-400/10 text-red-400 rounded">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Inline component for default icon
function ShoppingBag({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}
