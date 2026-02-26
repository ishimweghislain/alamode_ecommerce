import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { BarChart3, TrendingUp, Users, ShoppingBag, ArrowUpRight, DollarSign } from "lucide-react";

export default async function AdminAnalyticsPage() {
    // Aggregations
    const totalRevenue = await prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { totalAmount: true }
    });

    const categoriesCount = await prisma.category.count();
    const vendorsCount = await prisma.vendor.count();
    const ordersCount = await prisma.order.count();

    const stats = [
        { label: "Total Gross Volume", value: totalRevenue._sum.totalAmount || 0, icon: DollarSign, isPrice: true, color: "text-brand-accent" },
        { label: "Marketplace Orders", value: ordersCount, icon: ShoppingBag, color: "text-blue-400" },
        { label: "Active Vendors", value: vendorsCount, icon: Users, color: "text-brand-gold" },
        { label: "Categories", value: categoriesCount, icon: BarChart3, color: "text-purple-400" },
    ];

    // Real Revenue Growth (Last 12 months)
    const now = new Date();
    const monthlyRevenue = await Promise.all(
        Array.from({ length: 12 }).map(async (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
            const nextDate = new Date(now.getFullYear(), now.getMonth() - (10 - i), 1);
            const result = await prisma.order.aggregate({
                where: {
                    status: 'PAID',
                    createdAt: { gte: date, lt: nextDate }
                },
                _sum: { totalAmount: true }
            });
            return result._sum.totalAmount || 0;
        })
    );

    const maxMonthly = Math.max(...monthlyRevenue, 1);
    const chartHeights = monthlyRevenue.map(val => (val / maxMonthly) * 100);

    // Real Category Distribution
    const categoriesWithProducts = await prisma.category.findMany({
        include: { _count: { select: { products: true } } }
    });
    const totalProducts = categoriesWithProducts.reduce((acc, cat) => acc + cat._count.products, 0) || 1;
    const categoryDist = categoriesWithProducts.map(cat => ({
        name: cat.name,
        value: Math.round((cat._count.products / totalProducts) * 100),
        color: cat.name === 'Fashion' ? 'bg-brand-accent' : cat.name === 'Electronics' ? 'bg-blue-500' : 'bg-brand-gold'
    })).sort((a, b) => b.value - a.value).slice(0, 4);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Marketplace Analytics</h1>
                <p className="text-gray-400">Deep insights into ecosystem performance and trends.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat: any) => (
                    <div key={stat.label} className="card-luxury p-6 flex flex-col justify-between h-32 relative overflow-hidden">
                        <div className="flex justify-between items-start relative z-10">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-white relative z-10">
                            {stat.isPrice ? formatPrice(stat.value) : stat.value}
                        </h3>
                        <div className="absolute -right-2 -bottom-2 opacity-[0.02] rotate-12">
                            <stat.icon className="h-20 w-20" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-luxury p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white">Revenue Growth</h3>
                        <div className="flex items-center gap-2 text-brand-accent text-sm font-bold">
                            <ArrowUpRight className="h-4 w-4" />
                            +12.5% vs last month
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-3 px-2">
                        {chartHeights.map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-brand-accent/20 hover:bg-brand-accent transition-all rounded-t-luxury group relative"
                                style={{ height: `${h}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {formatPrice(monthlyRevenue[i])}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-mono">
                        <span>{new Date(now.getFullYear(), now.getMonth() - 11, 1).toLocaleString('en-US', { month: 'short' })}</span>
                        <span>{new Date(now.getFullYear(), now.getMonth() - 5, 1).toLocaleString('en-US', { month: 'short' })}</span>
                        <span>{now.toLocaleString('en-US', { month: 'short' })}</span>
                    </div>
                </div>

                <div className="card-luxury p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white">Category Distribution</h3>
                    </div>
                    <div className="space-y-6">
                        {categoryDist.map((cat: any) => (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-gray-400">{cat.name}</span>
                                    <span className="text-white">{cat.value}%</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className={`${cat.color} h-full`} style={{ width: `${cat.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
