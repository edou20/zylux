import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'

async function getProfile() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return { user, profile }
}

export default async function ProfilePage() {
    const { user, profile } = await getProfile()

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
                <p className="text-gray-600 mb-8">Manage your account settings and preferences</p>

                <ProfileForm user={user} profile={profile} />
            </div>
        </div>
    )
}
