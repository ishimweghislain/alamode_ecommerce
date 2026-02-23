import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-background-dark border-t border-white/10 pt-16 pb-24 md:pb-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-brand-gold tracking-tighter">
                            ALAMODE<span className="text-white">.RW</span>
                        </Link>
                        <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                            Experience the pinnacle of luxury shopping in Rwanda. A curated marketplace for those who appreciate the finer things.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Marketplace</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/categories" className="hover:text-brand-gold transition-colors">All Categories</Link></li>
                            <li><Link href="/vendors" className="hover:text-brand-gold transition-colors">Become a Vendor</Link></li>
                            <li><Link href="/featured" className="hover:text-brand-gold transition-colors">Featured Products</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Newsletter</h4>
                        <p className="text-sm text-gray-400 mb-4">Join our elite circle for exclusive updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 rounded-luxury px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-accent h-10"
                            />
                            <button className="bg-brand-gold text-background-dark px-4 py-2 rounded-luxury text-sm font-bold h-10">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} ALAMODE.RW - Designed for Excellence.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white">Privacy</Link>
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                        <Link href="/cookies" className="hover:text-white">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
