import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Store, Package, CreditCard, TrendingUp, AlertTriangle, DollarSign, ShoppingBag, ArrowUpRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

// --- Sub-components for Streaming ---

async function AlertsSection() {
    const [pendingVendors, pendingWithdrawals] = await Promise.all([
        prisma.vendor.count({ where: { isApproved: false } }).catch(() => 0),
        prisma.withdrawalRequest.count({ where: { status: 'PENDING' } }).catch(() => 0)
    ]);

    return (
        <div className="space-y-4">
            {pendingVendors > 0 && (
                <Link href="/admin/vendors?status=pending" className="block transform hover:scale-[1.01] transition-all">
                    <div className="bg-brand-gold/10 border border-brand-gold/20 p-5 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-brand-gold/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="text-brand-gold h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-brand-gold font-bold">Pending Approvals</p>
                                <p className="text-sm text-brand-gold/70">You have {pendingVendors} vendor waiting for verification.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-brand-gold font-bold text-sm">REVIEW NOW <ArrowUpRight className="h-4 w-4" /></div>
                    </div>
                </Link>
            )}
            {pendingWithdrawals > 0 && (
                <Link href="/admin/withdrawals" className="block transform hover:scale-[1.01] transition-all">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <DollarSign className="text-blue-400 h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-blue-400 font-bold">Pending Withdrawals</p>
                                <p className="text-sm text-blue-400/70">You have {pendingWithdrawals} payout request waiting for approval.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">PROCESS NOW <ArrowUpRight className="h-4 w-4" /></div>
                    </div>
                </Link>
            )}
        </div>
    );
}

async function MainStatsGrid() {
    const [users, vendors, products, orders] = await Promise.all([
        prisma.user.count().catch(() => 0),
        prisma.vendor.count().catch(() => 0),
        prisma.product.count().catch(() => 0),
        prisma.order.count().catch(() => 0)
    ]);

    const stats = [
        { label: "Total Users", value: users, icon: Users, color: "text-blue-400", href: "/admin/users" },
        { label: "Total Vendors", value: vendors, icon: Store, color: "text-brand-accent", href: "/admin/vendors" },
        { label: "Total Products", value: products, icon: Package, color: "text-brand-gold", href: "/admin/products" },
        { label: "Total Orders", value: orders, icon: CreditCard, color: "text-purple-400", href: "/admin/orders" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <Link key={stat.label} href={stat.href} className="card-luxury p-6 flex items-center gap-6 hover:border-brand-accent/50 transition-all group">
                    <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon className="h-6 w-6" /></div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white uppercase">{stat.value}</h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}

async function RevenueStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, daily, monthly] = await Promise.all([
        prisma.order.aggregate({ _sum: { totalAmount: true, deliveryFee: true }, where: { status: { not: "CANCELLED" } } }),
        prisma.order.aggregate({ _sum: { totalAmount: true, deliveryFee: true }, where: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } } }),
        prisma.order.aggregate({ _sum: { totalAmount: true, deliveryFee: true }, where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } } })
    ]);

    const revStats = [
        { label: "Total System Revenue (7%)", value: formatPrice(((total._sum.totalAmount || 0) - (total._sum.deliveryFee || 0)) * 0.07), icon: DollarSign, color: "text-green-400" },
        { label: "Daily System Commission", value: formatPrice(((daily._sum.totalAmount || 0) - (daily._sum.deliveryFee || 0)) * 0.07), icon: TrendingUp, color: "text-brand-accent" },
        { label: "Monthly System Commission", value: formatPrice(((monthly._sum.totalAmount || 0) - (monthly._sum.deliveryFee || 0)) * 0.07), icon: ShoppingBag, color: "text-brand-gold" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {revStats.map((stat) => (
                <div key={stat.label} className="card-luxury p-6 flex flex-col gap-4 border-l-4 border-l-brand-accent group">
                    <div className={`p-3 rounded-xl bg-white/5 w-fit ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}

async function RecentActivity() {
    const [recentOrders, topProducts] = await Promise.all([
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        }),
        prisma.product.findMany({
            take: 5,
            orderBy: { orderItems: { _count: 'desc' } },
            select: { name: true, price: true, _count: { select: { orderItems: true } } }
        })
    ]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-luxury p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white text-lg">Recent Transactions</h3>
                    <Link href="/admin/orders" className="text-xs text-brand-accent font-bold hover:underline">VIEW ALL</Link>
                </div>
                <div className="space-y-4">
                    {recentOrders.map((order: any) => (
                        <div key={order.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div>
                                <p className="text-sm font-bold text-white">{order.user?.name || order.user?.email || 'Anonymous'}</p>
                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-brand-gold">{formatPrice(order.totalAmount)}</p>
                                <p className={`text-[10px] font-bold uppercase ${order.status === 'PAID' ? 'text-green-400' : 'text-brand-accent'}`}>{order.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="card-luxury p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white text-lg">Top Performing Products</h3>
                    <Link href="/admin/products" className="text-xs text-brand-accent font-bold hover:underline">VIEW CATALOG</Link>
                </div>
                <div className="space-y-4">
                    {topProducts.map((product: any) => (
                        <div key={product.name} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-brand-accent/20 flex items-center justify-center font-bold text-brand-accent text-xs">P</div>
                                <p className="text-sm font-medium text-white truncate max-w-[150px]">{product.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">{product._count.orderItems} Sales</p>
                                <p className="text-xs text-gray-500">{formatPrice(product.price)} avg</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- Dashboard Shell ---

export default async function AdminDashboard() {
    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Admin Portal Center</h1>
                <p className="text-gray-400">Manage and monitor the ALAMODE ecosystem with real-time analytics.</p>
            </div>

            <Suspense fallback={null}>
                <AlertsSection />
            </Suspense>

            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)}</div>}>
                <MainStatsGrid />
            </Suspense>

            <Suspense fallback={<div className="flex items-center gap-3 text-brand-accent/50 py-10 font-black uppercase tracking-widest"><Loader2 className="animate-spin h-5 w-5" /> Syncing Revenue Data...</div>}>
                <RevenueStats />
            </Suspense>

            <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">{[1, 2].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)}</div>}>
                <RecentActivity />
            </Suspense>
        </div>
    );
}