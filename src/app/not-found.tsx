import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl mb-6">🔍</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/topics"
                        className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 transition"
                    >
                        Browse Topics
                    </Link>
                </div>
            </div>
        </div>
    )
}
