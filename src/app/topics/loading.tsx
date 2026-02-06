export default function TopicsLoading() {
    return (
        <div className="min-h-screen">
            {/* Header Skeleton */}
            <div className="bg-white/70 backdrop-blur border-b border-slate-200/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-6 w-96 bg-slate-200 rounded-lg animate-pulse mt-3" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter Skeleton */}
                <div className="flex gap-4 mb-8">
                    <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-10 w-28 bg-slate-200 rounded-lg animate-pulse" />
                </div>

                {/* Section Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
                    <div>
                        <div className="h-7 w-40 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-4 w-20 bg-slate-200 rounded-lg animate-pulse mt-2" />
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white/80 rounded-2xl border border-slate-200 p-6">
                            <div className="w-14 h-14 bg-slate-200 rounded-xl animate-pulse mb-4" />
                            <div className="h-6 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                            <div className="h-4 w-full bg-slate-200 rounded-lg animate-pulse mt-3" />
                            <div className="h-4 w-2/3 bg-slate-200 rounded-lg animate-pulse mt-2" />
                            <div className="flex justify-between mt-4">
                                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                                <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
