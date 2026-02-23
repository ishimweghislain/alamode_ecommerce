import { prisma } from "@/lib/prisma";
import { Users, Store, Package, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
    const [userCount, vendorCount, productCount, orderCount, pendingVendors] = await Promise.all([
        prisma.user.count(),
        prisma.vendor.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.vendor.count({ where: { isApproved: false } }),
    ]);

    const stats = [
        { label: "Total Users", value: userCount, icon: Users, color: "text-blue-400" },
        { label: "Total Vendors", value: vendorCount, icon: Store, color: "text-brand-accent" },
        { label: "Total Products", value: productCount, icon: Package, color: "text-brand-gold" },
        { label: "Total Orders", value: orderCount, icon: CreditCard, color: "text-purple-400" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Admin Command Center</h1>
                <p className="text-gray-400">Overview of the ALAMODE ecosystem.</p>
            </div>

            {pendingVendors > 0 && (
                <div className="bg-brand-gold/10 border border-brand-gold/20 p-4 rounded-luxury flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-brand-gold h-5 w-5" />
                        <p className="text-sm text-brand-gold font-medium">
                            You have {pendingVendors} pending vendor approvals.
                        </p>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:underline">
                        Review Now
                    </button>
                </div>
            )}

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-luxury p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg">System Health</h3>
                        <span className="text-xs text-brand-accent font-bold uppercase tracking-wider">Operational</span>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>Database Status</span>
                            <span className="text-green-400">Connected</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>NextAuth Session Strategy</span>
                            <span className="text-brand-accent font-mono text-xs">JWT</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Prisma Client</span>
                            <span className="text-brand-accent font-mono text-xs">Initialized</span>
                        </div>
                    </div>
                </div>

                <div className="card-luxury p-6 flex flex-col justify-center items-center text-center">
                    <div className="p-4 rounded-full bg-brand-accent/10 mb-4 font-bold text-brand-accent">
                        <TrendingUp />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">Marketplace Growth</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Analytics are being compiled. Check back in 24 hours for detailed traffic and sales reports.
                    </p>
                    <button className="btn-primary w-full max-w-[200px] text-sm py-2">
                        Configure Reports
                    </button>
                </div>
            </div>
        </div>
    );
}
