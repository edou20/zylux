import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Shield, FileWarning, Users, MessageSquare, TrendingUp, Settings } from 'lucide-react'

async function getAdminStats() {
    const supabase = createServerComponentClient({ cookies })

    // Get counts
    const [
        { count: usersCount },
        { count: threadsCount },
        { count: commentsCount },
        { count: reportsCount }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('threads').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ])

    return {
        users: usersCount || 0,
        threads: threadsCount || 0,
        comments: commentsCount || 0,
        pendingReports: reportsCount || 0
    }
}

export default async function AdminPage() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Check if user is admin (you'd have an is_admin field on profiles)
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single()

    const stats = await getAdminStats()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-semibold text-white">Admin Dashboard</h1>
                        <p className="text-slate-400">Manage Zylux.ai platform</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 card-hover">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="w-5 h-5 text-cyan-300" />
                            <span className="text-slate-400 text-sm">Total Users</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.users.toLocaleString()}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 card-hover">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="w-5 h-5 text-emerald-300" />
                            <span className="text-slate-400 text-sm">Total Threads</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.threads.toLocaleString()}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 card-hover">
                        <div className="flex items-center gap-3 mb-3">
                            <MessageSquare className="w-5 h-5 text-teal-300" />
                            <span className="text-slate-400 text-sm">Total Comments</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.comments.toLocaleString()}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 card-hover">
                        <div className="flex items-center gap-3 mb-3">
                            <FileWarning className="w-5 h-5 text-rose-300" />
                            <span className="text-slate-400 text-sm">Pending Reports</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.pendingReports}</div>
                        {stats.pendingReports > 0 && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-rose-500/20 text-rose-300 text-xs rounded-full">
                                Needs attention
                            </span>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        href="/admin/reports"
                        className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group card-hover"
                    >
                        <FileWarning className="w-8 h-8 text-orange-300 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
                            Content Reports
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Review reported threads and comments. Take moderation action.
                        </p>
                        {stats.pendingReports > 0 && (
                            <div className="mt-4 px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full inline-block">
                                {stats.pendingReports} pending
                            </div>
                        )}
                    </Link>

                    <Link
                        href="/admin/users"
                        className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group card-hover"
                    >
                        <Users className="w-8 h-8 text-cyan-300 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                            User Management
                        </h3>
                        <p className="text-slate-400 text-sm">
                            View users, manage roles, suspend or ban accounts.
                        </p>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group card-hover"
                    >
                        <Settings className="w-8 h-8 text-teal-300 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">
                            Platform Settings
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Configure site settings, feature flags, and integrations.
                        </p>
                    </Link>
                </div>

                {/* Welcome message */}
                <div className="mt-8 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-2xl p-6">
                    <p className="text-teal-200">
                        👋 Welcome back, <span className="font-semibold text-white">{profile?.username}</span>!
                        You have admin access to the Zylux.ai platform.
                    </p>
                </div>
            </div>
        </div>
    )
}
