export default function Loading() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[9999]">
            {/* Simple Top Progress Bar (YouTube/GitHub Style) */}
            <div className="h-[3px] bg-brand-accent w-full animate-progress-loading shadow-[0_0_10px_rgba(16,185,129,0.5)]" />

            {/* Subtle Overlay to hide the content/footer while switching */}
            <div className="fixed inset-0 bg-background-dark/20 backdrop-blur-[2px] -z-10 pointer-events-none" />
        </div>
    );
}
