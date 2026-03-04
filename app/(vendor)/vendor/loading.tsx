export default function Loading() {
    return (
        <div className="absolute inset-0 z-[50] bg-background-dark/50 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-2 border-white/5 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full border-t-2 border-r-2 border-brand-gold animate-spin absolute inset-0" />
                    <div className="h-10 w-10 rounded-full border-t-2 border-brand-accent animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                </div>
            </div>
            <div className="text-center">
                <p className="text-brand-gold font-outfit font-black text-[10px] tracking-[0.4em] uppercase animate-pulse">
                    Accessing Vault
                </p>
            </div>
        </div>
    );
}
