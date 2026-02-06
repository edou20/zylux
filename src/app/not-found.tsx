import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl mb-6">🔍</div>
                <h1 className="text-4xl font-display font-semibold text-slate-900 mb-4">
                    Page Not Found
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="btn-primary"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/topics"
                        className="btn-outline"
                    >
                        Browse Topics
                    </Link>
                </div>
            </div>
        </div>
    )
}
