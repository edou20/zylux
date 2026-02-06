'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

interface Notification {
    id: string
    type: string
    title: string
    message: string | null
    thread_id: string | null
    is_read: boolean
    created_at: string
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const bellRef = useRef<HTMLDivElement>(null)
    const supabase = createClientComponentClient()

    useEffect(() => {
        loadNotifications()

        const handleClickOutside = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const loadNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setIsLoading(false)
            return
        }

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)

        if (data) {
            setNotifications(data)
            setUnreadCount(data.filter(n => !n.is_read).length)
        }
        setIsLoading(false)
    }

    const markAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)

        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const markAllAsRead = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false)

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
    }

    const formatTime = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
        if (seconds < 60) return 'just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        return `${Math.floor(seconds / 86400)}d ago`
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'comment_reply': return '💬'
            case 'thread_reply': return '📝'
            case 'vote': return '⬆️'
            case 'mention': return '@'
            default: return '🔔'
        }
    }

    if (isLoading) return null

    return (
        <div ref={bellRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-teal-700 hover:text-teal-800"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                <span className="text-3xl block mb-2">🔔</span>
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition ${!notification.is_read ? 'bg-teal-50/60' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                                            {notification.message && (
                                                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notification.message}</p>
                                            )}
                                            <p className="text-xs text-slate-400 mt-1">{formatTime(notification.created_at)}</p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <Link
                        href="/notifications"
                        className="block px-4 py-3 text-center text-sm text-teal-700 hover:bg-slate-50 border-t border-slate-200"
                    >
                        View all notifications
                    </Link>
                </div>
            )}
        </div>
    )
}
