'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import NotificationBell from './NotificationBell'

export default function Header() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setMenuOpen(false)
        router.push('/')
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-teal-500 via-cyan-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20">
                            <span className="text-white font-bold text-sm">Z</span>
                        </div>
                        <span className="text-xl font-semibold text-slate-900 font-display tracking-tight">Zylux.ai</span>
                    </Link>

                    {/* Navigation + Search */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/topics" className="text-slate-600 hover:text-slate-900 font-medium transition">
                            Topics
                        </Link>
                        <Link href="/trending" className="text-slate-600 hover:text-slate-900 font-medium transition flex items-center gap-1">
                            🔥 Trending
                        </Link>
                        <SearchBar />
                    </nav>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-3">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                        ) : user ? (
                            <>
                                <NotificationBell />
                                <div className="relative">
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </button>

                                    {menuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setMenuOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-20">
                                                <div className="px-4 py-3 border-b border-slate-100">
                                                    <p className="text-sm font-medium text-slate-900 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span className="text-lg">👤</span>
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/bookmarks"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span className="text-lg">🔖</span>
                                                    Bookmarks
                                                </Link>
                                                <Link
                                                    href="/notifications"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span className="text-lg">🔔</span>
                                                    Notifications
                                                </Link>
                                                <div className="border-t border-slate-100 mt-1" />
                                                <Link
                                                    href="/settings"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span className="text-lg">⚙️</span>
                                                    Settings
                                                </Link>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-600 hover:bg-rose-50"
                                                >
                                                    <span className="text-lg">🚪</span>
                                                    Sign out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-slate-600 hover:text-slate-900 font-medium transition"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/25"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
