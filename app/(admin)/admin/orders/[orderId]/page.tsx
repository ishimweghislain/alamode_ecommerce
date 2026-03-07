import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
    ChevronLeft, Truck, Package, MapPin,
    Smartphone, CreditCard, User,
    CheckCircle2, AlertTriangle, Clock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import UpdateOrderStatus from "@/components/vendor/UpdateOrderStatus";

interface AdminOrderPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function AdminOrderDetailsPage({ params }: AdminOrderPageProps) {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            items: {
                include: {
                    product: {
                        include: {
                            vendor: true
                        }
                    }
                }
            }
        }
    });

    if (!order) return notFound();

    const productSum = order.totalAmount - (order.deliveryFee || 0);
    const commissionTotal = productSum * 0.07;
    const vendorProductShare = productSum * 0.93;
    const deliveryTotal = order.deliveryFee || 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all ring-1 ring-white/10">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white">Universal Fulfillment</h1>
                    <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em] mt-1">Acquisition Audit #{order.id.slice(-8).toUpperCase()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Logistics Flow */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="card-luxury p-0 overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white uppercase tracking-widest text-[10px]">Ecosystem Itemization</h3>
                            <span className="text-[10px] font-mono text-gray-500 uppercase">{order.items.length} Distinct Products</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-white/[0.01] transition-all">
                                    <div className="h-20 w-20 relative rounded-xl overflow-hidden bg-brand-dark border border-white/5">
                                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-white font-bold">{item.product.name}</h4>
                                                <p className="text-[10px] text-brand-accent font-bold uppercase tracking-widest mt-1">Vendor: {item.product.vendor.storeName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold">{formatPrice(item.price * item.quantity)}</p>
                                                <p className="text-[10px] text-gray-500 font-mono">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card-luxury p-6 bg-brand-accent/5 border border-brand-accent/20">
                            <div className="flex items-center gap-3 mb-4">
                                <Truck className="h-5 w-5 text-brand-accent" />
                                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Global Logistics</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Destination</p>
                                        <p className="text-sm text-gray-300 mt-0.5">{order.shippingAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Smartphone className="h-4 w-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Receiver Signal</p>
                                        <p className="text-sm text-gray-300 mt-0.5">{order.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-luxury p-8 flex flex-col justify-center items-center text-center space-y-6 group border-dashed border-white/10 ring-1 ring-white/5">
                            <div className="h-16 w-16 rounded-full bg-brand-gold/5 flex items-center justify-center text-brand-gold transition-all ring-1 ring-brand-gold/10 group-hover:scale-105 group-hover:bg-brand-gold/10">
                                <Package className="h-8 w-8" />
                            </div>
                            <div className="max-w-xs">
                                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Verify Acquisition</h4>
                                <p className="text-gray-500 text-[10px] mt-2 leading-relaxed">Seal the transaction as fulfilled across the entire Alamode ecosystem.</p>
                            </div>
                            <UpdateOrderStatus orderId={order.id} currentStatus={order.status} role="ADMIN" />
                        </div>
                    </div>
                </div>

                {/* Financial Ledger */}
                <div className="space-y-6">
                    <div className="card-luxury p-8">
                        <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">Financial Ledger</h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Gross Acquisition</span>
                                <span className="text-white font-bold text-xl">{formatPrice(order.totalAmount)}</span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.03] space-y-4 border border-white/5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">System Revenue (7% of Item)</span>
                                    <span className="text-brand-accent font-black tracking-widest">+{formatPrice(commissionTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Vendor Product Share (93%)</span>
                                    <span className="text-brand-gold font-bold">-{formatPrice(vendorProductShare)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs border-t border-white/5 pt-4">
                                    <span className="text-gray-500">Delivery Fee (To Vendor)</span>
                                    <span className="text-white font-bold">-{formatPrice(deliveryTotal)}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-3 border-t border-white/5">
                                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none">Status</p>
                                    <p className="text-lg font-bold text-white mt-1 uppercase">{order.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-brand-gold font-bold text-xl">
                                {order.user.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-bold">{order.user.name}</p>
                                <p className="text-[10px] text-gray-500 font-mono">{order.user.email}</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-xl">
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Security Protocol</span>
                                <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">{order.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
