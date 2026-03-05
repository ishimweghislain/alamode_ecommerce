"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    Home,
    Search,
    ShoppingCart,
    User,
    LayoutDashboard,
    Package,
    Store,
    CreditCard,
    LayoutGrid,
    LogOut
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

interface NavLink {
    label: string;
    icon: any;
    href: string;
    badge?: number;
}

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const { items } = useCart();

    const isDashboardRoute = pathname.startsWith("/admin") || pathname.startsWith("/vendor") || pathname.startsWith("/profile");

    // Standard Shop Navigation
    const shopLinks: NavLink[] = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Shop", icon: LayoutGrid, href: "/shop" },
        { label: "Search", icon: Search, href: "/shop?focus=search" },
        { label: "Cart", icon: ShoppingCart, href: "/cart", badge: items.length },
        { label: "Profile", icon: User, href: session ? (session.user.role === "ADMIN" ? "/admin" : session.user.role === "VENDOR" ? "/vendor" : "/profile") : "/login" },
    ];

    // Dashboard Navigation (Role based)
    const adminLinks: NavLink[] = [
        { label: "Stats", icon: LayoutDashboard, href: "/admin" },
        { label: "Vendors", icon: Store, href: "/admin/vendors" },
        { label: "Orders", icon: CreditCard, href: "/admin/orders" },
        { label: "Products", icon: LayoutGrid, href: "/admin/products" },
        { label: "Support", icon: Home, href: "/admin/support" },
    ];

    const vendorLinks: NavLink[] = [
        { label: "Stats", icon: LayoutDashboard, href: "/vendor" },
        { label: "Stock", icon: Package, href: "/vendor/products" },
        { label: "Orders", icon: CreditCard, href: "/vendor/orders" },
        { label: "Money", icon: Store, href: "/vendor/withdrawals" },
        { label: "Profile", icon: User, href: "/vendor/profile" },
    ];

    const customerLinks: NavLink[] = [
        { label: "Mall", icon: Home, href: "/" },
        { label: "Orders", icon: Package, href: "/profile/orders" },
        { label: "Settings", icon: User, href: "/profile/settings" },
        { label: "Cart", icon: ShoppingCart, href: "/cart", badge: items.length },
    ];

    const dashboardLinks = session?.user.role === "ADMIN" ? adminLinks : session?.user.role === "VENDOR" ? vendorLinks : customerLinks;

    const links = isDashboardRoute ? dashboardLinks : shopLinks;
    const activeColor = isDashboardRoute ? "text-brand-accent" : "text-brand-gold";

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] p-3 pb-6 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex justify-between items-center px-4 py-2 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all active:scale-90",
                                isActive ? `${activeColor} bg-white/5` : "text-gray-500 hover:text-white"
                            )}
                        >
                            <link.icon className={clsx("h-5 w-5", isActive && "animate-pulse")} />
                            <span className="text-[9px] font-bold uppercase tracking-tighter">{link.label}</span>
                            {link.badge && link.badge > 0 ? (
                                <span className="absolute top-1 right-2 bg-brand-accent text-white text-[8px] font-black px-1 rounded-full min-w-[14px] text-center border border-black group-hover:scale-110 transition-transform">
                                    {link.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}

                {/* Logout Button if Logged In */}
                {session && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-red-500/70 hover:text-red-500 active:scale-90"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">Exit</span>
                    </button>
                )}
            </div>
        </div>
    );
}
