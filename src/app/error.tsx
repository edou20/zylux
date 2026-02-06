'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl mb-6">⚠️</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Something Went Wrong
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Don't worry, our team has been notified. Please try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
