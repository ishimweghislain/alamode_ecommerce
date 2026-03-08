export default function Loading() {
    return (
        <div className="fixed inset-0 z-[40] bg-background-dark flex flex-col items-center justify-center">
            {/* Top Progress Bar - Fixed to the very top, above everything including Navbar if needed, 
                but user said "only see progress and navbar", so we'll keep it visible. */}
            <div className="fixed top-0 left-0 right-0 z-[60]">
                <div className="h-1 bg-brand-accent w-full animate-progress-loading shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Minimalist Center Brand Loader */}
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full border-2 border-white/5 flex items-center justify-center">
                        <div className="h-20 w-20 rounded-full border-t-2 border-brand-accent animate-spin absolute" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-brand-accent font-outfit font-black text-xl italic">A</span>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-white font-outfit font-bold tracking-[0.2em] uppercase text-sm">
                        Alamode<span className="text-brand-accent">.</span>
                    </h2>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-2">
                        Authenticity in Motion
                    </p>
                </div>
            </div>

            {/* Hint to user that we are hiding the rest on purpose */}
            <style jsx global>{`
                footer { display: none !important; }
                .bottom-nav { display: none !important; }
            `}</style>
        </div>
    );
}
