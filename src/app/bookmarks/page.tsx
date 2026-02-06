import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getBookmarks() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data } = await supabase
        .from('bookmarks')
        .select(`
      id,
      created_at,
      thread:threads(
        id,
        title,
        slug,
        created_at,
        author:profiles(username),
        topic:topics(title, icon)
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return data || []
}

export default async function BookmarksPage() {
    const bookmarks = await getBookmarks()

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-3xl font-display font-semibold text-slate-900 mb-2">Your Bookmarks</h1>
                <p className="text-slate-600 mb-8">Threads you've saved for later</p>

                {bookmarks.length === 0 ? (
                    <div className="surface p-12 text-center">
                        <div className="text-5xl mb-4">🔖</div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No bookmarks yet</h3>
                        <p className="text-slate-500 mb-6">
                            Start bookmarking threads to save them for later!
                        </p>
                        <Link
                            href="/topics"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                        >
                            Explore Topics
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookmarks.map((bookmark: any) => (
                            <Link
                                key={bookmark.id}
                                href={`/thread/${bookmark.thread.id}`}
                                className="block surface card-hover p-5 hover:border-teal-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-2xl">
                                        {bookmark.thread.topic?.icon || '💬'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 line-clamp-2">
                                            {bookmark.thread.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                                            <span>{bookmark.thread.topic?.title}</span>
                                            <span>·</span>
                                            <span>by {bookmark.thread.author?.username || 'Anonymous'}</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
