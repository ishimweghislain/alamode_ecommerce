import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, MapPin, Smartphone, CreditCard, ChevronLeft, Truck, CheckCircle2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import UpdateOrderStatus from "@/components/vendor/UpdateOrderStatus";

interface OrderPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function VendorOrderDetailsPage({ params }: OrderPageProps) {
    const { orderId } = await params;
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) return notFound();

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            items: {
                where: {
                    product: { vendorId: vendor.id }
                },
                include: { product: true }
            }
        }
    });

    if (!order || order.items.length === 0) return notFound();

    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vendorNet = subtotal * 0.95;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/vendor/orders" className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white">Order Details</h1>
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-1">Transaction #{order.id.slice(-8).toUpperCase()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-luxury p-0 overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Fulfillment List</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
                                    <div className="h-24 w-24 relative rounded-2xl overflow-hidden bg-brand-dark border border-white/5 ring-1 ring-white/10 group-hover:ring-brand-accent/30 transition-all">
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-lg mb-1">{item.product.name}</h4>
                                        <p className="text-sm text-gray-500 font-mono mb-4 uppercase tracking-tighter">SKU: {item.product.id.slice(0, 8)}</p>
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Unit Price</p>
                                                <p className="text-white font-bold">{formatPrice(item.price)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Quantity</p>
                                                <p className="text-white font-bold">x{item.quantity}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-brand-accent uppercase font-black tracking-widest mb-1">Total</p>
                                                <p className="text-brand-accent font-bold">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-luxury p-8 flex flex-col items-center justify-center space-y-6 border-dashed border-white/10">
                        <div className="h-16 w-16 rounded-full bg-brand-accent/5 flex items-center justify-center ring-1 ring-brand-accent/20">
                            <Package className="h-8 w-8 text-brand-accent animate-pulse" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-white font-bold text-lg">Logistics Management</h4>
                            <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">Update the fulfillment status to notify the customer of their luxury acquisition's progress.</p>
                        </div>
                        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} role="VENDOR" />
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="space-y-6">
                    <div className="card-luxury p-6 space-y-6">
                        <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">Status</p>
                                <p className="text-xl font-bold text-white mt-1">{order.status}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Order Subtotal</span>
                                <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium tracking-tighter">Marketplace Comm. (5%)</span>
                                <span className="text-red-400 font-bold">-{formatPrice(subtotal * 0.05)}</span>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Your Final Net</span>
                                <span className="text-2xl font-black text-brand-accent">{formatPrice(vendorNet)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6 space-y-6">
                        <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">Client Intelligence</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold font-bold">
                                    {order.user.name?.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-bold truncate">{order.user.name}</p>
                                    <p className="text-[10px] text-gray-500 font-mono truncate">{order.user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-4 w-4 text-brand-accent mt-1" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Shipping Sanctuary</p>
                                        <p className="text-sm text-gray-300 font-medium">{order.shippingAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Smartphone className="h-4 w-4 text-brand-accent mt-1" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Direct Contact</p>
                                        <p className="text-sm text-gray-300 font-bold font-mono">{order.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    {order.paymentMethod === 'CARD' ? (
                                        <CreditCard className="h-4 w-4 text-blue-400 mt-1" />
                                    ) : (
                                        <Smartphone className="h-4 w-4 text-brand-gold mt-1" />
                                    )}
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Secured VIA</p>
                                        <p className="text-sm text-gray-300 font-bold">{order.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
