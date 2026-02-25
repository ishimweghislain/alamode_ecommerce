import {
    User,
    Store,
    ShoppingBag,
    CreditCard,
    Truck,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    Wallet,
    BarChart3,
    PackageCheck,
    HelpCircle,
    Search,
    CheckCircle2,
    LogIn,
    Zap
} from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
    const customerSteps = [
        {
            icon: LogIn,
            title: "Join the Community",
            desc: "Create your personal account in seconds. This allows you to track orders and save your favorites to your wishlist.",
            action: "Create Account"
        },
        {
            icon: Search,
            title: "Find Your Style",
            desc: "Use our advanced filters to browse by Category or Subcategory (Men, Women, Kids). Find the perfect luxury piece.",
            action: "Start Browsing"
        },
        {
            icon: CreditCard,
            title: "Secure Checkout",
            desc: "Add items to your cart and pay securely. We support all major Credit Cards via Stripe and Mobile Money (MTN/Airtel).",
            action: "View Cart"
        },
        {
            icon: Truck,
            title: "Concierge Delivery",
            desc: "Sit back while our team handles the logistics. Track your order status from 'Paid' to 'Delivered' in real-time.",
            action: "My Orders"
        }
    ];

    const vendorSteps = [
        {
            icon: Sparkles,
            title: "Apply for Access",
            desc: "Register as a Vendor. Our team manually verifies every seller to ensure we maintain our elite standards of quality.",
            action: "Apply Now"
        },
        {
            icon: Zap,
            title: "List Inventory",
            desc: "Upload your products with professional photos and descriptions. Categories and Subcategories help customers find you easily.",
            action: "Add Products"
        },
        {
            icon: BarChart3,
            title: "Scale Your Sales",
            desc: "Use the Vendor Dashboard to manage stock levels, view analytics, and respond to customer orders immediately.",
            action: "Dashboard"
        },
        {
            icon: Wallet,
            title: "Direct Earnings",
            desc: "View your sales balance in your wallet. Request manual withdrawals at any time to your bank or mobile wallet.",
            action: "Withdraw"
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-white">
            {/* Hero Section */}
            <section className="py-32 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-accent/5 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-gold text-xs font-bold tracking-widest uppercase">
                        <Sparkles className="h-3 w-3" /> Step-by-Step Guide
                    </div>
                    <h1 className="text-3xl md:text-5xl font-outfit font-bold tracking-tighter uppercase leading-[0.9]">
                        Confused ? Follow these steps as you are a  <br /><span className="text-brand-accent"> Customer or vendor.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        A seamless experience meticulously designed for the modern luxury marketplace. Here is exactly how to navigate ALAMODE.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-40">

                {/* For Customers */}
                <section className="space-y-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-outfit font-bold uppercase flex items-center gap-4">
                                <ShoppingBag className="text-brand-accent h-10 w-10" />
                                The Customer Journey
                            </h2>
                            <p className="text-gray-400 max-w-xl">Follow these simple steps to acquire your next luxury item from our verified inventory.</p>
                        </div>
                        <Link href="/shop" className="btn-primary px-10 py-4 flex items-center gap-2 w-fit">
                            Start Shopping <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {customerSteps.map((step, i) => (
                            <div key={i} className="card-luxury p-8 space-y-6 relative group border-t-4 border-t-transparent hover:border-t-brand-accent transition-all duration-500">
                                <div className="text-8xl font-outfit font-bold text-white/[0.02] absolute -bottom-4 -right-2 pointer-events-none group-hover:text-brand-accent/[0.05] transition-colors line-height-1">
                                    0{i + 1}
                                </div>
                                <div className="h-16 w-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all transform group-hover:rotate-3">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold font-outfit">{step.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed text-sm">{step.desc}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5 opacity-50 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                                    Action: {step.action}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* For Vendors */}
                <section className="space-y-20">
                    <div className="flex flex-col md:flex-row-reverse md:items-end justify-between gap-6">
                        <div className="space-y-4 md:text-right">
                            <h2 className="text-4xl md:text-5xl font-outfit font-bold uppercase flex items-center md:justify-end gap-4">
                                The Vendor Lifecycle
                                <Store className="text-brand-gold h-10 w-10" />
                            </h2>
                            <p className="text-gray-400 max-w-xl md:ml-auto">Build your luxury brand on Rwanda's most sophisticated sales platform.</p>
                        </div>
                        <Link href="/register?role=VENDOR" className="btn-gold px-10 py-4 flex items-center gap-2 w-fit">
                            Become a Vendor <Sparkles className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {vendorSteps.map((step, i) => (
                            <div key={i} className="card-luxury p-8 space-y-6 relative group border-b-4 border-b-transparent hover:border-b-brand-gold transition-all duration-500">
                                <div className="text-8xl font-outfit font-bold text-white/[0.02] absolute -top-4 -left-2 pointer-events-none group-hover:text-brand-gold/[0.05] transition-colors line-height-1">
                                    0{i + 1}
                                </div>
                                <div className="h-16 w-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-all transform group-hover:-rotate-3">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold font-outfit">{step.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed text-sm">{step.desc}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5 opacity-50 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                                    Step: {step.action}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Security and Trust */}
                <section className="relative">
                    <div className="absolute inset-0 bg-brand-accent/5 rounded-[4rem] -rotate-1 skew-y-1 scale-105"></div>
                    <div className="relative card-luxury p-8 md:p-20 bg-background-dark/50 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight">Guaranteed Integrity</h2>
                                    <p className="text-gray-400 leading-relaxed font-light">We operate with absolute transparency. Every transaction is protected by industry-leading security protocols.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-xl bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="text-brand-accent h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">Encrypted Payments</h4>
                                            <p className="text-gray-400 text-sm font-light">We use Stripe's Level 1 Service Provider security. Your financial data is encrypted and never stored on our local servers.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-xl bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="text-brand-accent h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">100% Quality Verification</h4>
                                            <p className="text-gray-400 text-sm font-light">Every vendor is manually vetted. Any product found to be counterfeit results in immediate and permanent vendor removal.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-brand-gold rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/20 bg-black">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                                    <div className="absolute bottom-10 left-10 space-y-2">
                                        <div className="h-1 w-12 bg-brand-accent"></div>
                                        <h3 className="text-3xl font-bold font-outfit uppercase italic">Built on Trust</h3>
                                        <p className="text-xs text-gray-400 tracking-widest uppercase font-bold">Rwanda's Trusted Luxury Partner</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Final CTA */}
            <section className="py-32 bg-black border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
                    <h2 className="text-5xl font-outfit font-bold tracking-tighter">READY TO GET STARTED?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/shop" className="btn-primary px-12 py-5 text-lg w-full sm:w-auto">
                            Visit the Shop
                        </Link>
                        <Link href="/register?role=VENDOR" className="btn-gold px-12 py-5 text-lg w-full sm:w-auto">
                            Apply as Vendor
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
