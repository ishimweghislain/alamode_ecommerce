import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, Eye, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorOrdersPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) return <div>Store not found.</div>;

    // In a real app, you would filter orders by products belonging to the vendor
    // For this implementation, we show relevant marketplace orders or mock for UI
    const orders = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    product: {
                        vendorId: vendor.id
                    }
                }
            }
        },
        include: {
            user: { select: { name: true } },
            items: {
                where: {
                    product: {
                        vendorId: vendor.id
                    }
                },
                include: { product: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Customer Orders</h1>
                <p className="text-gray-400">Track and fulfill purchases for your products.</p>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">Order ID</th>
                            <th className="p-4 font-bold text-gray-300">Customer</th>
                            <th className="p-4 font-bold text-gray-300">My Items</th>
                            <th className="p-4 font-bold text-gray-300">Subtotal</th>
                            <th className="p-4 font-bold text-gray-300">Status</th>
                            <th className="p-4 font-bold text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map((order: any) => {
                            const vendorSubtotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                            return (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-xs text-brand-accent">
                                        #{order.id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="p-4 text-sm text-white">
                                        {order.user.name}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex -space-x-2">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="h-8 w-8 rounded bg-white/10 border border-background-dark flex items-center justify-center overflow-hidden" title={item.product.name}>
                                                    <img src={item.product.images[0]} alt={item.product.name} className="object-cover h-full w-full" />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-white">
                                        {formatPrice(vendorSubtotal)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'PAID' ? 'bg-brand-accent/10 text-brand-accent' :
                                                order.status === 'PENDING' ? 'bg-brand-gold/10 text-brand-gold' :
                                                    'bg-gray-500/10 text-gray-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors" title="View Order Details">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-brand-accent rounded transition-colors" title="Update Shipping">
                                                <Truck className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No orders containing your products yet.
                    </div>
                )}
            </div>
        </div>
    );
}
