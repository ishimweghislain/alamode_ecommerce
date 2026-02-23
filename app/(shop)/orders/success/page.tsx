import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
            <div className="flex flex-col items-center gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-accent blur-2xl opacity-20 animate-pulse" />
                    <CheckCircle2 className="h-24 w-24 text-brand-accent relative z-10" />
                </div>

                <div>
                    <h1 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-4">Payment Successful!</h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Thank you for choosing ALAMODE.RW. Your luxury order has been received and is being prepared with clinical precision.
                    </p>
                </div>

                <div className="card-luxury p-8 max-w-md w-full border-brand-accent/30 bg-brand-accent/5">
                    <p className="text-sm text-gray-300 mb-4">A confirmation email and invoice have been sent to your registered address.</p>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-accent">
                        <span>Order Reference</span>
                        <span>#ALM-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Link href="/profile/orders" className="btn-primary h-14 px-10 flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Track My Order
                    </Link>
                    <Link href="/" className="h-14 px-10 rounded-luxury border border-white/10 flex items-center gap-2 text-white hover:bg-white/5 transition-all">
                        Continue Shopping
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
