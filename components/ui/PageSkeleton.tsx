export default function PageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-pulse">
            {/* Hero skeleton */}
            <div className="text-center mb-16 space-y-4">
                <div className="h-4 w-32 bg-white/5 rounded-full mx-auto" />
                <div className="h-16 w-3/4 bg-white/5 rounded-2xl mx-auto" />
                <div className="h-4 w-1/2 bg-white/5 rounded-full mx-auto" />
            </div>
            {/* Cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                        <div className="h-64 bg-white/[0.04]" />
                        <div className="p-5 space-y-3">
                            <div className="h-3 w-1/3 bg-white/5 rounded-full" />
                            <div className="h-5 w-4/5 bg-white/5 rounded-xl" />
                            <div className="h-5 w-2/3 bg-white/5 rounded-xl" />
                            <div className="flex justify-between items-center pt-2">
                                <div className="h-7 w-24 bg-white/5 rounded-xl" />
                                <div className="h-10 w-10 bg-white/5 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
