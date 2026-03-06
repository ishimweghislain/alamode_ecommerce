import React from 'react';
import Link from 'next/link';
import { Smartphone, Download, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
    title: "Download ALAMODE Mobile App | Rwanda's Luxury Marketplace",
    description: "Experience ALAMODE on the go. Download our official Android application for the best shopping experience in Rwanda.",
};

const DownloadPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-background-dark overflow-hidden relative">
            {/* Background gradients for premium feel */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                        <div className="flex-1">
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-gold uppercase bg-gold/10 rounded-full border border-gold/20">
                                Official Mobile Client
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                                Shop ALAMODE <br />
                                <span className="text-gold">Everywhere.</span>
                            </h1>
                            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl">
                                Experience the luxury boutique mall directly on your smartphone. Faster browse, instant notifications, and a seamless shopping experience tailored for Rwanda.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link
                                    href="/mobile/app-release.apk"
                                    download
                                    className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gold text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gold/20"
                                >
                                    <Download size={20} />
                                    <span>Download for Android (APK)</span>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                                </Link>

                                <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed">
                                    <Smartphone size={20} />
                                    <span>iOS Version Coming Soon</span>
                                </div>
                            </div>

                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { icon: <ShieldCheck className="text-gold" size={18} />, text: "Safe & Secure" },
                                    { icon: <Zap className="text-gold" size={18} />, text: "Ultra Fast" },
                                    { icon: <CheckCircle className="text-gold" size={18} />, text: "Easy Install" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                        {item.icon}
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 relative flex justify-center">
                            {/* Mockup or Graphic Placeholder */}
                            <div className="relative w-64 h-[520px] bg-zinc-900 rounded-[3rem] border-8 border-zinc-800 shadow-2xl shadow-black overflow-hidden transform rotate-2 md:rotate-6 flex flex-col">
                                <div className="w-full h-6 bg-zinc-800 flex justify-center items-center">
                                    <div className="w-16 h-4 bg-black rounded-full" />
                                </div>
                                <div className="flex-grow bg-white flex flex-col p-4">
                                    <div className="w-full h-8 bg-zinc-100 rounded mb-4" />
                                    <div className="flex gap-2 mb-6">
                                        <div className="w-full h-40 bg-zinc-200 rounded-xl animate-pulse" />
                                        <div className="w-full h-40 bg-zinc-200 rounded-xl animate-pulse" />
                                    </div>
                                    <div className="w-2/3 h-4 bg-zinc-800 rounded mb-2" />
                                    <div className="w-1/2 h-3 bg-gold rounded mb-6" />
                                    <div className="w-full h-10 bg-zinc-900 rounded-lg mt-auto" />
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/20 rounded-full blur-3xl opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom info */}
            <div className="container mx-auto px-6 mt-20 relative z-10 border-t border-white/5 pt-12">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-xl font-bold mb-4 text-white">How to install</h2>
                    <ol className="text-gray-400 space-y-3 text-sm inline-block text-left">
                        <li>1. Click the <strong className="text-gold">Download</strong> button above.</li>
                        <li>2. Once downloaded, tap the file in your notifications or browser.</li>
                        <li>3. If prompted, allow "Install from unknown sources" in your settings.</li>
                        <li>4. Follow the installation steps and enjoy ALAMODE!</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default DownloadPage;
