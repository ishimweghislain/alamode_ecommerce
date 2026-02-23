"use client";

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
    Store
} from "lucide-react";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

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
        { label: "Orders", icon: CreditCard, href: "/admin/orders" },
        { label: "Users", icon: Users, href: "/admin/users" },
        { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    ];

    const vendorLinks = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/vendor" },
        { label: "My Store", icon: Store, href: "/vendor/profile" },
        { label: "Products", icon: Package, href: "/vendor/products" },
        { label: "Orders", icon: ShoppingBag, href: "/vendor/orders" },
        { label: "Withdrawals", icon: CreditCard, href: "/vendor/withdrawals" },
        { label: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
    ];

    const customerLinks = [
        { label: "My Profile", icon: Users, href: "/profile" },
        { label: "My Orders", icon: ShoppingBag, href: "/profile/orders" },
        { label: "Wishlist", icon: Package, href: "/profile/wishlist" },
        { label: "Payments", icon: CreditCard, href: "/profile/payments" },
        { label: "Settings", icon: Settings, href: "/profile/settings" },
    ];

    const links = role === "ADMIN" ? adminLinks : role === "VENDOR" ? vendorLinks : customerLinks;

    return (
        <div className="w-64 h-[calc(100vh-80px)] sticky top-20 bg-background-dark/50 border-r border-white/10 p-6 flex flex-col">
            <div className="space-y-2 flex-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "flex items-center justify-between p-3 rounded-luxury transition-all duration-300 group",
                                isActive
                                    ? "bg-brand-accent text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon className="h-5 w-5" />
                                <span className="font-medium">{link.label}</span>
                            </div>
                            <ChevronRight className={clsx(
                                "h-4 w-4 transition-transform",
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                            )} />
                        </Link>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2">
                <Link
                    href="/support"
                    className="flex items-center gap-3 p-3 rounded-luxury text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                >
                    <HelpCircle className="h-5 w-5" />
                    <span className="font-medium">Support</span>
                </Link>
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 p-3 rounded-luxury text-red-400 hover:bg-red-400/10 transition-all font-medium"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
