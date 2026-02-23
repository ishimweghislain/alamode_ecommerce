"use client";

import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="p-10 rounded-full bg-white/5 text-gray-400">
                        <ShoppingBag className="h-16 w-16" />
                    </div>
                    <h1 className="text-4xl font-outfit font-bold text-white">Your bag is empty</h1>
                    <p className="text-gray-400 max-w-sm mx-auto">
                        Discover our curated collections and add your first luxury piece to the bag.
                    </p>
                    <Link href="/categories" className="btn-primary px-10 py-4 h-auto text-lg mt-4">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-outfit font-bold text-white mb-12">Shopping Bag</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="card-luxury p-6 flex items-center gap-6 group">
                            <div className="relative h-28 w-28 rounded-luxury overflow-hidden bg-white/10 flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium text-lg truncate mb-1">{item.name}</h3>
                                <p className="text-brand-gold font-bold mb-4">{formatPrice(item.price)}</p>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-white/5 rounded-luxury border border-white/10 px-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-luxury transition-all ml-auto"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="card-luxury p-8 sticky top-32">
                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Shipping</span>
                                <span className="text-brand-accent">Free Premium</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Tax Estimate</span>
                                <span>{formatPrice(total * 0.05)}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between">
                                <span className="text-white font-bold">Total</span>
                                <span className="text-brand-gold font-bold text-2xl font-outfit">
                                    {formatPrice(total * 1.05)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link href="/checkout" className="w-full btn-primary h-14 flex items-center justify-center gap-3">
                                Proceed to Checkout
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link href="/categories" className="w-full h-14 border border-white/10 rounded-luxury flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all">
                                Continue Shopping
                            </Link>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Security & Trust</p>
                            <div className="flex items-center gap-4 grayscale opacity-50">
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={20} />
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={40} height={20} />
                                <div className="h-4 w-10 bg-brand-gold/50 rounded-sm flex items-center justify-center text-[8px] font-bold text-black">MOMO</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
