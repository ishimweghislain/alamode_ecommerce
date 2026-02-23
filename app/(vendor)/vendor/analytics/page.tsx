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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">My Growth Analytics</h1>
                    <p className="text-gray-400">Detailed breakdown of store sales and product performance.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-luxury border border-white/10">
                    <button className="px-4 py-2 text-xs font-bold text-white bg-brand-accent rounded-luxury transition-all">30 Days</button>
                    <button className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-all">90 Days</button>
                    <button className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-all">All Time</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-luxury p-8">
                    <h3 className="text-xl font-bold text-white mb-8">Daily Revenue Trend</h3>
                    <div className="h-64 flex items-end gap-2">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-brand-accent/20 hover:bg-brand-accent transition-all rounded-t-sm"
                                style={{ height: `${Math.random() * 80 + 20}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[8px] text-gray-500 font-mono italic">
                        <span>30 Days Ago</span>
                        <span>Today</span>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="card-luxury p-6">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Conversion Rate</p>
                        <h3 className="text-3xl font-bold text-white flex items-center justify-between">
                            3.4%
                            <span className="text-green-500 text-sm flex items-center gap-1">
                                <ArrowUpRight className="h-4 w-4" /> 0.8%
                            </span>
                        </h3>
                    </div>

                    <div className="card-luxury p-6">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Average Order Value</p>
                        <h3 className="text-2xl font-bold text-white italic">
                            {formatPrice(85000)}
                        </h3>
                    </div>

                    <div className="card-luxury p-6 bg-brand-gold/5 border-brand-gold/20">
                        <h4 className="text-brand-gold font-bold text-sm mb-2">Growth Tip</h4>
                        <p className="text-xs text-brand-gold/80 leading-relaxed italic">
                            Products with professional images have a <span className="font-bold underline">40% higher</span> completion rate. Consider updating your "Diamond Watch" photos.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card-luxury p-8">
                <h3 className="text-xl font-bold text-white mb-6">Top Performing Products</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-luxury">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-brand-accent/10 rounded-luxury flex items-center justify-center font-bold text-brand-accent">#{i}</div>
                                <div>
                                    <p className="text-white font-medium text-sm">Sample Product Name {i}</p>
                                    <p className="text-xs text-gray-400">42 Sales this month</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold">{formatPrice(150000 * (4 - i))}</p>
                                <p className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">Growth +{15 - i}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
