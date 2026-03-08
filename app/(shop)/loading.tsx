export default function Loading() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[9999]">
            {/* Top Progress Bar */}
            <div className="h-1 bg-brand-accent w-full animate-progress-loading" />

            {/* Very Subtle Spinner - Non-blocking */}
            <div className="fixed bottom-8 right-8 h-10 w-10 bg-brand-dark/80 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center shadow-2xl">
                <div className="h-5 w-5 rounded-full border-t-2 border-brand-accent animate-spin" />
            </div>
        </div>
    );
}
