import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import ThreadCard from '@/components/ThreadCard'

async function getTrendingThreads() {
    const supabase = createServerComponentClient({ cookies })

    // Get threads with high engagement in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data } = await supabase
        .from('threads')
        .select(`
      *,
      author:profiles(username, avatar_url),
      topic:topics(title, slug, icon, niche)
    `)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('upvote_count', { ascending: false })
        .limit(20)

    return data || []
}

export default async function TrendingPage() {
    const threads = await getTrendingThreads()

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-rose-500">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl">
                            🔥
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-semibold text-white">Trending</h1>
                            <p className="text-white/80 mt-1">Hottest discussions from the past 7 days</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex gap-3 mb-6">
                    <button className="px-4 py-2 bg-orange-100 text-orange-700 font-semibold rounded-xl text-sm">
                        This Week
                    </button>
                    <button className="px-4 py-2 bg-white/80 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-orange-300 transition text-sm">
                        This Month
                    </button>
                    <button className="px-4 py-2 bg-white/80 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-orange-300 transition text-sm">
                        All Time
                    </button>
                </div>

                {/* Threads List */}
                <div className="space-y-4">
                    {threads.length === 0 ? (
                        <div className="surface p-12 text-center">
                            <div className="text-5xl mb-4">🔥</div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No trending threads yet</h3>
                            <p className="text-slate-500 mb-6">Be the first to start a popular discussion!</p>
                            <Link
                                href="/create"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-orange-400 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                            >
                                Create Thread
                            </Link>
                        </div>
                    ) : (
                        threads.map((thread, index) => (
                            <div key={thread.id} className="relative">
                                {index < 3 && (
                                    <div className={`absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                                        }`}>
                                        {index + 1}
                                    </div>
                                )}
                                <ThreadCard thread={thread} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
