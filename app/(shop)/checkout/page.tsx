"use client";

import { useCart } from "@/components/CartProvider";
import { formatPrice, cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MapPin, Phone, CreditCard, Smartphone, CheckCircle2, ShieldCheck, ArrowLeft, Loader2, AlertCircle, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { RWANDA_DISTRICTS } from "@/lib/constants";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("MOMO");
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [isCalculatingFee, setIsCalculatingFee] = useState(false);

    const { data: session } = useSession();

    const [formData, setFormData] = useState({
        shippingAddress: "",
        phone: "",
        district: "",
    });

    useEffect(() => {
        if (session?.user) {
            const user = session.user as any;
            setFormData(prev => ({
                ...prev,
                shippingAddress: user.address || prev.shippingAddress,
                phone: user.phoneNumber || prev.phone,
            }));
        }
    }, [session]);

    // Calculate delivery fee when district changes
    useEffect(() => {
        if (formData.district && items.length > 0) {
            const calculateFee = async () => {
                setIsCalculatingFee(true);
                try {
                    const { data } = await axios.post("/api/checkout/calculate-delivery", {
                        district: formData.district,
                        items
                    });
                    setDeliveryFee(data.fee);
                } catch (error) {
                    console.error("Fee calculation error:", error);
                    toast.error("Could not calculate delivery fee");
                } finally {
                    setIsCalculatingFee(false);
                }
            };
            calculateFee();
        } else {
            setDeliveryFee(0);
        }
    }, [formData.district, items]);

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <AlertCircle className="h-16 w-16 text-gray-600 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
                <Link href="/shop" className="btn-gold px-8 py-3">Start Shopping</Link>
            </div>
        );
    }

    const serviceFee = (total + deliveryFee) * 0.07;
    const finalTotal = total + serviceFee + deliveryFee;

    const validatePhone = (phone: string) => {
        const rwandaPhoneRegex = /^(07[2389])\d{7}$/;
        return rwandaPhoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePhone(formData.phone)) {
            toast.error("Please enter a valid Rwandan phone number (e.g., 078 XXX XXXX)");
            return;
        }

        if (!formData.district) {
            toast.error("Please select a delivery district");
            return;
        }

        setIsLoading(true);

        try {
            const orderPayload = {
                items: items.map(item => ({
                    id: item.id,
                    productId: item.productId || item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size
                })),
                shippingAddress: formData.shippingAddress,
                district: formData.district,
                phone: formData.phone.replace(/\s/g, ''),
                paymentMethod: paymentMethod,
                totalAmount: finalTotal,
                deliveryFee: deliveryFee
            };

            if (paymentMethod === "CARD") {
                const response = await axios.post("/api/checkout", orderPayload);
                window.location = response.data.url;
                return;
            }

            const response = await axios.post("/api/orders", orderPayload);

            if (response.status === 200) {
                toast.success("Payment successful! Order processed.");
                clearCart();
                router.push("/profile/payments");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data || "Failed to place order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <div className="mb-12 flex items-center gap-4">
                <Link href="/cart" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                    <ArrowLeft className="h-6 w-6 text-gray-400 group-hover:text-white" />
                </Link>
                <div>
                    <h1 className="text-4xl font-outfit font-bold text-white uppercase tracking-tighter">Checkout</h1>
                    <p className="text-gray-400 text-sm">Secure your exclusive order with ease.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Information */}
                    <section className="card-luxury p-10 space-y-8">
                        <h2 className="text-2xl font-outfit font-bold text-white flex items-center gap-3">
                            <MapPin className="h-6 w-6 text-brand-accent animate-pulse" />
                            Shipping Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contact Number (Rwanda)</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-brand-accent transition-colors" />
                                    <input
                                        required
                                        className="input-luxury w-full py-4 pl-12"
                                        placeholder="078 XXX XXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 italic">Formatting example: 0788123456</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Delivery District</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-brand-accent transition-colors z-10" />
                                    <select
                                        required
                                        className="input-luxury w-full py-4 pl-12 appearance-none relative z-0"
                                        value={formData.district}
                                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    >
                                        <option value="" disabled className="bg-background-dark text-gray-400">Select a District</option>
                                        {RWANDA_DISTRICTS.map(district => (
                                            <option key={district} value={district} className="bg-background-dark text-white">
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Shipping Address</label>
                            <textarea
                                required
                                rows={3}
                                className="input-luxury w-full py-5 px-6 leading-relaxed"
                                placeholder="Street name, Building number, Apartment, etc."
                                value={formData.shippingAddress}
                                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                            />
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="card-luxury p-10 space-y-8">
                        <h2 className="text-2xl font-outfit font-bold text-white flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-brand-gold" />
                            Payment Method
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: "MOMO", label: "Mobile Money", icon: Smartphone, color: "text-brand-gold" },
                                { id: "CARD", label: "Visa / Mastercard", icon: CreditCard, color: "text-blue-400" },
                            ].map((method: any) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all relative overflow-hidden group ${paymentMethod === method.id
                                        ? "bg-brand-accent/10 border-brand-accent shadow-[0_0_30px_rgba(255,184,76,0.15)]"
                                        : "bg-white/5 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20"
                                        }`}
                                >
                                    {paymentMethod === method.id && (
                                        <div className="absolute top-4 right-4 bg-brand-accent text-black p-1 rounded-full shadow-lg">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "h-16 w-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110",
                                        paymentMethod === method.id ? "bg-brand-accent/20" : "bg-white/5"
                                    )}>
                                        <method.icon className={cn("h-8 w-8", paymentMethod === method.id ? 'text-brand-accent' : method.color)} />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-black uppercase tracking-[0.2em]",
                                        paymentMethod === method.id ? 'text-white' : 'text-gray-400'
                                    )}>
                                        {method.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-sm text-gray-400 leading-relaxed italic flex gap-4 items-start shadow-inner">
                            <Info className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                            <p>
                                {paymentMethod === "MOMO" && "Standard MOMO procedure: You will see a push notification on your phone asking for your PIN to complete the transaction."}
                                {paymentMethod === "CARD" && "Encrypted payment portal. We never see or store your sensitive card information. Secure connection active."}
                            </p>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <div className="card-luxury p-10 sticky top-32 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-brand-accent/20">
                        <h2 className="text-2xl font-outfit font-bold text-white mb-8">Summary</h2>

                        <div className="space-y-6 mb-10">
                            <div className="max-h-60 overflow-y-auto pr-4 space-y-4 no-scrollbar">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm group">
                                        <div className="flex-1 pr-4">
                                            <p className="text-white font-bold group-hover:text-brand-accent transition-colors line-clamp-1">{item.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Quantity: {item.quantity}</p>
                                        </div>
                                        <span className="text-gray-300 font-medium">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-300">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Service Fee (7%)</span>
                                    <span className="text-gray-300">{formatPrice(serviceFee)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping {formData.district ? `(${formData.district})` : ""}</span>
                                    {isCalculatingFee ? (
                                        <Loader2 className="h-4 w-4 text-brand-accent animate-spin" />
                                    ) : (
                                        <span className="text-brand-accent font-bold">
                                            {formData.district ? formatPrice(deliveryFee) : "Select District"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t-2 border-brand-accent/30 flex flex-col gap-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Grand Total</span>
                                    <span className="text-brand-gold font-bold text-3xl font-outfit">
                                        {formatPrice(finalTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isCalculatingFee}
                            className="w-full btn-gold h-16 flex items-center justify-center gap-4 group disabled:opacity-50 shadow-2xl shadow-brand-accent/20 relative overflow-hidden"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 text-black animate-spin" />
                            ) : (
                                <>
                                    <span className="font-black uppercase tracking-[0.2em] text-xs">Place Exclusive Order</span>
                                    <CheckCircle2 className="h-5 w-5 group-hover:scale-125 transition-transform duration-500" />
                                </>
                            )}
                        </button>

                        <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                            <ShieldCheck className="h-6 w-6 text-white" />
                            <CreditCard className="h-6 w-6 text-white" />
                            <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
