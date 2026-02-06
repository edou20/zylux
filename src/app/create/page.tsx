'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

interface Topic {
    id: string
    slug: string
    title: string
    icon: string
    niche: string
}

export default function CreateThreadPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClientComponentClient()

    const [topics, setTopics] = useState<Topic[]>([])
    const [selectedTopic, setSelectedTopic] = useState<string>('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadTopics() {
            const { data } = await supabase
                .from('topics')
                .select('id, slug, title, icon, niche')
                .eq('is_active', true)
                .order('title')

            if (data) {
                setTopics(data)
                const preselected = searchParams.get('topic')
                if (preselected) {
                    const found = data.find(t => t.slug === preselected)
                    if (found) setSelectedTopic(found.id)
                }
            }
        }
        loadTopics()
    }, [supabase, searchParams])

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .substring(0, 50) + '-' + Date.now().toString(36)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login?redirect=/create')
                return
            }

            if (!selectedTopic || !title.trim() || !content.trim()) {
                setError('Please fill in all fields')
                setIsLoading(false)
                return
            }

            const { data: thread, error: insertError } = await supabase
                .from('threads')
                .insert({
                    topic_id: selectedTopic,
                    author_id: user.id,
                    title: title.trim(),
                    content: content.trim(),
                    slug: generateSlug(title)
                })
                .select()
                .single()

            if (insertError) throw insertError

            // Update thread count
            await supabase.rpc('increment_thread_count', { topic_id: selectedTopic })

            const topic = topics.find(t => t.id === selectedTopic)
            router.push(`/topic/${topic?.slug || ''}`)
        } catch (err: any) {
            setError(err.message || 'Failed to create thread')
        } finally {
            setIsLoading(false)
        }
    }

    const selectedTopicData = topics.find(t => t.id === selectedTopic)
    const isAiTech = selectedTopicData?.niche === 'ai_tech'

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/topics"
                        className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to topics
                    </Link>
                    <h1 className="text-3xl font-display font-semibold text-slate-900">Create New Thread</h1>
                    <p className="text-slate-600 mt-2">Share your thoughts with the community</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="surface p-6 sm:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Topic Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Select Topic *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {topics.map((topic) => (
                                <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => setSelectedTopic(topic.id)}
                                    className={`p-3 rounded-xl border-2 transition text-left ${selectedTopic === topic.id
                                            ? topic.niche === 'ai_tech'
                                                ? 'border-teal-500 bg-teal-50'
                                                : 'border-orange-400 bg-orange-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <span className="text-2xl block mb-1">{topic.icon}</span>
                                    <span className="text-sm font-medium text-slate-900 line-clamp-1">{topic.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's on your mind?"
                            className="input"
                            maxLength={150}
                        />
                        <p className="text-xs text-slate-400 mt-1">{title.length}/150 characters</p>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                            Content *
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts, questions, or insights..."
                            rows={8}
                            className="textarea"
                        />
                        <p className="text-xs text-slate-400 mt-1">Markdown formatting supported</p>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isLoading || !selectedTopic || !title.trim() || !content.trim()}
                            className={`px-8 py-3 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed ${isAiTech
                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                                    : 'bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600'
                                }`}
                        >
                            {isLoading ? 'Creating...' : 'Create Thread'}
                        </button>
                        <Link href="/topics" className="text-slate-500 hover:text-slate-700 transition">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
