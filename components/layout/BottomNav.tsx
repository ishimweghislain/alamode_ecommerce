"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Home,
    Search,
    ShoppingCart,
    User,
    LayoutDashboard,
    Package,
    Store,
    CreditCard,
    LayoutGrid
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { clsx } from "clsx";

export default function BottomNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { items } = useCart();

    const isDashboardRoute = pathname.startsWith("/admin") || pathname.startsWith("/vendor") || pathname.startsWith("/profile");

    // Standard Shop Navigation
    const shopLinks = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Shop", icon: LayoutGrid, href: "/shop" },
        { label: "Cart", icon: ShoppingCart, href: "/cart", badge: items.length },
        { label: "Profile", icon: User, href: session ? (session.user.role === "ADMIN" ? "/admin" : session.user.role === "VENDOR" ? "/vendor" : "/profile") : "/login" },
    ];

    // Dashboard Navigation (Role based)
    const adminLinks = [
        { label: "Stats", icon: LayoutDashboard, href: "/admin" },
        { label: "Vendors", icon: Store, href: "/admin/vendors" },
        { label: "Catalog", icon: LayoutGrid, href: "/admin/categories" },
        { label: "Sales", icon: CreditCard, href: "/admin/orders" },
    ];

    const vendorLinks = [
        { label: "Stats", icon: LayoutDashboard, href: "/vendor" },
        { label: "Products", icon: Package, href: "/vendor/products" },
        { label: "Store", icon: Store, href: "/vendor/profile" },
        { label: "Orders", icon: CreditCard, href: "/vendor/orders" },
    ];

    const customerLinks = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Orders", icon: Package, href: "/profile/orders" },
        { label: "Payments", icon: CreditCard, href: "/profile/payments" },
        { label: "Settings", icon: User, href: "/profile/settings" },
    ];

    const dashboardLinks = session?.user.role === "ADMIN" ? adminLinks : session?.user.role === "VENDOR" ? vendorLinks : customerLinks;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 flex flex-col gap-2 pointer-events-none">
            {/* Second Navigation (Role Dashboard) - Only show when explicitly in dashboard and logged in */}
            {session && isDashboardRoute && (
                <div className="bg-background-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around items-center p-2 shadow-2xl pointer-events-auto transition-all animate-in slide-in-from-bottom-4">
                    {dashboardLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                                    isActive ? "text-brand-accent scale-110" : "text-gray-400"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                <span className="text-[10px] font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Main Navigation (Shop) */}
            <div className="bg-background-dark/90 backdrop-blur-2xl border border-white/10 rounded-2xl flex justify-around items-center p-2 shadow-2xl pointer-events-auto">
                {shopLinks.map((link) => {
                    const isActive = pathname === link.href && !isDashboardRoute;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "relative flex flex-col items-center gap-1 p-1 py-2 rounded-xl transition-all",
                                isActive ? "text-brand-gold scale-110" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <link.icon className="h-5 w-5 md:h-6 md:w-6" />
                            <span className="text-[10px] font-medium">{link.label}</span>
                            {link.badge && link.badge > 0 ? (
                                <span className="absolute top-1 right-1 bg-brand-accent text-white text-[8px] font-bold px-1 rounded-full min-w-[14px] text-center">
                                    {link.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
