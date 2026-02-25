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
    HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
    const customerSteps = [
        {
            icon: Sparkles,
            title: "Discover Excellence",
            desc: "Browse our curated collection of luxury fashion, technology, and home decor. Use categories and subcategories to find exactly what fits your style."
        },
        {
            icon: CreditCard,
            title: "Secure Purchase",
            desc: "Pay with your preferred method. We support international Credit/Debit cards via Stripe and local Rwandan Mobile Money (MTN & Airtel)."
        },
        {
            icon: Truck,
            title: "Premium Delivery",
            desc: "Our logistics team ensures your purchase is handled with care and delivered to your doorstep across Rwanda in record time."
        },
        {
            icon: PackageCheck,
            title: "Enjoy & Review",
            desc: "Confirm your delivery and share your experience with the community. Your satisfaction is our highest priority."
        }
    ];

    const vendorSteps = [
        {
            icon: User,
            title: "Apply as Vendor",
            desc: "Submit your application to become part of the ALAMODE family. We review every vendor to maintain our luxury standards."
        },
        {
            icon: Store,
            title: "Set Up Shop",
            desc: "Once approved, customize your store profile and start listing your products with high-quality images and detailed descriptions."
        },
        {
            icon: BarChart3,
            title: "Manage & Sell",
            desc: "Track your orders, manage inventory in real-time, and watch your business grow through our sophisticated dashboard."
        },
        {
            icon: Wallet,
            title: "Easy Withdrawals",
            desc: "Receive your earnings securely. Request withdrawals directly to your bank account or mobile money wallet anytime."
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-white">
            {/* Hero Section */}
            <section className="py-24 px-4 bg-gradient-to-b from-black/50 to-transparent">
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-outfit font-bold tracking-tighter uppercase">
                        How <span className="text-brand-accent">ALAMODE</span> Works
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Experience the new era of luxury shopping in Rwanda. Whether you're buying or selling, we've designed every step to be seamless, secure, and sophisticated.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-32">

                {/* For Customers */}
                <section className="space-y-16">
                    <div className="flex items-center gap-4">
                        <div className="h-1 bg-brand-accent w-20"></div>
                        <h2 className="text-3xl md:text-4xl font-outfit font-bold uppercase tracking-widest flex items-center gap-4">
                            <ShoppingBag className="text-brand-accent h-8 w-8" />
                            For Our Customers
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {customerSteps.map((step, i) => (
                            <div key={i} className="card-luxury p-8 space-y-6 group hover:translate-y-[-8px] transition-all duration-300">
                                <div className="text-5xl font-outfit font-bold text-white/5 absolute top-4 right-4 group-hover:text-brand-accent/10 transition-colors">
                                    0{i + 1}
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                                    <step.icon className="h-7 w-7" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold font-outfit">{step.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link href="/shop" className="btn-primary px-12 py-4 text-lg flex items-center gap-3">
                            Start Shopping <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </section>

                {/* For Vendors */}
                <section className="space-y-16">
                    <div className="flex items-center gap-4 justify-end">
                        <h2 className="text-3xl md:text-4xl font-outfit font-bold uppercase tracking-widest flex items-center gap-4">
                            <Store className="text-brand-accent h-8 w-8" />
                            For Luxury Vendors
                        </h2>
                        <div className="h-1 bg-brand-accent w-20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {vendorSteps.map((step, i) => (
                            <div key={i} className="card-luxury p-8 space-y-6 group hover:translate-y-[-8px] transition-all duration-300 border-l-2 border-l-transparent hover:border-l-brand-accent">
                                <div className="text-5xl font-outfit font-bold text-white/5 absolute top-4 right-4 group-hover:text-brand-accent/10 transition-colors">
                                    0{i + 1}
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-brand-accent group-hover:text-white transition-all">
                                    <step.icon className="h-7 w-7" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold font-outfit">{step.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link href="/register?role=VENDOR" className="btn-gold px-12 py-4 text-lg flex items-center gap-3">
                            Become a Vendor <Sparkles className="h-5 w-5" />
                        </Link>
                    </div>
                </section>

                {/* Security and Trust */}
                <section className="card-luxury p-12 bg-gradient-to-r from-brand-accent/20 to-transparent rounded-[3rem]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-outfit font-bold">Uncompromising Security & Trust</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1"><ShieldCheck className="text-brand-accent h-6 w-6" /></div>
                                    <div>
                                        <h4 className="font-bold">Verified Vendors Only</h4>
                                        <p className="text-gray-400 text-sm">Every seller on ALAMODE undergoes a strict verification process to ensure product authenticity.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><CreditCard className="text-brand-accent h-6 w-6" /></div>
                                    <div>
                                        <h4 className="font-bold">Safe Payments</h4>
                                        <p className="text-gray-400 text-sm">Your financial data is encrypted and handled by world-class payment providers. We never store your card details.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><HelpCircle className="text-brand-accent h-6 w-6" /></div>
                                    <div>
                                        <h4 className="font-bold">24/7 Concierge Support</h4>
                                        <p className="text-gray-400 text-sm">Need help? Our dedicated support team is always available to assist you with any inquiries.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <div className="absolute inset-0 bg-brand-dark flex items-center justify-center">
                                <Sparkles className="h-20 w-20 text-brand-gold animate-pulse" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-60"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-center">
                                <p className="text-sm font-outfit uppercase tracking-widest text-brand-accent font-bold">ALAMODE RWANDA</p>
                                <p className="text-xs text-gray-400">Excellence in every interaction.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
