import { Download, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-brand-dark pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Visual Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-full mb-8">
                    <Smartphone className="h-4 w-4 text-brand-accent" />
                    <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">Mobile Experience</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white mb-6 leading-tight">
                    Luxury in your <span className="text-brand-accent">Pocket.</span>
                </h1>

                <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                    Experience the ALAMODE marketplace like never before. Shop exclusive boutiques,
                    track orders in real-time, and discover curated luxury from Rwanda's finest.
                </p>

                {/* Download Button */}
                <div className="flex flex-col items-center gap-6">
                    <a
                        href="/mobile/app-release.apk"
                        download
                        className="group relative inline-flex items-center gap-4 px-10 py-5 bg-brand-accent text-black font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-brand-accent/20"
                    >
                        <Download className="h-6 w-6" />
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-tighter opacity-70">Download for</p>
                            <p className="text-xl leading-none">Android APK</p>
                        </div>
                    </a>

                    <p className="text-gray-500 text-sm">Version 1.0.0 • 24MB</p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] text-left">
                        <Zap className="h-8 w-8 text-brand-accent mb-4" />
                        <h3 className="text-white font-bold text-lg mb-2">Fast & Fluid</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Optimized performance for a cinematic shopping experience on any device.</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] text-left">
                        <ShieldCheck className="h-8 w-8 text-brand-accent mb-4" />
                        <h3 className="text-white font-bold text-lg mb-2">Secure</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Direct connection to our secure payments and order management system.</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] text-left">
                        <Smartphone className="h-8 w-8 text-brand-accent mb-4" />
                        <h3 className="text-white font-bold text-lg mb-2">Exclusive</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Get early access to boutique drops and exclusive mobile-only promotions.</p>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-20 p-10 bg-brand-accent/5 border border-brand-accent/10 rounded-[3rem]">
                    <h2 className="text-white font-bold text-2xl mb-6">How to Install</h2>
                    <div className="flex flex-col md:flex-row justify-center items-start gap-12 text-left max-w-3xl mx-auto">
                        <div className="flex-1">
                            <div className="h-10 w-10 bg-brand-accent text-black rounded-full flex items-center justify-center font-bold mb-4">1</div>
                            <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wide">Download APK</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">Click the button above to download the application file to your Android device.</p>
                        </div>
                        <div className="flex-1">
                            <div className="h-10 w-10 bg-brand-accent text-black rounded-full flex items-center justify-center font-bold mb-4">2</div>
                            <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wide">Enable Install</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">If prompted, allow your browser to install apps from "Unknown Sources" in settings.</p>
                        </div>
                        <div className="flex-1">
                            <div className="h-10 w-10 bg-brand-accent text-black rounded-full flex items-center justify-center font-bold mb-4">3</div>
                            <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wide">Launch App</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">Find the file in your downloads and tap to install. Open ALAMODE and start shopping.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
