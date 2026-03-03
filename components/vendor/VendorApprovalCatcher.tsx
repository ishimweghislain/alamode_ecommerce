"use client";

import { signOut } from "next-auth/react";
import { Clock, ShieldAlert } from "lucide-react";

export default function VendorApprovalCatcher() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="relative">
                <div className="absolute inset-0 bg-brand-gold/20 blur-[100px] rounded-full" />
                <Clock className="h-24 w-24 text-brand-gold relative animate-pulse" />
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-outfit font-bold text-white leading-tight">
                    Account Under Review
                </h1>
                <p className="text-gray-400 text-lg">
                    We have received your request to become a vendor. Our team is now checking your application.
                </p>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-brand-accent space-y-2">
                    <p className="font-bold text-lg">You cannot use the system yet.</p>
                    <p className="text-sm">Please contact the administrator to get approved. Once you are approved, you can start selling.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="btn-primary px-10 py-4 h-auto text-base"
                >
                    Log Out and Go to Home Page
                </button>
            </div>

            <div className="p-6 bg-brand-gold/5 border border-brand-gold/10 rounded-2xl flex items-center gap-4 text-left">
                <ShieldAlert className="h-6 w-6 text-brand-gold shrink-0" />
                <p className="text-xs text-brand-gold/80 italic leading-relaxed">
                    Tip: While waiting, ensure you have your business details ready. Approved vendors gain access to global analytics and our premium logistics network.
                </p>
            </div>
        </div>
    );
}
