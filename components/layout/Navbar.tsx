"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Search, LogOut, ChevronDown, LayoutGrid, ShoppingBag, HelpCircle, Heart, Tag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useState } from "react";
import { usePathname } from "next/navigation";

import NotificationsBell from "@/components/ui/NotificationsBell";
import LogoutModal from "@/components/ui/LogoutModal";
import GlobalSearch from "./GlobalSearch";

const Navbar = () => {
    const { data: session } = useSession();
    const { items } = useCart();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/vendor") || pathname.startsWith("/profile") || pathname === "/support";

    if (isDashboard) return null;

    return (
        <>
            <nav className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="h-10 w-10 relative overflow-hidden rounded-lg border border-brand-gold/20">
                                    <Image
                                        src="/favicontobeusedandicon.png"
                                        alt="ALAMODE"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className="text-2xl font-bold text-brand-gold tracking-tighter uppercase font-outfit">
                                    ALAMODE
                                </span>
                            </Link>
                        </div>

                        {!isDashboard && (
                            <div className="hidden lg:flex flex-1 justify-center items-center gap-10 text-sm font-medium text-gray-300">
                                <Link href="/categories" className="flex items-center gap-2 hover:text-brand-gold transition-all hover:scale-105">
                                    <LayoutGrid className="h-4 w-4" />
                                    Categories
                                </Link>
                                <Link href="/shop" className="flex items-center gap-2 hover:text-brand-gold transition-all hover:scale-105">
                                    <ShoppingBag className="h-4 w-4" />
                                    Shop
                                </Link>
                                <Link href="/premium" className="flex items-center gap-2 hover:text-brand-gold transition-all hover:scale-105">
                                    <Tag className="h-4 w-4" />
                                    Promotions
                                </Link>
                                <Link href="/how-it-works" className="flex items-center gap-2 hover:text-brand-gold transition-all hover:scale-105">
                                    <HelpCircle className="h-4 w-4" />
                                    How It Works
                                </Link>
                            </div>
                        )}


                        <div className="flex items-center gap-5">
                            {session && !isDashboard && <NotificationsBell />}
                            {session && !isDashboard && (
                                <Link href="/profile/wishlist" className="relative p-2 text-gray-300 hover:text-red-400 transition-colors">
                                    <Heart className="h-6 w-6" />
                                    {/* Badge could be added here if we had a wishlist context */}
                                </Link>
                            )}

                            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-brand-gold transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                {items.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-brand-accent text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center">
                                        {items.length}
                                    </span>
                                )}
                            </Link>

                            {session && !isDashboard && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 p-1 pl-3 bg-white/5 rounded-full border border-white/10 hover:border-brand-accent transition-all"
                                    >
                                        <span className="text-sm font-medium text-white">{session?.user?.name?.split(' ')[0] || "User"}</span>
                                        <div className="h-8 w-8 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-xs uppercase">
                                            {session?.user?.name?.charAt(0) || "U"}
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
                                                onClick={() => setShowLogoutConfirm(true)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 flex items-center gap-2"
                                            >
                                                <LogOut className="h-4 w-4" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {session && isDashboard && (
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-xs uppercase">
                                        {session?.user?.name?.charAt(0) || "U"}
                                    </div>
                                    <span className="text-sm font-medium text-white hidden sm:inline-block">
                                        {session?.user?.name || "System User"}
                                    </span>
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="text-xs text-brand-gold hover:text-white transition-colors border border-brand-gold/30 px-3 py-1.5 rounded-full"
                                    >
                                        Back to Site
                                    </button>
                                </div>
                            )}

                            {!session && (
                                <Link href="/login" className="btn-primary flex items-center gap-2 px-6">
                                    <User className="h-4 w-4" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <LogoutModal
                isOpen={showLogoutConfirm}
                onClose={() => {
                    setShowLogoutConfirm(false);
                    setIsDropdownOpen(false);
                }}
            />
        </>
    );
};

export default Navbar;
