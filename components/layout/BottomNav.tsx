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

interface NavLink {
    label: string;
    icon: any;
    href: string;
    badge?: number;
}

export default function BottomNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { items } = useCart();

    const isDashboardRoute = pathname.startsWith("/admin") || pathname.startsWith("/vendor") || pathname.startsWith("/profile");

    // Standard Shop Navigation
    const shopLinks: NavLink[] = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Shop", icon: LayoutGrid, href: "/shop" },
        { label: "Cart", icon: ShoppingCart, href: "/cart", badge: items.length },
        { label: "Profile", icon: User, href: session ? (session.user.role === "ADMIN" ? "/admin" : session.user.role === "VENDOR" ? "/vendor" : "/profile") : "/login" },
    ];

    // Dashboard Navigation (Role based)
    const adminLinks: NavLink[] = [
        { label: "Stats", icon: LayoutDashboard, href: "/admin" },
        { label: "Vendors", icon: Store, href: "/admin/vendors" },
        { label: "Catalog", icon: LayoutGrid, href: "/admin/categories" },
        { label: "Sales", icon: CreditCard, href: "/admin/orders" },
    ];

    const vendorLinks: NavLink[] = [
        { label: "Stats", icon: LayoutDashboard, href: "/vendor" },
        { label: "Products", icon: Package, href: "/vendor/products" },
        { label: "Store", icon: Store, href: "/vendor/profile" },
        { label: "Orders", icon: CreditCard, href: "/vendor/orders" },
    ];

    const customerLinks: NavLink[] = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Orders", icon: Package, href: "/profile/orders" },
        { label: "Payments", icon: CreditCard, href: "/profile/payments" },
        { label: "Settings", icon: User, href: "/profile/settings" },
    ];

    const dashboardLinks = session?.user.role === "ADMIN" ? adminLinks : session?.user.role === "VENDOR" ? vendorLinks : customerLinks;

    const links = isDashboardRoute ? dashboardLinks : shopLinks;
    const activeColor = isDashboardRoute ? "text-brand-accent" : "text-brand-gold";

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
            <div className="bg-background-dark/90 backdrop-blur-2xl border border-white/10 rounded-2xl flex justify-around items-center p-2 shadow-2xl pointer-events-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                                isActive ? `${activeColor} scale-110` : "text-gray-400 hover:text-white"
                            )}
                        >
                            <link.icon className="h-5 w-5" />
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
