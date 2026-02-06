'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
    user: any
    profile: any
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
    const router = useRouter()
    const supabase = createClientComponentClient()

    const [displayName, setDisplayName] = useState(profile?.display_name || '')
    const [bio, setBio] = useState(profile?.bio || '')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: displayName,
                    bio: bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Profile Card */}
            <div className="surface p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {profile?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">@{profile?.username || 'user'}</h2>
                        <p className="text-slate-500">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span>⭐ {profile?.reputation || 0} reputation</span>
                            {profile?.is_premium && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                    Premium
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {message && (
                        <div className={`p-4 rounded-lg text-sm ${message.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-2">
                            Display Name
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your display name"
                            className="input"
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="textarea"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Account Stats */}
            <div className="surface p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-teal-50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-teal-700">0</div>
                        <div className="text-sm text-slate-600">Threads</div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-cyan-700">0</div>
                        <div className="text-sm text-slate-600">Comments</div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-emerald-700">{profile?.reputation || 0}</div>
                        <div className="text-sm text-slate-600">Reputation</div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-amber-700">
                            {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-sm text-slate-600">Joined</div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="surface p-6 border border-rose-200">
                <h3 className="text-lg font-semibold text-rose-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-slate-600 mb-4">
                    These actions are irreversible. Please proceed with caution.
                </p>
                <button className="px-4 py-2 border border-rose-300 text-rose-600 rounded-lg hover:bg-rose-50 transition text-sm">
                    Delete Account
                </button>
            </div>
        </div>
    )
}
