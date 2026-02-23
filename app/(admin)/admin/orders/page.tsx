import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Search, Filter, Eye, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: {
                select: { name: true, email: true }
            },
            _count: {
                select: { items: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Order Fulfillment</h1>
                    <p className="text-gray-400">Manage customer purchases and logistics.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            placeholder="Order ID or Customer..."
                            className="bg-white/5 border border-white/10 rounded-luxury py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">Order ID</th>
                            <th className="p-4 font-bold text-gray-300">Customer</th>
                            <th className="p-4 font-bold text-gray-300">Total</th>
                            <th className="p-4 font-bold text-gray-300">Status</th>
                            <th className="p-4 font-bold text-gray-300">Items</th>
                            <th className="p-4 font-bold text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-xs text-brand-accent">
                                    #{order.id.slice(-8).toUpperCase()}
                                </td>
                                <td className="p-4">
                                    <p className="text-white font-medium text-sm">{order.user.name}</p>
                                    <p className="text-[10px] text-gray-500">{order.user.email}</p>
                                </td>
                                <td className="p-4 font-bold text-white">
                                    {formatPrice(order.totalAmount)}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit ${order.status === 'PAID' ? 'bg-brand-accent/10 text-brand-accent' :
                                        order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500' :
                                            order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                                                order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-brand-gold/10 text-brand-gold'
                                        }`}>
                                        {order.status === 'PAID' && <CheckCircle2 className="h-3 w-3" />}
                                        {order.status === 'PENDING' && <Clock className="h-3 w-3" />}
                                        {order.status === 'CANCELLED' && <XCircle className="h-3 w-3" />}
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-400">
                                    {order._count.items}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors" title="View Details">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-brand-accent rounded transition-colors" title="Update Status">
                                            <Truck className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No orders have been placed yet.
                    </div>
                )}
            </div>
        </div>
    );
}
