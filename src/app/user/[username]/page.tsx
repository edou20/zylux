import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getUser(username: string) {
    const supabase = createServerComponentClient({ cookies })

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) return null

    // Get user's threads
    const { data: threads } = await supabase
        .from('threads')
        .select(`
      id,
      title,
      created_at,
      upvote_count,
      comment_count,
      topic:topics(title, icon)
    `)
        .eq('author_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10)

    // Get user's recent comments
    const { data: comments } = await supabase
        .from('comments')
        .select(`
      id,
      content,
      created_at,
      thread:threads(id, title)
    `)
        .eq('author_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5)

    return { profile, threads: threads || [], comments: comments || [] }
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
    const data = await getUser(params.username)

    if (!data) {
        notFound()
    }

    const { profile, threads, comments } = data

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30">
                            {profile.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {profile.display_name || profile.username}
                            </h1>
                            <p className="text-white/80 text-lg">@{profile.username}</p>
                            {profile.bio && (
                                <p className="text-white/70 mt-2 max-w-lg">{profile.bio}</p>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 flex gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{threads.length}</div>
                            <div className="text-white/70 text-sm">Threads</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{comments.length}</div>
                            <div className="text-white/70 text-sm">Comments</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{profile.reputation || 0}</div>
                            <div className="text-white/70 text-sm">Reputation</div>
                        </div>
                        {profile.is_premium && (
                            <div className="text-center">
                                <div className="text-2xl">⭐</div>
                                <div className="text-white/70 text-sm">Premium</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Threads */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Threads</h2>

                        {threads.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                <p className="text-gray-500">No threads yet</p>
                            </div>
                        ) : (
                            threads.map((thread: any) => (
                                <Link
                                    key={thread.id}
                                    href={`/thread/${thread.id}`}
                                    className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 hover:shadow-md transition"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{thread.topic?.icon || '💬'}</span>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 line-clamp-2">{thread.title}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span>{thread.topic?.title}</span>
                                                <span>⬆️ {thread.upvote_count}</span>
                                                <span>💬 {thread.comment_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Member info */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Member Info</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="text-gray-900">{formatDate(profile.created_at)}</span>
                                </div>
                                {profile.is_premium && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Membership</span>
                                        <span className="text-amber-600 font-medium capitalize">{profile.premium_tier || 'Premium'}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Comments */}
                        {comments.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Recent Comments</h3>
                                <div className="space-y-3">
                                    {comments.map((comment: any) => (
                                        <Link
                                            key={comment.id}
                                            href={`/thread/${comment.thread?.id}`}
                                            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <p className="text-sm text-gray-700 line-clamp-2">{comment.content}</p>
                                            <p className="text-xs text-gray-400 mt-1">in {comment.thread?.title}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
