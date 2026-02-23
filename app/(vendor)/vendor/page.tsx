import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, CreditCard, TrendingUp, ArrowUpRight, Store } from "lucide-react";
import Link from "next/link";

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

    // Mock analytics for visualization
    const stats = [
        { label: "Active Products", value: vendor._count.products, icon: Package, color: "text-blue-400" },
        { label: "Pending Orders", value: 0, icon: ShoppingBag, color: "text-brand-gold" },
        { label: "Total Revenue", value: 0, icon: CreditCard, color: "text-brand-accent", isPrice: true },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Vendor Portal</h1>
                    <p className="text-gray-400">Welcome back, <span className="text-brand-accent font-medium">{vendor.storeName}</span>.</p>
                </div>
                <Link href="/vendor/products/new" className="btn-primary flex items-center gap-2 px-6">
                    <Package className="h-4 w-4" />
                    <span>List New Product</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card-luxury p-6 relative overflow-hidden group">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
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
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-luxury p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <TrendingUp className="text-brand-accent h-5 w-5" />
                        Sales Performance
                    </h3>
                    <div className="h-48 flex items-end gap-2 px-4">
                        {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 100].map((height, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-brand-accent/20 hover:bg-brand-accent transition-all rounded-t-sm"
                                style={{ height: `${height}%` }}
                                title={`Projected performance for slot ${i + 1}`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                        <span>Jan</span>
                        <span>Dec</span>
                    </div>
                </div>

                <div className="card-luxury p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Store Ranking</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your store is currently in the <span className="text-brand-gold font-bold">Top 15%</span> of vendors in Rwanda. Keep up the high level of service to unlock premium badges.
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Order Completion Rate</span>
                            <span className="text-white font-bold">98.5%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className="bg-brand-accent h-full w-[98.5%]" />
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Customer Satisfaction</span>
                            <span className="text-white font-bold">4.9/5.0</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className="bg-brand-gold h-full w-[94%]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShieldAlert({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" />
        </svg>
    )
}
