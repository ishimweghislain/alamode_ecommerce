import { BookOpen, User, Store, ShieldCheck, CreditCard, ShoppingBag, HelpCircle } from "lucide-react";

export default function DocumentationPage() {
    const sections = [
        {
            title: "Getting Started",
            icon: BookOpen,
            content: "Welcome to ALAMODE, Rwanda's premier luxury marketplace. Whether you are a customer looking for elite fashion or a vendor wanting to showcase your products, this guide will help you navigate our platform."
        },
        {
            title: "For Customers",
            icon: User,
            content: "Browse our curated categories (Fashion, Decoration, Technology). Add items to your cart, apply promo codes if available, and head to checkout. We support secure payments via Stripe (Credit/Debit Cards) and Mobile Money integrated solutions."
        },
        {
            title: "For Vendors",
            icon: Store,
            content: "Create a vendor account to start selling. Once approved by our admin team, you can manage your store profile, upload products with multiple images, and track your sales analytics. You can request withdrawals of your earnings directly from your dashboard."
        },
        {
            title: "Payments & Security",
            icon: ShieldCheck,
            content: "We use SSL encryption to protect your data. Payments are processed through Stripe for international cards and local integrated gateways for MTN/Airtel Mobile Money. Your financial information is never stored on our servers."
        },
        {
            title: "Order Tracking",
            icon: ShoppingBag,
            content: "Track your orders in real-time from your profile. Statuses include: Pending, Paid, Shipped, Delivered, and Cancelled. If you have any issues with your order, you can open a dispute from the order details page."
        },
        {
            title: "Need More Help?",
            icon: HelpCircle,
            content: "If you have specific questions or encounter any issues, please reach out to our support team at support@alamode.rw or use the contact form on our website."
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-outfit font-bold text-white tracking-tight">Documentation</h1>
                    <p className="text-xl text-gray-400">Everything you need to know about using the ALAMODE platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, index) => (
                        <div key={index} className="card-luxury p-8 space-y-4 group hover:border-brand-accent transition-all">
                            <div className="h-12 w-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                                <section.icon className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                            <p className="text-gray-400 leading-relaxed font-light">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="card-luxury p-12 bg-gradient-to-br from-brand-accent/10 to-transparent text-center space-y-6">
                    <h2 className="text-3xl font-bold text-white font-outfit">Join Our Membership</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Elevate your shopping experience with our exclusive membership program. Get early access to limited edition releases and white-glove delivery services.
                    </p>
                    <button className="btn-primary px-12 py-4 text-lg">
                        Learn More About Membership
                    </button>
                </div>
            </div>
        </div>
    );
}
