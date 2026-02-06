'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface VoteButtonsProps {
    type: 'thread' | 'comment'
    id: string
    initialVotes: number
}

export default function VoteButtons({ type, id, initialVotes }: VoteButtonsProps) {
    const [votes, setVotes] = useState(initialVotes)
    const [userVote, setUserVote] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClientComponentClient()

    const handleVote = async (direction: 1 | -1) => {
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                window.location.href = '/login'
                return
            }

            // Check existing vote
            const { data: existingVote } = await supabase
                .from('votes')
                .select('*')
                .eq('user_id', user.id)
                .eq(type === 'thread' ? 'thread_id' : 'comment_id', id)
                .single()

            if (existingVote) {
                if (existingVote.vote_type === direction) {
                    // Remove vote
                    await supabase.from('votes').delete().eq('id', existingVote.id)
                    setVotes(prev => prev - direction)
                    setUserVote(null)
                } else {
                    // Change vote
                    await supabase
                        .from('votes')
                        .update({ vote_type: direction })
                        .eq('id', existingVote.id)
                    setVotes(prev => prev - existingVote.vote_type + direction)
                    setUserVote(direction)
                }
            } else {
                // New vote
                await supabase.from('votes').insert({
                    user_id: user.id,
                    [type === 'thread' ? 'thread_id' : 'comment_id']: id,
                    vote_type: direction
                })
                setVotes(prev => prev + direction)
                setUserVote(direction)
            }

            // Update the upvote count on the thread/comment
            const table = type === 'thread' ? 'threads' : 'comments'
            await supabase
                .from(table)
                .update({ upvote_count: votes + (userVote === direction ? -direction : direction) })
                .eq('id', id)

        } catch (error) {
            console.error('Vote error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={() => handleVote(1)}
                disabled={isLoading}
                className={`p-2 rounded-lg transition ${userVote === 1
                        ? 'bg-purple-100 text-purple-600'
                        : 'hover:bg-gray-100 text-gray-400 hover:text-purple-600'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            </button>

            <span className={`text-lg font-semibold ${votes > 0 ? 'text-purple-600' : votes < 0 ? 'text-red-500' : 'text-gray-600'
                }`}>
                {votes}
            </span>

            <button
                onClick={() => handleVote(-1)}
                disabled={isLoading}
                className={`p-2 rounded-lg transition ${userVote === -1
                        ? 'bg-red-100 text-red-500'
                        : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>
    )
}
