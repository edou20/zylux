export default function TopicLoading() {
    return (
        <div className="min-h-screen">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="h-4 w-32 bg-white/20 rounded animate-pulse mb-4" />
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl animate-pulse" />
                        <div>
                            <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse" />
                            <div className="h-5 w-72 bg-white/20 rounded-lg animate-pulse mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-6">
                        <div className="h-5 w-20 bg-white/20 rounded animate-pulse" />
                        <div className="h-6 w-24 bg-white/20 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-3">
                        <div className="h-10 w-20 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-10 w-16 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-10 w-28 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-10 w-32 bg-teal-200 rounded-lg animate-pulse" />
                </div>

                {/* Thread Cards Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white/80 rounded-xl border border-slate-200 p-5">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                                    <div className="w-6 h-6 bg-slate-200 rounded animate-pulse" />
                                    <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                                </div>
                                <div className="flex-1">
                                    <div className="h-6 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                                    <div className="h-4 w-full bg-slate-200 rounded-lg animate-pulse mt-2" />
                                    <div className="h-4 w-2/3 bg-slate-200 rounded-lg animate-pulse mt-2" />
                                    <div className="flex gap-4 mt-4">
                                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                                        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
