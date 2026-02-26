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
            title: "Join the Elite",
            desc: "Register your profile with verified contact details. This unlocks personalized wishlists, real-time order tracking, and exclusive early access to limited luxury collections.",
            action: "Create Profile"
        },
        {
            icon: Search,
            title: "Curated Discovery",
            desc: "Navigate through categories like 'Men', 'Women', and 'Kids'. Filter by brand, price, or rarity to find authentic luxury pieces sourced from Kigali's top vendors.",
            action: "Browse Pieces"
        },
        {
            icon: CreditCard,
            title: "Multi-Channel Payments",
            desc: "Add to cart and checkout with confidence. We support Visa, Mastercard, and Amex via Stripe, plus integrated Mobile Money (MTN MoMo & Airtel Money) for local convenience.",
            action: "Secure Checkout"
        },
        {
            icon: Truck,
            title: "Verified Delivery",
            desc: "Our logistics partners ensure white-glove delivery to your doorstep. Monitor your order journey directly from your dashboard—from 'Processing' to 'Hand-Delivered'.",
            action: "Track Orders"
        }
    ];

    const vendorSteps = [
        {
            icon: Sparkles,
            title: "Boutique Verification",
            desc: "Submit your vendor application. Our curators perform a manual audit of your store's reputation and product authenticity to maintain our 'Guaranteed Authentic' marketplace standard.",
            action: "Apply for Booth"
        },
        {
            icon: Zap,
            title: "Virtual Shop Setup",
            desc: "Leverage our high-performance dashboard to list items. Categorize accurately and upload high-resolution imagery to showcase the luxury value of your inventory.",
            action: "List Collection"
        },
        {
            icon: BarChart3,
            title: "Precision Analytics",
            desc: "Monitor your store's performance with real-time revenue tracking, order volume insights, and customer feedback. Fine-tune your stock based on ALAMODE's market trends.",
            action: "Grow Sales"
        },
        {
            icon: Wallet,
            title: "Automated Payouts",
            desc: "Sales revenue is held in your secure vendor wallet. Request withdrawals at any time—payouts are processed manually within 24 hours to your bank or mobile wallet.",
            action: "Withdraw Funds"
        }
    ];

    const faqs = [
        { q: "Is the internal payment system safe?", a: "ALAMODE uses industry-standard SSL encryption and PCI-compliant processors like Stripe. We never store your card details on our local servers." },
        { q: "How do I become a 'Top-Rated' Vendor?", a: "Maintaining a high fulfillment rate and consistent 5-star product reviews will automatically elevate your vendor status in our algorithm." },
        { q: "What if my item arrives damaged?", a: "Every purchase is protected by our Support Guarantee. Open a 'Support Ticket' within 24 hours of delivery for immediate mediation by our Concierge Team." },
        { q: "Are withdrawals instant for Vendors?", a: "For security, absolute volume withdrawals are reviewed by our financial team and typically cleared within 12-24 business hours." }
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
                        Confused ? Follow these steps as a <br /><span className="text-brand-accent">Customer or Vendor.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        A seamless experience meticulously designed for the modern luxury marketplace. Here is exactly how to navigate ALAMODE.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-40">

                {/* For Customers */}
                <section id="customer-guide" className="space-y-20 scroll-mt-20">
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
                                <div className="h-16 w-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all transform group-hover:rotate-3 shadow-lg">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold font-outfit leading-tight">{step.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed text-sm">{step.desc}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5 opacity-50 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                                    Target: {step.action}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* For Vendors */}
                <section id="vendor-guide" className="space-y-20 scroll-mt-20">
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
                                <div className="h-16 w-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-all transform group-hover:-rotate-3 shadow-[0_10px_30px_rgba(234,179,8,0.1)]">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold font-outfit leading-tight">{step.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed text-sm">{step.desc}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5 opacity-50 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                                    Goal: {step.action}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-16">
                    <div className="text-center space-y-4">
                        <HelpCircle className="h-12 w-12 text-brand-accent mx-auto opacity-50" />
                        <h2 className="text-3xl md:text-5xl font-outfit font-bold uppercase">Frequently Asked</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Quick answers to common questions about our ecosystem.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {faqs.map((faq, i) => (
                            <div key={i} className="card-luxury p-8 space-y-4 bg-white/[0.02]">
                                <h4 className="text-lg font-bold text-brand-gold flex gap-3">
                                    <span className="opacity-30">Q.</span>
                                    {faq.q}
                                </h4>
                                <p className="text-gray-400 text-sm leading-relaxed font-light pl-7">
                                    {faq.a}
                                </p>
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
                                    <p className="text-gray-400 leading-relaxed font-light">We operate with absolute transparency. Every transaction is protected by industry-leading security protocols and real-time monitoring.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-xl bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="text-brand-accent h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">Encrypted Payments</h4>
                                            <p className="text-gray-400 text-sm font-light">We use Stripe's Level 1 Service Provider security. Your financial data is triple-encrypted and never stored on our local infrastructure.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-xl bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="text-brand-accent h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">Verified Luxury Standard</h4>
                                            <p className="text-gray-400 text-sm font-light">Every vendor is manually vetted for origin and ethics. Any product found to be counterfeit results in immediate vendor blacklisting.</p>
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
                                        <p className="text-xs text-gray-400 tracking-widest uppercase font-bold">Rwanda's Premier Luxury Platform</p>
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
