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
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl mb-6">⚠️</div>
                <h1 className="text-4xl font-display font-semibold text-slate-900 mb-4">
                    Something Went Wrong
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    Don't worry, our team has been notified. Please try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="btn-primary"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="btn-outline"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
