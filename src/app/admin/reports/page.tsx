import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft, AlertTriangle, Check, X, Eye } from 'lucide-react'

async function getReports() {
    const supabase = createServerComponentClient({ cookies })

    const { data } = await supabase
        .from('reports')
        .select(`
            *,
            reporter:profiles!reporter_id(username),
            thread:threads(id, title, author_id),
            comment:comments(id, content, author_id)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

    return data || []
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function getStatusColor(status: string) {
    switch (status) {
        case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        case 'reviewed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30'
        case 'dismissed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
        default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
}

export default async function ReportsPage() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const reports = await getReports()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/admin"
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Content Reports</h1>
                        <p className="text-slate-400">Review and moderate reported content</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {['all', 'pending', 'reviewed', 'resolved', 'dismissed'].map(status => (
                        <button
                            key={status}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg border border-white/10 capitalize transition-colors"
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Reports List */}
                {reports.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-12 text-center">
                        <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">All Clear!</h3>
                        <p className="text-slate-400">No reports to review at this time.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                                        <div>
                                            <span className="text-white font-medium">
                                                {report.thread ? 'Thread Report' : 'Comment Report'}
                                            </span>
                                            <span className="text-slate-500 text-sm ml-2">
                                                by @{report.reporter?.username || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                </div>

                                <div className="bg-black/30 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-slate-300">
                                        <span className="text-slate-500">Reason: </span>
                                        {report.reason}
                                    </p>
                                </div>

                                {report.thread && (
                                    <div className="text-sm text-slate-400 mb-4">
                                        <span className="text-slate-500">Reported thread: </span>
                                        <Link href={`/thread/${report.thread.id}`} className="text-cyan-400 hover:underline">
                                            {report.thread.title}
                                        </Link>
                                    </div>
                                )}

                                {report.comment && (
                                    <div className="text-sm text-slate-400 mb-4">
                                        <span className="text-slate-500">Reported comment: </span>
                                        <span className="text-slate-300">&quot;{report.comment.content.slice(0, 100)}...&quot;</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <span className="text-xs text-slate-500">
                                        Reported {formatDate(report.created_at)}
                                    </span>

                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors">
                                            <X className="w-4 h-4" />
                                            Remove Content
                                        </button>
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded-lg transition-colors">
                                            <Check className="w-4 h-4" />
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
