import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { Package, Plus, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function VendorProductsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) return <div>Store not found.</div>;

    const products = await prisma.product.findMany({
        where: { vendorId: vendor.id },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">My Products</h1>
                    <p className="text-gray-400">Inventory list for <span className="text-brand-accent">{vendor.storeName}</span>.</p>
                </div>
                <Link href="/products/new" className="btn-primary flex items-center gap-2 px-6">
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                </Link>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">Product</th>
                            <th className="p-4 font-bold text-gray-300">Category</th>
                            <th className="p-4 font-bold text-gray-300">Price</th>
                            <th className="p-4 font-bold text-gray-300">Stock</th>
                            <th className="p-4 font-bold text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.map((product: any) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 relative rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.images[0] || "/placeholder.png"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="max-w-[200px]">
                                            <p className="text-white font-medium text-sm truncate">{product.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300">
                                        {product.category.name}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-bold text-brand-gold">
                                    {formatPrice(product.price)}
                                </td>
                                <td className="p-4">
                                    <span className={`text-sm ${product.stock > 0 ? 'text-gray-400' : 'text-red-500 font-bold'}`}>
                                        {product.stock} units
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-brand-accent rounded transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 hover:bg-red-400/10 text-red-400 rounded transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        You haven't listed any products yet.
                    </div>
                )}
            </div>
        </div>
    );
}
