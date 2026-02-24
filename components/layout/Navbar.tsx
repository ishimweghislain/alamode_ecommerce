"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Search, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useState } from "react";

const Navbar = () => {
    const { data: session } = useSession();
    const { items } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="hidden md:block sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 relative overflow-hidden rounded-lg border border-brand-gold/20">
                                <img src="/favicontobeusedandicon.png" alt="ALAMODE" className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <span className="text-2xl font-bold text-brand-gold tracking-tighter uppercase font-outfit">
                                ALAMODE
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
                            <Link href="/categories" className="hover:text-brand-gold transition-colors">Categories</Link>
                            <Link href="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
                            <Link href="/premium" className="hover:text-brand-gold transition-colors">Premium</Link>
                        </div>
                    </div>

                    <div className="flex-1 max-w-md mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search luxury products..."
                                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-all"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link href="/cart" className="relative p-2 text-gray-300 hover:text-brand-gold transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            {items.length > 0 && (
                                <span className="absolute top-0 right-0 bg-brand-accent text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center">
                                    {items.length}
                                </span>
                            )}
                        </Link>

                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 p-1 pl-3 bg-white/5 rounded-full border border-white/10 hover:border-brand-accent transition-all"
                                >
                                    <span className="text-sm font-medium text-white">{session.user.name?.split(' ')[0]}</span>
                                    <div className="h-8 w-8 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-xs uppercase">
                                        {session.user.name?.charAt(0)}
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400 mr-1" />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-12 right-0 w-48 bg-background-dark border border-white/10 rounded-luxury shadow-2xl py-2 z-50">
                                        <Link
                                            href={session.user.role === "ADMIN" ? "/admin" : session.user.role === "VENDOR" ? "/vendor" : "/profile"}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-brand-accent"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link href="/profile/orders" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-brand-accent">
                                            My Orders
                                        </Link>
                                        <Link href="/profile/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-brand-accent">
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 flex items-center gap-2"
                                        >
                                            <LogOut className="h-4 w-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="btn-primary flex items-center gap-2 px-6">
                                <User className="h-4 w-4" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
