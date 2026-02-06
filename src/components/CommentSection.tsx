'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import VoteButtons from './VoteButtons'

interface Comment {
    id: string
    content: string
    created_at: string
    upvote_count: number
    parent_id: string | null
    author: {
        id: string
        username: string
        avatar_url?: string
        reputation: number
    } | null
}

interface CommentSectionProps {
    threadId: string
    comments: Comment[]
    isAiTech: boolean
}

export default function CommentSection({ threadId, comments, isAiTech }: CommentSectionProps) {
    const [newComment, setNewComment] = useState('')
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleSubmitComment = async (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault()
        const content = parentId ? replyContent : newComment
        if (!content.trim()) return

        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            await supabase.from('comments').insert({
                thread_id: threadId,
                author_id: user.id,
                content: content.trim(),
                parent_id: parentId
            })

            // Update comment count
            const { data: thread } = await supabase
                .from('threads')
                .select('comment_count')
                .eq('id', threadId)
                .single()

            if (thread) {
                await supabase
                    .from('threads')
                    .update({ comment_count: (thread.comment_count || 0) + 1 })
                    .eq('id', threadId)
            }

            if (parentId) {
                setReplyContent('')
                setReplyTo(null)
            } else {
                setNewComment('')
            }

            router.refresh()
        } catch (error) {
            console.error('Comment error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatTimeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
        if (seconds < 60) return 'just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        return `${Math.floor(seconds / 86400)}d ago`
    }

    // Organize comments into tree structure
    const rootComments = comments.filter(c => !c.parent_id)
    const replies = comments.filter(c => c.parent_id)
    const repliesMap = replies.reduce((map, reply) => {
        const parentId = reply.parent_id!
        if (!map[parentId]) map[parentId] = []
        map[parentId].push(reply)
        return map
    }, {} as Record<string, Comment[]>)

    const renderComment = (comment: Comment, isReply = false) => (
        <div key={comment.id} className={`${isReply ? 'ml-12 mt-4' : 'mt-6'}`}>
            <div className={`flex gap-4 ${isReply ? 'bg-gray-50 rounded-xl p-4' : ''}`}>
                {/* Vote buttons for comments */}
                <VoteButtons
                    type="comment"
                    id={comment.id}
                    initialVotes={comment.upvote_count}
                />

                <div className="flex-1">
                    {/* Author */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {comment.author?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                            {comment.author?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400">{comment.author?.reputation || 0} rep</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400">{formatTimeAgo(comment.created_at)}</span>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="mt-2 flex items-center gap-4">
                        {!isReply && (
                            <button
                                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                                className="text-xs text-gray-500 hover:text-purple-600 transition"
                            >
                                Reply
                            </button>
                        )}
                    </div>

                    {/* Reply form */}
                    {replyTo === comment.id && (
                        <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="mt-4">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Reply to ${comment.author?.username}...`}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !replyContent.trim()}
                                    className={`px-4 py-2 text-white text-sm font-medium rounded-lg disabled:opacity-50 ${isAiTech ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {isSubmitting ? 'Posting...' : 'Reply'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setReplyTo(null); setReplyContent('') }}
                                    className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Nested replies */}
            {repliesMap[comment.id]?.map(reply => renderComment(reply, true))}
        </div>
    )

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
            </h2>

            {/* New comment form */}
            <form onSubmit={(e) => handleSubmitComment(e)} className="bg-white rounded-xl border border-gray-200 p-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className={`px-6 py-2.5 text-white font-medium rounded-lg disabled:opacity-50 transition ${isAiTech ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>
            </form>

            {/* Comments list */}
            <div className="bg-white rounded-xl border border-gray-200 mt-4 p-6">
                {rootComments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    rootComments.map(comment => renderComment(comment))
                )}
            </div>
        </div>
    )
}
