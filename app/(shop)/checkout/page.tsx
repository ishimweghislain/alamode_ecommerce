"use client";

import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MapPin, Phone, CreditCard, Smartphone, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("MOMO");

    const [formData, setFormData] = useState({
        shippingAddress: "",
        phone: "",
        city: "Kigali",
    });

    if (items.length === 0) {
        return null; // Should redirect in useEffect or middleware
    }

    const subtotal = total * 1.05;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post("/api/orders", {
                items: items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: formData.shippingAddress,
                phone: formData.phone,
                paymentMethod: paymentMethod,
                totalAmount: subtotal
            });

            if (response.status === 200) {
                toast.success("Order placed successfully! Please authorize payment on your device.");
                clearCart();
                router.push("/orders/success");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data || "Failed to place order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="mb-12 flex items-center gap-4">
                <Link href="/cart" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6 text-gray-400" />
                </Link>
                <h1 className="text-4xl font-outfit font-bold text-white">Checkout</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Information */}
                    <section className="card-luxury p-8 space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-brand-accent" />
                            Shipping Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 text-sm">
                                <label className="text-gray-400">Primary Contact Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                                    <input
                                        required
                                        className="input-luxury w-full py-3 pl-12"
                                        placeholder="078 XXX XXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <label className="text-gray-400">City / District</label>
                                <input
                                    required
                                    className="input-luxury w-full py-3"
                                    defaultValue="Kigali"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <label className="text-gray-400">Full Shipping Address</label>
                            <textarea
                                required
                                rows={3}
                                className="input-luxury w-full py-4"
                                placeholder="Street name, Building number, Apartment, etc."
                                value={formData.shippingAddress}
                                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                            />
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="card-luxury p-8 space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-brand-gold" />
                            Payment Method
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: "MOMO", label: "Mobile Money", icon: Smartphone, color: "text-brand-gold" },
                                { id: "CARD", label: "Visa / Master", icon: CreditCard, color: "text-blue-400" },
                                { id: "AIRTEL", label: "Airtel Money", icon: Smartphone, color: "text-red-400" },
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`p-6 rounded-luxury border flex flex-col items-center gap-3 transition-all ${paymentMethod === method.id
                                        ? "bg-brand-accent/10 border-brand-accent"
                                        : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <method.icon className={`h-8 w-8 ${method.id === paymentMethod ? 'text-brand-accent' : method.color}`} />
                                    <span className={`text-sm font-bold uppercase tracking-wider text-[10px] ${paymentMethod === method.id ? 'text-white' : 'text-gray-400'}`}>
                                        {method.label}
                                    </span>
                                    {paymentMethod === method.id && <CheckCircle2 className="h-4 w-4 text-brand-accent absolute top-3 right-3" />}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 bg-white/5 rounded-luxury border border-white/10 text-sm text-gray-400 leading-relaxed italic">
                            {paymentMethod === "MOMO" && "You will receive a prompt on your phone to authorize the payment after clicking 'Place Order'."}
                            {paymentMethod === "CARD" && "Secure card processing powered by international standards. No card details are stored locally."}
                            {paymentMethod === "AIRTEL" && "Available for all Airtel Money subscribers in Rwanda."}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <div className="card-luxury p-8 sticky top-32">
                        <h2 className="text-xl font-bold text-white mb-6">Payment Details</h2>

                        <div className="space-y-4 mb-8">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-400 line-clamp-1 flex-1 pr-4">{item.name} x {item.quantity}</span>
                                    <span className="text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-white/10 flex justify-between">
                                <span className="text-white font-bold">Total Amount</span>
                                <span className="text-brand-gold font-bold text-2xl font-outfit">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary h-14 flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Confirm & Pay Now
                                    <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                        <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed">
                            By placing this order, you agree to ALAMODE's <br />
                            <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
