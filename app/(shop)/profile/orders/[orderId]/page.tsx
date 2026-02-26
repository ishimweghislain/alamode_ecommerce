import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Package, MapPin, Truck, CheckCircle2, Clock, ShieldCheck, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { clsx } from "clsx";

interface OrderDetailsPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { orderId } = await params;
    const user = await getCurrentUser();
    if (!user) return null;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: {
                        include: { vendor: true }
                    }
                }
            }
        }
    });

    if (!order || order.userId !== user.id) {
        return notFound();
    }

    const milestones = [
        { status: 'PENDING', label: 'Order Placed', icon: Clock, desc: 'Waiting for vendor confirmation' },
        { status: 'PAID', label: 'Payment Verified', icon: ShieldCheck, desc: 'Payment has been secured' },
        { status: 'SHIPPED', label: 'In Transit', icon: Truck, desc: 'Package is being handled by Elite Courier' },
        { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Package has reached your destination' },
    ];

    const currentStatusIndex = milestones.findIndex(m => m.status === order.status);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link href="/profile/orders" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Link>
                    <h1 className="text-3xl font-outfit font-bold text-white">Order Details</h1>
                    <p className="text-gray-400 font-mono text-xs mt-1">ID: #{order.id.toUpperCase()}</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-primary px-6 py-2.5 text-xs">Download Invoice</button>
                    <Link href="/support" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-luxury text-xs text-white hover:bg-white/10 transition-all font-bold">Need Help?</Link>
                </div>
            </div>

            {/* Status Tracker */}
            <div className="card-luxury p-8 relative overflow-hidden">
                <div className="relative z-10 flex justify-between">
                    {milestones.map((milestone, idx) => {
                        const isCompleted = idx <= currentStatusIndex;
                        const isCurrent = idx === currentStatusIndex;
                        return (
                            <div key={milestone.status} className="flex flex-col items-center text-center relative flex-1">
                                {/* Line */}
                                {idx !== milestones.length - 1 && (
                                    <div className={clsx(
                                        "absolute top-5 left-1/2 w-full h-[2px] -z-10",
                                        idx < currentStatusIndex ? "bg-brand-accent" : "bg-white/10"
                                    )} />
                                )}

                                <div className={clsx(
                                    "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500",
                                    isCompleted ? "bg-brand-accent text-white shadow-[0_0_15px_rgba(255,184,0,0.3)]" : "bg-white/5 text-gray-500",
                                    isCurrent && "ring-4 ring-brand-accent/20"
                                )}>
                                    <milestone.icon className="h-5 w-5" />
                                </div>
                                <div className="mt-4">
                                    <p className={clsx(
                                        "text-xs font-bold uppercase tracking-widest",
                                        isCompleted ? "text-white" : "text-gray-600"
                                    )}>{milestone.label}</p>
                                    <p className="text-[10px] text-gray-500 mt-1 max-w-[120px] mx-auto">{milestone.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-luxury p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Package className="h-5 w-5 text-brand-accent" />
                            Acquired Items
                        </h3>
                        <div className="divide-y divide-white/5">
                            {order.items.map((item) => (
                                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-6">
                                    <div className="h-24 w-24 relative rounded-xl overflow-hidden bg-white/5 border border-white/5">
                                        <Image
                                            src={item.product.images[0] || "/placeholder.png"}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex justify-between">
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1">{item.product.name}</h4>
                                            <p className="text-sm text-gray-400">Sold by: <span className="text-brand-accent">{item.product.vendor.storeName}</span></p>
                                            <p className="text-xs text-gray-500 mt-2">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold text-lg">{formatPrice(item.price)}</p>
                                            <Link href={`/product/${item.product.id}`} className="text-xs text-brand-gold hover:underline mt-2 inline-block">View Item →</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className="space-y-8">
                    {/* Summary */}
                    <div className="card-luxury p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Payment Summary</h3>
                        <div className="space-y-4 text-sm font-medium">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-white">{formatPrice(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Elite Shipping</span>
                                <span className="text-green-500">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax (Incl.)</span>
                                <span className="text-white">{formatPrice(0)}</span>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-between">
                                <span className="text-white font-bold">Total Acquisition Value</span>
                                <span className="text-brand-gold font-bold text-xl">{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery */}
                    <div className="card-luxury p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-brand-accent" />
                            Secure Destination
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Shipping Address</p>
                                <p className="text-white text-sm leading-relaxed">{order.shippingAddress}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Contact Info</p>
                                <div className="space-y-2">
                                    <p className="text-white text-sm flex items-center gap-2"><Mail className="h-3 w-3 text-brand-accent" /> {user.email}</p>
                                    <p className="text-white text-sm flex items-center gap-2"><Phone className="h-3 w-3 text-brand-accent" /> {order.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
