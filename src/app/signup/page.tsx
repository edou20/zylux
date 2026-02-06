'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validate username
        if (username.length < 3) {
            setError('Username must be at least 3 characters')
            setLoading(false)
            return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError('Username can only contain letters, numbers, and underscores')
            setLoading(false)
            return
        }

        // Sign up with Supabase
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                    display_name: username,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
        } else {
            setSuccess(true)
        }
    }

    const handleGoogleSignup = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    const handleGithubSignup = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-mesh" />
                <div className="absolute inset-0 bg-noise opacity-60" />
                <div className="absolute -top-16 right-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-floaty" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-floaty" />

                <div className="relative w-full max-w-md p-8 space-y-6 bg-white/85 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 text-center">
                    <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-display font-semibold text-slate-900">Check your email!</h2>
                    <p className="text-slate-600">
                        We've sent a confirmation link to <span className="text-teal-700">{email}</span>.
                        Click the link to verify your account.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block mt-4 text-teal-700 hover:text-teal-800 font-semibold"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
            <div className="absolute inset-0 bg-mesh" />
            <div className="absolute inset-0 bg-noise opacity-60" />
            <div className="absolute -top-16 right-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-floaty" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-floaty" />

            <div className="relative w-full max-w-md p-8 space-y-8 bg-white/85 backdrop-blur rounded-3xl shadow-2xl border border-slate-200">
                <div className="text-center">
                    <h1 className="text-4xl font-display font-semibold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-600">Join the Zylux.ai community</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input"
                            placeholder="cooluser123"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="input"
                            placeholder="••••••••"
                        />
                        <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-transparent text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleGoogleSignup}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white/80 hover:bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold transition"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button
                        onClick={handleGithubSignup}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white/80 hover:bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold transition"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub
                    </button>
                </div>

                <p className="text-center text-slate-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-teal-700 hover:text-teal-800 font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
