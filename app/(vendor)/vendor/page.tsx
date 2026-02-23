import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Package, ShoppingCart, CreditCard, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function VendorDashboard() {
    const user = await getCurrentUser();
    const vendor = await prisma.vendor.findUnique({
        where: { userId: user?.id },
        include: {
            _count: {
                select: { products: true }
            },
            products: {
                take: 5,
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!vendor) return <div>Store not found</div>;

    const stats = [
        { label: "My Products", value: vendor._count.products, icon: Package, color: "text-blue-400" },
        { label: "Total Sales", value: 0, icon: TrendingUp, color: "text-brand-accent" },
        { label: "Pending Orders", value: 0, icon: ShoppingCart, color: "text-brand-gold" },
        { label: "Available Balance", value: formatPrice(0), icon: CreditCard, color: "text-purple-400" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">
                        Welcome, <span className="text-brand-gold">{vendor.storeName}</span>
                    </h1>
                    <p className="text-gray-400">Manage your luxury boutique and track your performance.</p>
                </div>
                <Link href="/vendor/products/new" className="btn-primary flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card-luxury p-6 flex items-center gap-6">
                        <div className={`p-4 rounded-luxury bg-white/5 ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-luxury p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg">Recent Products</h3>
                        <Link href="/vendor/products" className="text-sm text-brand-accent hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {vendor.products.map((product: any) => (
                            <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-luxury transition-colors">
                                <div className="h-12 w-12 rounded-luxury bg-white/10 flex-shrink-0"></div>
                                <div className="flex-1">
                                    <p className="text-white font-medium text-sm">{product.name}</p>
                                    <p className="text-gray-500 text-xs">{formatPrice(product.price)}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${product.stock > 0 ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {vendor.products.length === 0 && (
                            <div className="text-center py-10 text-gray-500 text-sm italic">
                                No products uploaded yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-luxury p-6">
                    <h3 className="font-bold text-white text-lg mb-6">Withdrawal Info</h3>
                    <div className="space-y-6">
                        <div className="p-4 bg-white/5 rounded-luxury">
                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Commission Rate</p>
                            <p className="text-2xl font-bold text-white">8%</p>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Withdrawals are processed every Tuesday and Thursday. Minimum balance required is 50,000 RWF.
                        </p>
                        <button disabled className="btn-gold w-full opacity-50 cursor-not-allowed">
                            Request Withdrawal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
