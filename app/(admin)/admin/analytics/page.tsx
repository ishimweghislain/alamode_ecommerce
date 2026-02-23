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
                        {[30, 45, 25, 60, 40, 55, 80, 70, 90, 65, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-brand-accent/20 hover:bg-brand-accent transition-all rounded-t-luxury" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-mono">
                        <span>JAN</span>
                        <span>JUN</span>
                        <span>DEC</span>
                    </div>
                </div>

                <div className="card-luxury p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white">Category Distribution</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Fashion', value: 45, color: 'bg-brand-accent' },
                            { name: 'Technology', value: 30, color: 'bg-blue-500' },
                            { name: 'Home Decor', value: 15, color: 'bg-brand-gold' },
                            { name: 'Accessories', value: 10, color: 'bg-purple-500' },
                        ].map((cat) => (
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
