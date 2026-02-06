'use client'

import { useState } from 'react'
import { Video, Copy, Check, Download, Loader2, ChevronDown } from 'lucide-react'

type Platform = 'tiktok' | 'reels' | 'shorts' | 'youtube'
type Style = 'educational' | 'entertaining' | 'controversial' | 'storytelling'

interface ScriptGeneratorProps {
    threadId: string
    threadTitle: string
    threadContent: string
    comments: Array<{ author: string; content: string }>
}

const platforms: { value: Platform; label: string; icon: string }[] = [
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'reels', label: 'Instagram Reels', icon: '📸' },
    { value: 'shorts', label: 'YouTube Shorts', icon: '▶️' },
    { value: 'youtube', label: 'YouTube', icon: '🎬' }
]

const styles: { value: Style; label: string; description: string }[] = [
    { value: 'educational', label: 'Educational', description: 'Informative and clear' },
    { value: 'entertaining', label: 'Entertaining', description: 'Fun and engaging' },
    { value: 'controversial', label: 'Controversial', description: 'Debate-sparking' },
    { value: 'storytelling', label: 'Storytelling', description: 'Narrative format' }
]

export default function ScriptGenerator({
    threadId,
    threadTitle,
    threadContent,
    comments
}: ScriptGeneratorProps) {
    const [script, setScript] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [platform, setPlatform] = useState<Platform>('tiktok')
    const [style, setStyle] = useState<Style>('educational')
    const [showOptions, setShowOptions] = useState(false)

    const generateScript = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/ai/generate-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    threadId,
                    threadTitle,
                    threadContent,
                    comments: comments.slice(0, 10),
                    platform,
                    style
                })
            })

            const data = await response.json()

            if (data.success) {
                setScript(data.content)
            } else {
                setError(data.error || 'Failed to generate script')
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = async () => {
        if (script) {
            await navigator.clipboard.writeText(script)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const downloadScript = () => {
        if (script) {
            const blob = new Blob([script], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `script-${threadId}-${platform}.txt`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }
    }

    return (
        <div className="bg-gradient-to-br from-teal-900/25 to-cyan-900/25 rounded-2xl p-6 border border-teal-500/30">
            <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-teal-300" />
                <h3 className="text-lg font-semibold text-white">Video Script Generator</h3>
                <span className="px-2 py-0.5 text-xs bg-teal-500/20 text-teal-200 rounded-full">
                    AI
                </span>
            </div>

            {!script && !isLoading && (
                <div className="space-y-4">
                    <p className="text-slate-300">
                        Transform this discussion into a viral video script
                    </p>

                    {/* Platform Selection */}
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">Platform</label>
                        <div className="grid grid-cols-2 gap-2">
                            {platforms.map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => setPlatform(p.value)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${platform === p.value
                                            ? 'border-teal-500 bg-teal-500/20 text-white'
                                            : 'border-slate-700 text-slate-300 hover:border-slate-600'
                                        }`}
                                >
                                    <span>{p.icon}</span>
                                    <span className="text-sm">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Style Selection (Collapsible) */}
                    <div>
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="flex items-center gap-2 text-sm text-slate-300 hover:text-slate-200"
                        >
                            <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
                            Advanced Options
                        </button>

                        {showOptions && (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                {styles.map((s) => (
                                    <button
                                        key={s.value}
                                        onClick={() => setStyle(s.value)}
                                        className={`text-left px-3 py-2 rounded-lg border transition-all ${style === s.value
                                                ? 'border-teal-500 bg-teal-500/20'
                                                : 'border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="text-sm text-white">{s.label}</div>
                                        <div className="text-xs text-slate-400">{s.description}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={generateScript}
                        className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-400 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
                    >
                        <Video className="w-4 h-4" />
                        Generate Script
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-teal-300 animate-spin mx-auto mb-3" />
                    <p className="text-slate-300">Creating your script...</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Platform: {platforms.find(p => p.value === platform)?.label}
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-200">
                    {error}
                </div>
            )}

            {script && !isLoading && (
                <div className="space-y-4">
                    <div className="bg-black/30 rounded-xl p-4 border border-slate-700 max-h-96 overflow-y-auto">
                        <pre className="text-gray-200 whitespace-pre-wrap text-sm font-sans">
                            {script}
                        </pre>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-400" />
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
                            onClick={downloadScript}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>

                        <button
                            onClick={() => setScript(null)}
                            className="flex items-center gap-2 px-4 py-2 text-teal-300 hover:text-teal-200 transition-colors"
                        >
                            <Video className="w-4 h-4" />
                            New Script
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
