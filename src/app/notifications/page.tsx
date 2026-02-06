import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getNotifications() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    return data || []
}

function formatTime(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
}

function getNotificationIcon(type: string) {
    switch (type) {
        case 'comment_reply': return '💬'
        case 'thread_reply': return '📝'
        case 'vote': return '⬆️'
        case 'mention': return '@'
        default: return '🔔'
    }
}

export default async function NotificationsPage() {
    const notifications = await getNotifications()

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-600 mt-1">Stay updated on your activity</p>
                    </div>
                    {notifications.some(n => !n.is_read) && (
                        <button className="px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition text-sm">
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="text-5xl mb-4">🔔</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                        <p className="text-gray-500 mb-6">
                            When someone interacts with your content, you'll see it here.
                        </p>
                        <Link
                            href="/topics"
                            className="inline-block px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition"
                        >
                            Explore Topics
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={notification.thread_id ? `/thread/${notification.thread_id}` : '#'}
                                className={`block p-5 hover:bg-gray-50 transition ${!notification.is_read ? 'bg-purple-50' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900">{notification.title}</p>
                                        {notification.message && (
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">{formatTime(notification.created_at)}</p>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0 mt-1.5" />
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
