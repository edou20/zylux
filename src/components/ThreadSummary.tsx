'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react'

interface ThreadSummaryProps {
    threadId: string
    threadTitle: string
    threadContent: string
    comments: Array<{ author: string; content: string }>
}

export default function ThreadSummary({
    threadId,
    threadTitle,
    threadContent,
    comments
}: ThreadSummaryProps) {
    const [summary, setSummary] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generateSummary = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/ai/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    threadId,
                    threadTitle,
                    threadContent,
                    comments: comments.slice(0, 10) // Limit to top 10 comments
                })
            })

            const data = await response.json()

            if (data.success) {
                setSummary(data.content)
            } else {
                setError(data.error || 'Failed to generate summary')
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = async () => {
        if (summary) {
            await navigator.clipboard.writeText(summary)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="bg-gradient-to-br from-teal-900/25 to-cyan-900/25 rounded-2xl p-6 border border-teal-500/30">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-teal-300" />
                <h3 className="text-lg font-semibold text-white">AI Summary</h3>
                <span className="px-2 py-0.5 text-xs bg-teal-500/20 text-teal-200 rounded-full">
                    Beta
                </span>
            </div>

            {!summary && !isLoading && (
                <div className="text-center py-6">
                    <p className="text-slate-300 mb-4">
                        Get an AI-powered summary of this discussion
                    </p>
                    <button
                        onClick={generateSummary}
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-400 hover:to-cyan-500 transition-all flex items-center gap-2 mx-auto"
                    >
                        <Sparkles className="w-4 h-4" />
                        Summarize with AI
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-teal-300 animate-spin mx-auto mb-3" />
                    <p className="text-slate-300">Analyzing discussion...</p>
                </div>
            )}

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-200">
                    {error}
                </div>
            )}

            {summary && !isLoading && (
                <div className="space-y-4">
                    <div className="bg-black/30 rounded-xl p-4 border border-slate-700">
                        <pre className="text-gray-200 whitespace-pre-wrap text-sm font-sans">
                            {summary}
                        </pre>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-green-400" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </button>

                        <button
                            onClick={generateSummary}
                            className="flex items-center gap-2 px-4 py-2 text-teal-300 hover:text-teal-200 transition-colors"
                        >
                            <Sparkles className="w-4 h-4" />
                            Regenerate
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
