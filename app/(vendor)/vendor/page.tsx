import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, CreditCard, TrendingUp, ArrowUpRight, Store, ShieldAlert, Clock, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function VendorDashboard() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <ShieldAlert className="h-16 w-16 text-brand-gold" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Store Access Denied</h1>
                    <p className="text-gray-400 mt-2">You must be an approved vendor to access this portal.</p>
                </div>
                <Link href="/vendors/apply" className="btn-primary px-8">
                    Apply Now
                </Link>
            </div>
        );
    }

    // Fetch Real Analytics
    const vendorId = vendor.id;

    // 1. Total Revenue (PAID, SHIPPED, DELIVERED)
    const revenueResult = await prisma.orderItem.aggregate({
        where: {
            product: { vendorId },
            order: {
                status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
            }
        },
        _sum: {
            price: true,
            // Assuming price in OrderItem is unit price, otherwise it should be price * quantity.
            // But usually price is recorded as (unit_price * quantity) at the time of order.
            // Let's assume standard price * quantity if quantity is available.
        }
    });

    // Actually, sum(price * quantity) is better. Since aggregate doesn't support multiplication, 
    // we'll fetch items and sum them manually.
    const revenueItems = await prisma.orderItem.findMany({
        where: {
            product: { vendorId },
            order: {
                status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
            }
        }
    });

    const totalRevenue = revenueItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 2. Pending Orders Count
    const pendingOrdersCount = await prisma.orderItem.count({
        where: {
            product: { vendorId },
            order: { status: 'PENDING' }
        }
    });

    // 3. Recent Transactions for this Vendor
    const recentOrders = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    product: { vendorId }
                }
            }
        },
        include: {
            user: { select: { name: true, email: true } },
            items: {
                where: {
                    product: { vendorId }
                },
                include: {
                    product: { select: { name: true, images: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    // 4. Monthly Revenue for Chart
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthlySales = Array(12).fill(0);

    const yearOrders = await prisma.orderItem.findMany({
        where: {
            product: { vendorId },
            order: {
                status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
                createdAt: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`)
                }
            }
        },
        include: {
            order: { select: { createdAt: true } }
        }
    });

    yearOrders.forEach(item => {
        const month = new Date(item.order.createdAt).getMonth();
        monthlySales[month] += item.price * item.quantity;
    });

    const maxRevenue = Math.max(...monthlySales, 1);
    const normalizedSales = monthlySales.map(val => (val / maxRevenue) * 100);

    const stats = [
        { label: "Active Products", value: vendor._count.products, icon: Package, color: "text-blue-400", href: "/vendor/products" },
        { label: "Pending Orders", value: pendingOrdersCount, icon: ShoppingBag, color: "text-brand-gold", href: "/vendor/orders" },
        { label: "Total Revenue", value: totalRevenue, icon: CreditCard, color: "text-brand-accent", isPrice: true, href: "/vendor/withdrawals" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Vendor Portal</h1>
                    <p className="text-gray-400">Welcome back, <span className="text-brand-accent font-medium">{vendor.storeName}</span>.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Link href="/vendor/products/new" className="btn-primary flex items-center justify-center gap-2 px-6 flex-1 md:flex-none">
                        <Package className="h-4 w-4" />
                        <span>List New Product</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat: any) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="card-luxury p-6 relative overflow-hidden group hover:border-brand-accent/50 transition-all"
                    >
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white">
                                    {stat.isPrice ? formatPrice(stat.value) : stat.value}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-luxury bg-white/5 ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="h-24 w-24" />
                        </div>
                        <div className="mt-4 flex items-center text-[10px] text-brand-accent font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            View details <ArrowUpRight className="ml-1 h-3 w-3" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="xl:col-span-2 card-luxury p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <TrendingUp className="text-brand-accent h-5 w-5" />
                            Revenue Statistics ({currentYear})
                        </h3>
                    </div>
                    <div className="h-64 flex items-end gap-3 px-4">
                        {normalizedSales.map((height, i) => (
                            <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                                <div
                                    className="w-full bg-brand-accent/20 group-hover:bg-brand-accent transition-all rounded-t-sm"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                        {formatPrice(monthlySales[i])}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] text-gray-500 font-mono uppercase tracking-widest px-2">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
                    </div>
                </div>

                {/* Performance Badge / Ranking */}
                <div className="card-luxury p-8 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6">Store Performance</h3>
                    <div className="flex-1 space-y-8">
                        <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-brand-gold flex items-center justify-center text-background-dark">
                                <Store className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-brand-gold font-bold uppercase">Store Rating</p>
                                <p className="text-xl font-bold text-white">4.9 / 5.0</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Order Accuracy</span>
                                    <span className="text-white font-bold">98%</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-brand-accent h-full w-[98%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Response Rate</span>
                                    <span className="text-white font-bold">85%</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-brand-gold h-full w-[85%]" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-auto border-t border-white/5">
                            <Link href="/vendor/profile" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 group transition-colors">
                                Edit store profile <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="card-luxury overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-xl font-bold text-white">Recent Store Activity</h3>
                    <Link href="/vendor/orders" className="text-xs text-brand-accent hover:underline font-bold uppercase tracking-widest">
                        View All Orders
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Items</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Store Revenue</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentOrders.map((order) => {
                                const vendorTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                                return (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <span className="text-white font-mono text-xs">{order.id}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white text-sm font-medium">{order.user.name}</div>
                                            <div className="text-[10px] text-gray-500">{order.user.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background-dark overflow-hidden bg-white/5 relative">
                                                        <Image src={item.product.images[0] || "/placeholder.png"} alt={item.product.name} fill className="object-cover" />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-white/10 flex items-center justify-center text-[10px] text-gray-400">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-brand-accent font-bold">{formatPrice(vendorTotal)}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                                                order.status === 'PAID' ? 'bg-blue-500/10 text-blue-500' :
                                                    order.status === 'PENDING' ? 'bg-brand-gold/10 text-brand-gold' :
                                                        'bg-white/5 text-gray-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500 font-mono">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {recentOrders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No orders recorded for your store yet.
                    </div>
                )}
            </div>
        </div>
    );
}

