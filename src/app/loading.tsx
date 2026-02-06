export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                </div>
                <p className="mt-4 text-slate-500 text-sm">Loading...</p>
            </div>
        </div>
    )
}
