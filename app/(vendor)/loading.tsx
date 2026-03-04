export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-2 border-white/5 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full border-t-2 border-r-2 border-brand-gold animate-spin absolute inset-0" />
                    <div className="h-10 w-10 rounded-full border-t-2 border-brand-accent animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                    <span className="text-brand-gold font-black text-xs">A</span>
                </div>
            </div>
        </div>
    );
}
