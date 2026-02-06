import Link from 'next/link'

interface Thread {
    id: string
    title: string
    slug: string
    content: string
    view_count: number
    comment_count: number
    upvote_count: number
    created_at: string
    author?: {
        username: string
        avatar_url?: string
    }
    topic?: {
        title: string
        slug: string
        niche: string
    }
}

interface ThreadCardProps {
    thread: Thread
    showTopic?: boolean
}

export default function ThreadCard({ thread, showTopic = false }: ThreadCardProps) {
    const timeAgo = getTimeAgo(new Date(thread.created_at))
    const isAiTech = thread.topic?.niche === 'ai_tech'

    return (
        <Link
            href={`/thread/${thread.id}`}
            className="block surface card-hover p-5 hover:border-teal-200"
        >
            <div className="flex gap-4">
                {/* Vote buttons */}
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <button
                        className="p-1 hover:text-teal-700 hover:bg-teal-50 rounded transition"
                        onClick={(e) => { e.preventDefault(); }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <span className="text-sm font-medium text-slate-700">{thread.upvote_count}</span>
                    <button
                        className="p-1 hover:text-orange-600 hover:bg-orange-50 rounded transition"
                        onClick={(e) => { e.preventDefault(); }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Topic badge */}
                    {showTopic && thread.topic && (
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mb-2 ${isAiTech
                                ? 'bg-teal-50 text-teal-700'
                                : 'bg-orange-50 text-orange-700'
                            }`}>
                            {thread.topic.title}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-slate-900 hover:text-teal-700 transition-colors line-clamp-2">
                        {thread.title}
                    </h3>

                    {/* Preview */}
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {thread.content}
                    </p>

                    {/* Meta */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {thread.author?.username || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {thread.comment_count} comments
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {thread.view_count} views
                        </span>
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`
    return `${Math.floor(seconds / 2592000)}mo ago`
}
