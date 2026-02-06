import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import ThreadCard from '@/components/ThreadCard'

async function getTopic(slug: string) {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase
        .from('topics')
        .select('*')
        .eq('slug', slug)
        .single()
    return data
}

async function getThreads(topicId: string) {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase
        .from('threads')
        .select(`
      *,
      author:profiles(username, avatar_url)
    `)
        .eq('topic_id', topicId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20)
    return data || []
}

export default async function TopicPage({ params }: { params: { slug: string } }) {
    const topic = await getTopic(params.slug)

    if (!topic) {
        notFound()
    }

    const threads = await getThreads(topic.id)
    const isAiTech = topic.niche === 'ai_tech'

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Topic Header */}
            <div className={`${isAiTech
                ? 'bg-gradient-to-r from-purple-600 to-purple-800'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
                        <Link href="/topics" className="hover:text-white transition">Topics</Link>
                        <span>/</span>
                        <span className="text-white">{topic.title}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl">
                            {topic.icon}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{topic.title}</h1>
                            <p className="text-white/80 mt-1">{topic.description}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-6 text-white/80 text-sm">
                        <span>{topic.thread_count || 0} threads</span>
                        <span className="px-3 py-1 bg-white/20 rounded-full capitalize">
                            {topic.niche?.replace('_', ' & ')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300 transition text-sm">
                            Latest
                        </button>
                        <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300 transition text-sm">
                            Top
                        </button>
                        <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300 transition text-sm">
                            Unanswered
                        </button>
                    </div>

                    <Link
                        href={`/create?topic=${topic.slug}`}
                        className={`px-5 py-2.5 text-white font-medium rounded-lg transition text-sm ${isAiTech
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        + New Thread
                    </Link>
                </div>

                {/* Threads List */}
                <div className="space-y-4">
                    {threads.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <div className="text-5xl mb-4">💬</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No threads yet</h3>
                            <p className="text-gray-500 mb-6">Be the first to start a discussion in this topic!</p>
                            <Link
                                href={`/create?topic=${topic.slug}`}
                                className={`inline-block px-6 py-3 text-white font-medium rounded-lg transition ${isAiTech
                                        ? 'bg-purple-600 hover:bg-purple-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                Create Thread
                            </Link>
                        </div>
                    ) : (
                        threads.map((thread) => (
                            <ThreadCard key={thread.id} thread={thread} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
