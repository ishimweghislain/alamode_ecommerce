export default function Loading() {
    return (
        <div className="fixed inset-0 z-[999] bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">
            <div className="relative">
                <div className="h-20 w-20 rounded-full border-2 border-white/5 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full border-t-2 border-r-2 border-brand-gold animate-spin absolute inset-0" />
                    <div className="h-12 w-12 rounded-full border-t-2 border-brand-accent animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                    <span className="text-brand-gold font-outfit font-black text-sm tracking-widest">A</span>
                </div>
            </div>
            <div className="text-center space-y-2">
                <p className="text-white font-outfit font-bold text-lg tracking-[0.3em] uppercase">ALAMODE</p>
                <div className="flex items-center justify-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
