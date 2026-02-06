'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string
    title: string
    slug?: string
    type: 'thread' | 'topic'
    icon?: string
}

export default function SearchBar() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const supabase = createClientComponentClient()
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const searchDebounce = setTimeout(async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)

            // Search threads
            const { data: threads } = await supabase
                .from('threads')
                .select('id, title, slug')
                .ilike('title', `%${query}%`)
                .limit(5)

            // Search topics
            const { data: topics } = await supabase
                .from('topics')
                .select('id, title, slug, icon')
                .ilike('title', `%${query}%`)
                .limit(3)

            const searchResults: SearchResult[] = [
                ...(topics?.map(t => ({ ...t, type: 'topic' as const })) || []),
                ...(threads?.map(t => ({ ...t, type: 'thread' as const })) || [])
            ]

            setResults(searchResults)
            setIsLoading(false)
        }, 300)

        return () => clearTimeout(searchDebounce)
    }, [query, supabase])

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false)
        setQuery('')
        if (result.type === 'topic') {
            router.push(`/topic/${result.slug}`)
        } else {
            router.push(`/thread/${result.id}`)
        }
    }

    return (
        <div ref={searchRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search threads & topics..."
                    className="w-64 px-4 py-2 pl-10 text-sm bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition shadow-sm"
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {isOpen && (query.length >= 2 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    {isLoading ? (
                        <div className="p-4 text-center text-slate-500 text-sm">Searching...</div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {results.map((result) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleSelect(result)}
                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition flex items-center gap-3"
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${result.type === 'topic'
                                            ? 'bg-teal-100 text-teal-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {result.type === 'topic' ? result.icon || '📁' : '💬'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 line-clamp-1">{result.title}</p>
                                        <p className="text-xs text-slate-500 capitalize">{result.type}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
