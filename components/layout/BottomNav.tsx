"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, ShoppingBag, User } from "lucide-react";
import { clsx } from "clsx";

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Categories", icon: LayoutGrid, href: "/categories" },
        { label: "Cart", icon: ShoppingCart, href: "/cart" },
        { label: "Orders", icon: ShoppingBag, href: "/orders" },
        { label: "Profile", icon: User, href: "/profile" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-dark/95 backdrop-blur-lg border-t border-white/10 px-6 py-3">
            <div className="flex justify-between items-center max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                isActive ? "text-brand-accent scale-110" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
