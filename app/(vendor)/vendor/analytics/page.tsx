import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { BarChart3, TrendingUp, Package, CreditCard, ArrowUpRight, Search } from "lucide-react";

export default async function VendorAnalyticsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) return <div>Store not found.</div>;
    const vendorId = vendor.id;

    // Real Analytics Calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Monthly Revenue Trend (Last 6 Months)
    const monthlyRevenue = await Promise.all(
        Array.from({ length: 6 }).map(async (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            const nextDate = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);

            const items = await prisma.orderItem.findMany({
                where: {
                    product: { vendorId },
                    order: {
                        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
                        createdAt: { gte: date, lt: nextDate }
                    }
                }
            });
            return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        })
    );

    const maxMonthly = Math.max(...monthlyRevenue, 1);
    const chartHeights = monthlyRevenue.map(val => (val / maxMonthly) * 100);

    // 2. Average Order Value
    const vendorOrders = await prisma.orderItem.findMany({
        where: {
            product: { vendorId },
            order: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } }
        },
        select: { price: true, quantity: true }
    });

    const totalRevenue = vendorOrders.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const avgOrderValue = vendorOrders.length > 0 ? totalRevenue / vendorOrders.length : 0;

    // 3. Top Products
    const topProducts = await prisma.product.findMany({
        where: { vendorId },
        include: {
            _count: {
                select: { orderItems: { where: { order: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } } } } }
            }
        },
        orderBy: {
            orderItems: { _count: 'desc' }
        },
        take: 3
    });

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">My Growth Analytics</h1>
                    <p className="text-gray-400">Detailed breakdown of store sales and product performance.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-luxury border border-white/10">
                    <button className="px-4 py-2 text-xs font-bold text-white bg-brand-accent rounded-luxury transition-all">Report</button>
                    <button className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-all">Historical</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-luxury p-8">
                    <h3 className="text-xl font-bold text-white mb-8">Revenue Trend (Last 6 Months)</h3>
                    <div className="h-64 flex items-end gap-3 px-2">
                        {monthlyRevenue.map((val, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-brand-accent/20 hover:bg-brand-accent transition-all rounded-t-luxury group relative"
                                style={{ height: `${chartHeights[i]}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {formatPrice(val)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] text-gray-500 font-mono uppercase tracking-widest px-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <span key={i}>
                                {new Date(now.getFullYear(), now.getMonth() - (5 - i), 1).toLocaleString('en-US', { month: 'short' })}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="card-luxury p-6">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Store Sales</p>
                        <h3 className="text-3xl font-bold text-white">
                            {formatPrice(totalRevenue)}
                        </h3>
                    </div>

                    <div className="card-luxury p-6">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Average Order Value</p>
                        <h3 className="text-2xl font-bold text-white italic">
                            {formatPrice(avgOrderValue)}
                        </h3>
                    </div>

                    <div className="card-luxury p-6 bg-brand-gold/5 border-brand-gold/20">
                        <h4 className="text-brand-gold font-bold text-sm mb-2">Luxury Performance Insight</h4>
                        <p className="text-xs text-brand-gold/80 leading-relaxed italic">
                            High-value customers are currently looking for limited edition releases. Increasing your luxury inventory could boost your average order value further.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card-luxury p-8">
                <h3 className="text-xl font-bold text-white mb-6">Top Performing Products</h3>
                <div className="space-y-4">
                    {topProducts.length > 0 ? topProducts.map((product, i) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-luxury">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-brand-accent/10 rounded-luxury flex items-center justify-center font-bold text-brand-accent">#{i + 1}</div>
                                <div>
                                    <p className="text-white font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-gray-400">{product._count.orderItems} Sales Recorded</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold">{formatPrice(product.price)}</p>
                                <p className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">Active Status</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center py-6 text-sm">No sales data recorded for your products yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
