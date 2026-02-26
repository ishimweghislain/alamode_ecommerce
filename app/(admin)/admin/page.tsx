import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Store, Package, CreditCard, TrendingUp, AlertTriangle, DollarSign, ShoppingBag, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
        userCount,
        vendorCount,
        productCount,
        orderCount,
        pendingVendors,
        totalRevenue,
        dailySales,
        monthlySales,
        recentOrders,
        topProducts,
        newUserCount,
        newVendorCount,
        orderStatuses
    ] = await Promise.all([
        prisma.user.count(),
        prisma.vendor.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.vendor.count({ where: { isApproved: false } }),
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { not: "CANCELLED" } }
        }),
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                createdAt: { gte: startOfDay },
                status: { not: "CANCELLED" }
            }
        }),
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                createdAt: { gte: startOfMonth },
                status: { not: "CANCELLED" }
            }
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        }),
        prisma.product.findMany({
            take: 5,
            orderBy: { orderItems: { _count: 'desc' } },
            select: { name: true, price: true, _count: { select: { orderItems: true } } }
        }),
        prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.vendor.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.order.groupBy({
            by: ['status'],
            _count: { id: true }
        })
    ]);

    const stats = [
        { label: "Total Users", value: userCount, icon: Users, color: "text-blue-400", href: "/admin/users" },
        { label: "Total Vendors", value: vendorCount, icon: Store, color: "text-brand-accent", href: "/admin/vendors" },
        { label: "Total Products", value: productCount, icon: Package, color: "text-brand-gold", href: "/admin/products" },
        { label: "Total Orders", value: orderCount, icon: CreditCard, color: "text-purple-400", href: "/admin/orders" },
    ];

    const revenueStats = [
        { label: "Total Revenue", value: formatPrice(totalRevenue._sum.totalAmount || 0), icon: DollarSign, color: "text-green-400", href: "/admin/analytics" },
        { label: "Daily Sales", value: formatPrice(dailySales._sum.totalAmount || 0), icon: TrendingUp, color: "text-brand-accent", href: "/admin/orders" },
        { label: "Monthly Sales", value: formatPrice(monthlySales._sum.totalAmount || 0), icon: ShoppingBag, color: "text-brand-gold", href: "/admin/analytics" },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Admin Command Center</h1>
                <p className="text-gray-400">Manage and monitor the ALAMODE ecosystem with real-time analytics.</p>
            </div>

            {pendingVendors > 0 && (
                <Link href="/admin/vendors?status=pending" className="block transform hover:scale-[1.01] transition-all">
                    <div className="bg-brand-gold/10 border border-brand-gold/20 p-5 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-brand-gold/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="text-brand-gold h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-brand-gold font-bold">Pending Approvals</p>
                                <p className="text-sm text-brand-gold/70">
                                    You have {pendingVendors} vendor{pendingVendors > 1 ? 's' : ''} waiting for verification.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-brand-gold font-bold text-sm">
                            REVIEW NOW <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </div>
                </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="card-luxury p-6 flex items-center gap-6 hover:border-brand-accent/50 transition-all group">
                        <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white uppercase">{stat.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {revenueStats.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="card-luxury p-6 flex flex-col gap-4 border-l-4 border-l-brand-accent hover:border-brand-accent/50 transition-all group">
                        <div className="flex justify-between items-center">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-brand-accent opacity-0 group-hover:opacity-50 transition-all" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Growth & Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-luxury p-6 bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Marketplace Growth</p>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">New Customers </span>
                            <span className="text-white font-bold bg-blue-500/20 px-2 py-1 rounded-md">+{newUserCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">New Vendors </span>
                            <span className="text-white font-bold bg-brand-accent/20 px-2 py-1 rounded-md">+{newVendorCount}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 italic mt-2">Data since {startOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="md:col-span-2 card-luxury p-6 overflow-hidden">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Order Status Summary</p>
                    <div className="flex flex-wrap gap-4">
                        {orderStatuses.map((status: any) => (
                            <div key={status.status} className="flex-1 min-w-[120px] p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">{status.status}</p>
                                <p className="text-xl font-bold text-white">{status._count.id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-luxury p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg">Recent Transactions</h3>
                        <Link href="/admin/orders" className="text-xs text-brand-accent font-bold hover:underline">VIEW ALL</Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                            <div key={order.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <p className="text-sm font-bold text-white">{order.user.name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-brand-gold">{formatPrice(order.totalAmount)}</p>
                                    <p className={`text-[10px] font-bold uppercase ${order.status === 'PAID' ? 'text-green-400' : 'text-brand-accent'}`}>{order.status}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4 text-sm">No orders yet.</p>
                        )}
                    </div>
                </div>

                <div className="card-luxury p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg">Top Performing Products</h3>
                        <Link href="/admin/products" className="text-xs text-brand-accent font-bold hover:underline">VIEW CATALOG</Link>
                    </div>
                    <div className="space-y-4">
                        {topProducts.length > 0 ? topProducts.map((product) => (
                            <div key={product.name} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-brand-accent/20 flex items-center justify-center font-bold text-brand-accent text-xs">
                                        {product.name.charAt(0)}
                                    </div>
                                    <p className="text-sm font-medium text-white truncate max-w-[150px]">{product.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">{product._count.orderItems} Sales</p>
                                    <p className="text-xs text-gray-500">{formatPrice(product.price)} avg</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4 text-sm">No sales data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
