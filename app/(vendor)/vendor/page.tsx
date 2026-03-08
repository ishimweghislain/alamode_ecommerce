import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, CreditCard, TrendingUp, ArrowUpRight, Store, Clock, CheckCircle, Truck, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

// --- Sub-components for Streaming with Error Boundaries ---

async function VendorStatsGrid({ vendorId, productCount }: { vendorId: string, productCount: number }) {
    try {
        const [revenueItems, pendingOrdersCount] = await Promise.all([
            prisma.orderItem.findMany({
                where: {
                    product: { vendorId },
                    order: { status: { in: ['SHIPPED', 'DELIVERED'] } }
                }
            }).catch(() => []),
            prisma.orderItem.count({
                where: {
                    product: { vendorId },
                    order: { status: 'PENDING' }
                }
            }).catch(() => 0)
        ]);

        const totalRevenue = revenueItems.reduce((acc, item) => acc + (item.price * item.quantity * 0.95), 0);

        const stats = [
            { label: "Active Products", value: productCount, icon: Package, color: "text-blue-400", href: "/vendor/products" },
            { label: "Pending Orders", value: pendingOrdersCount, icon: ShoppingBag, color: "text-brand-gold", href: "/vendor/orders" },
            { label: "Total Revenue", value: totalRevenue, icon: CreditCard, color: "text-brand-accent", isPrice: true, href: "/vendor/withdrawals" },
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat: any) => (
                    <Link key={stat.label} href={stat.href} className="card-luxury p-6 relative overflow-hidden group hover:border-brand-accent/50 transition-all text-left">
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="text-left">
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white">{stat.isPrice ? formatPrice(stat.value) : stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-luxury bg-white/5 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><stat.icon className="h-24 w-24" /></div>
                    </Link>
                ))}
            </div>
        );
    } catch (e) {
        return <div className="p-8 bg-white/5 rounded-3xl text-gray-500 text-sm">Vital stats offline.</div>;
    }
}

async function RevenueChart({ vendorId }: { vendorId: string }) {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const monthlySales = Array(12).fill(0);

        const yearOrders = await prisma.orderItem.findMany({
            where: {
                product: { vendorId },
                order: {
                    status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
                    createdAt: { gte: new Date(`${currentYear}-01-01`), lte: new Date(`${currentYear}-12-31`) }
                }
            },
            include: { order: { select: { createdAt: true } } }
        }).catch(() => []);

        yearOrders.forEach(item => {
            const month = new Date(item.order.createdAt).getMonth();
            monthlySales[month] += item.price * item.quantity;
        });

        const maxRevenue = Math.max(...monthlySales, 1);
        const normalizedSales = monthlySales.map(val => (val / maxRevenue) * 100);

        return (
            <div className="card-luxury p-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-8">
                    <TrendingUp className="text-brand-accent h-5 w-5" /> Revenue Analytics ({currentYear})
                </h3>
                <div className="h-64 flex items-end gap-3 px-4">
                    {normalizedSales.map((height, i) => (
                        <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                            <div className="w-full bg-brand-accent/20 group-hover:bg-brand-accent transition-all rounded-t-sm" style={{ height: `${height}%` }}>
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
        );
    } catch (e) {
        return <div className="p-20 bg-white/5 rounded-3xl text-gray-500 italic">Chart synchronizing...</div>;
    }
}

async function RecentActivityTable({ vendorId }: { vendorId: string }) {
    try {
        const recentOrders = await prisma.order.findMany({
            where: { items: { some: { product: { vendorId } } } },
            include: {
                user: { select: { name: true, email: true } },
                items: { where: { product: { vendorId } }, include: { product: { select: { name: true, images: true } } } }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        }).catch(() => []);

        if (recentOrders.length === 0) {
            return <div className="p-12 text-center text-gray-500">No recent store activity recorded.</div>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Store Revenue</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {recentOrders.map((order: any) => {
                            const vendorTotal = order.items.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0);
                            return (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4"><span className="text-white font-mono text-xs">{order.id.slice(-6).toUpperCase()}</span></td>
                                    <td className="p-4"><div className="text-white text-sm font-medium">{order.user?.name || "Customer"}</div></td>
                                    <td className="p-4"><span className="text-brand-accent font-bold">{formatPrice(vendorTotal)}</span></td>
                                    <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'text-green-500' : order.status === 'PENDING' ? 'text-brand-gold' : 'text-gray-400'}`}>{order.status}</span></td>
                                    <td className="p-4 text-xs text-gray-500 font-mono">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    } catch (e) {
        return <div className="p-20 text-center text-gray-500">Activity table offline.</div>;
    }
}

// --- Dashboard Shell ---

export default async function VendorDashboard() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id },
        include: { _count: { select: { products: true } } }
    });

    if (!vendor) return <div className="p-20 text-center text-gray-500">Vendor profile not found.</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Vendor Portal</h1>
                    <p className="text-gray-400">Welcome back, <span className="text-brand-accent font-medium">{vendor.storeName}</span>.</p>
                </div>
                <Link href="/vendor/products/new" className="btn-primary flex items-center justify-center gap-2 px-6">
                    <Package className="h-4 w-4" /> <span>List New Product</span>
                </Link>
            </div>

            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)}</div>}>
                <VendorStatsGrid vendorId={vendor.id} productCount={vendor._count.products} />
            </Suspense>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <Suspense fallback={<div className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse" />}>
                        <RevenueChart vendorId={vendor.id} />
                    </Suspense>
                </div>
                <div className="card-luxury p-8 flex flex-col justify-center gap-6 text-center">
                    <div className="h-16 w-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto"><Store className="h-8 w-8 text-brand-gold" /></div>
                    <div><h3 className="text-xl font-bold text-white">Store Health</h3><p className="text-gray-400 text-sm">Rating: 4.9 / 5.0</p></div>
                </div>
            </div>

            <div className="card-luxury overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                    <Link href="/vendor/orders" className="text-xs text-brand-accent font-bold uppercase tracking-widest">View All</Link>
                </div>
                <Suspense fallback={<div className="p-20 flex justify-center text-brand-accent/50"><Loader2 className="animate-spin h-6 w-6" /></div>}>
                    <RecentActivityTable vendorId={vendor.id} />
                </Suspense>
            </div>
        </div>
    );
}
