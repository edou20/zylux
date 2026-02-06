'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface BookmarkButtonProps {
    threadId: string
}

export default function BookmarkButton({ threadId }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        checkBookmark()
    }, [threadId])

    const checkBookmark = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setIsLoading(false)
            return
        }

        const { data } = await supabase
            .from('bookmarks')
            .select('id')
            .eq('user_id', user.id)
            .eq('thread_id', threadId)
            .single()

        setIsBookmarked(!!data)
        setIsLoading(false)
    }

    const toggleBookmark = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            window.location.href = '/login'
            return
        }

        setIsLoading(true)

        if (isBookmarked) {
            await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', user.id)
                .eq('thread_id', threadId)
            setIsBookmarked(false)
        } else {
            await supabase
                .from('bookmarks')
                .insert({ user_id: user.id, thread_id: threadId })
            setIsBookmarked(true)
        }

        setIsLoading(false)
    }

    return (
        <button
            onClick={toggleBookmark}
            disabled={isLoading}
            className={`p-2 rounded-xl transition ${isBookmarked
                    ? 'bg-amber-100 text-amber-700'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-amber-600'
                }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this thread'}
        >
            <svg
                className="w-5 h-5"
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
            </svg>
        </button>
    )
}
