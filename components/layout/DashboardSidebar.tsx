"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    CreditCard,
    BarChart3,
    Package,
    HelpCircle,
    LogOut,
    ChevronRight,
    Store,
    Heart
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { clsx } from "clsx";
import LogoutModal from "@/components/ui/LogoutModal";

interface SidebarProps {
    role: "ADMIN" | "VENDOR" | "CUSTOMER";
}

const Sidebar = ({ role }: SidebarProps) => {
    const pathname = usePathname();

    const adminLinks = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { label: "Vendors", icon: Store, href: "/admin/vendors" },
        { label: "Products", icon: Package, href: "/admin/products" },
        { label: "Categories", icon: ShoppingBag, href: "/admin/categories" },
        { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
        { label: "Withdrawals", icon: CreditCard, href: "/admin/withdrawals" },
        { label: "Users", icon: Users, href: "/admin/users" },
        { label: "Support", icon: HelpCircle, href: "/admin/support" },
        { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    ];

    const vendorLinks = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/vendor" },
        { label: "My Store", icon: Store, href: "/vendor/profile" },
        { label: "Products", icon: Package, href: "/vendor/products" },
        { label: "Orders", icon: ShoppingBag, href: "/vendor/orders" },
        { label: "Withdrawals", icon: CreditCard, href: "/vendor/withdrawals" },
        { label: "Support", icon: HelpCircle, href: "/support" },
        { label: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
    ];

    const customerLinks = [
        { label: "My Profile", icon: Users, href: "/profile" },
        { label: "My Orders", icon: ShoppingBag, href: "/profile/orders" },
        { label: "Wishlist", icon: Heart, href: "/profile/wishlist" },
        { label: "Payments", icon: CreditCard, href: "/profile/payments" },
        { label: "Settings", icon: Settings, href: "/profile/settings" },
        { label: "Help & Support", icon: HelpCircle, href: "/support" },
    ];

    const links = role === "ADMIN" ? adminLinks : role === "VENDOR" ? vendorLinks : customerLinks;

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { data: session } = useSession();

    return (
        <>
            <div className="hidden lg:flex w-72 h-[calc(100vh-80px)] sticky top-20 bg-background-dark/95 backdrop-blur-3xl border-r border-white/10 flex-col shadow-[20px_0_50px_rgba(0,0,0,0.4)] z-40">
                {/* Header Section with User Identity */}
                <div className="p-8 pb-6 shrink-0 border-b border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-50" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="h-12 w-12 rounded-2xl bg-brand-accent/20 border border-brand-accent/20 flex items-center justify-center font-bold text-brand-accent text-xl uppercase shadow-inner group-hover:scale-110 transition-transform duration-500">
                            {session?.user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <p className="text-white font-bold tracking-tight truncate w-32">{session?.user.name || "System User"}</p>
                            <p className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.2em] opacity-70">
                                {role} Portal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation (Scrollable Area) */}
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    <nav className="space-y-1.5 pb-10">
                        <div className="px-3 mb-4">
                            <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                                Control Station
                            </h2>
                        </div>
                        {links.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        "flex items-center justify-between p-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                                        isActive
                                            ? "text-white shadow-[0_4px_20px_rgba(255,184,76,0.1)] bg-white/[0.05]"
                                            : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-brand-gold/10 animate-in fade-in duration-500" />
                                    )}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-gold rounded-r-full shadow-[0_0_15px_rgba(255,184,76,0.5)]" />
                                    )}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <link.icon className={clsx(
                                            "h-5 w-5 transition-all duration-500",
                                            isActive ? "text-brand-gold scale-110" : "group-hover:text-white group-hover:scale-110"
                                        )} />
                                        <span className={clsx(
                                            "font-semibold tracking-tight text-sm",
                                            isActive ? "text-white" : ""
                                        )}>{link.label}</span>
                                    </div>
                                    <ChevronRight className={clsx(
                                        "h-4 w-4 transition-all duration-500 relative z-10",
                                        isActive ? "opacity-100 text-brand-gold rotate-90" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                                    )} />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Section (Back to Site & Logout) */}
                <div className="p-6 pt-4 border-t border-white/5 bg-background-dark shadow-[0_-10px_30px_rgba(0,0,0,0.3)] shrink-0 space-y-3">
                    <Link
                        href="/"
                        className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-gray-400 hover:text-brand-gold hover:bg-brand-gold/5 transition-all duration-300 font-bold text-xs group"
                    >
                        <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:text-brand-gold transition-colors">
                            <Store className="h-4 w-4" />
                        </div>
                        <span className="tracking-widest uppercase">Visit Marketplace</span>
                    </Link>

                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 font-bold text-xs group"
                    >
                        <div className="h-8 w-8 rounded-xl bg-red-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <span className="tracking-widest uppercase">Terminate Session</span>
                    </button>
                </div>
            </div>

            <LogoutModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
            />
        </>
    );
};

export default Sidebar;
