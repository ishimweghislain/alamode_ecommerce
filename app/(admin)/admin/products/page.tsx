import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, Search, Filter, MoreVertical, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            vendor: true,
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
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Inventory Management</h1>
                    <p className="text-gray-400">Monitor all products across the marketplace.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            placeholder="Search products..."
                            className="bg-white/5 border border-white/10 rounded-luxury py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">Product</th>
                            <th className="p-4 font-bold text-gray-300">Vendor</th>
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
                                        <div>
                                            <p className="text-white font-medium text-sm line-clamp-1">{product.name}</p>
                                            <p className="text-[10px] text-gray-500 font-mono">{product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-400">
                                    {product.vendor.storeName}
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
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-brand-gold' : 'bg-red-500'}`} />
                                        <span className="text-sm text-gray-400">{product.stock} units</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/product/${product.id}`} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors">
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                        <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No products found in the database.
                    </div>
                )}
            </div>
        </div>
    );
}
