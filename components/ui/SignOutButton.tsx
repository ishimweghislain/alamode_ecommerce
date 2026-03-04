"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/shop' })}
            className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2"
        >
            <LogOut className="h-3 w-3" />
            <span>Shop Anonymously</span>
        </button>
    );
}
