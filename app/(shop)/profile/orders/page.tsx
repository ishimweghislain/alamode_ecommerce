import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Package, MapPin, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function UserOrdersPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Order History</h1>
                <p className="text-gray-400">Track and manage your luxury acquisitions.</p>
            </div>

            <div className="space-y-6">
                {orders.map((order: any) => (
                    <div key={order.id} className="card-luxury p-0 overflow-hidden group border-white/5 hover:border-brand-accent/30 transition-all">
                        <div className="bg-white/5 p-6 flex flex-wrap justify-between items-center gap-6 border-b border-white/5">
                            <div className="flex gap-12 text-xs uppercase tracking-widest font-bold">
                                <div>
                                    <p className="text-gray-500 mb-1">Order Placed</p>
                                    <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Total Amount</p>
                                    <p className="text-brand-gold">{formatPrice(order.totalAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Status</p>
                                    <p className={order.status === 'PAID' ? 'text-brand-accent' : 'text-brand-gold'}>{order.status}</p>
                                </div>
                            </div>
                            <div className="text-xs font-mono text-gray-500">
                                ID: #{order.id.slice(-8).toUpperCase()}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-6">
                                        <div className="h-20 w-20 relative rounded overflow-hidden flex-shrink-0 bg-white/5">
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex justify-between items-start">
                                            <div>
                                                <h4 className="text-white font-medium mb-1">{item.product.name}</h4>
                                                <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                                <p className="text-xs text-brand-accent mt-2 font-bold uppercase tracking-widest">Delivered via Elite Courier</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex justify-end gap-4">
                                <Link
                                    href={`/profile/orders/${order.id}`}
                                    className="px-6 py-2 border border-white/10 rounded-luxury text-sm font-bold text-gray-300 hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    Track Acquisition
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                                <button className="btn-primary px-6 py-2 text-sm">
                                    Buy Again
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="card-luxury p-20 text-center space-y-6">
                        <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag className="h-10 w-10 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">No orders yet</h3>
                            <p className="text-gray-400 max-w-xs mx-auto mt-2">When you acquire your first masterpiece, it will appear here.</p>
                        </div>
                        <Link href="/shop" className="btn-gold inline-block px-8 py-3">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
