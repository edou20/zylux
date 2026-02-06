import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import CommentSection from '@/components/CommentSection'
import VoteButtons from '@/components/VoteButtons'

async function getThread(id: string) {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase
        .from('threads')
        .select(`
      *,
      author:profiles(id, username, avatar_url, reputation),
      topic:topics(id, slug, title, icon, niche)
    `)
        .eq('id', id)
        .single()
    return data
}

async function getComments(threadId: string) {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase
        .from('comments')
        .select(`
      *,
      author:profiles(id, username, avatar_url, reputation)
    `)
        .eq('thread_id', threadId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
    return data || []
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export default async function ThreadPage({ params }: { params: { id: string } }) {
    const thread = await getThread(params.id)

    if (!thread) {
        notFound()
    }

    const comments = await getComments(thread.id)
    const isAiTech = thread.topic?.niche === 'ai_tech'

    // Increment view count
    const supabase = createServerComponentClient({ cookies })
    await supabase
        .from('threads')
        .update({ view_count: thread.view_count + 1 })
        .eq('id', thread.id)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/topics" className="text-gray-500 hover:text-gray-700">Topics</Link>
                        <span className="text-gray-300">/</span>
                        <Link
                            href={`/topic/${thread.topic?.slug}`}
                            className={`hover:underline ${isAiTech ? 'text-purple-600' : 'text-blue-600'}`}
                        >
                            {thread.topic?.title}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Thread Content */}
                <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className={`px-6 py-4 ${isAiTech ? 'bg-purple-50 border-b border-purple-100' : 'bg-blue-50 border-b border-blue-100'}`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{thread.topic?.icon}</span>
                            <span className={`text-sm font-medium ${isAiTech ? 'text-purple-600' : 'text-blue-600'}`}>
                                {thread.topic?.title}
                            </span>
                            {thread.is_pinned && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                    📌 Pinned
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="flex gap-4">
                            {/* Votes */}
                            <VoteButtons
                                type="thread"
                                id={thread.id}
                                initialVotes={thread.upvote_count}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    {thread.title}
                                </h1>

                                <div className="prose prose-gray max-w-none">
                                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                        {thread.content}
                                    </p>
                                </div>

                                {/* Author & Meta */}
                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                            {thread.author?.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{thread.author?.username || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-500">
                                                {thread.author?.reputation || 0} rep · {formatDate(thread.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {thread.view_count + 1} views
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            {comments.length} comments
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Comments Section */}
                <CommentSection
                    threadId={thread.id}
                    comments={comments}
                    isAiTech={isAiTech}
                />
            </div>
        </div>
    )
}
