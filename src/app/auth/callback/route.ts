import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createRouteHandlerClient({ cookies })

        // Exchange the code for a session
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && user) {
            // Check if profile exists
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single()

            // If no profile exists, create one
            if (!profile) {
                const username = user.user_metadata?.username ||
                    user.email?.split('@')[0] ||
                    `user_${user.id.slice(0, 8)}`

                await supabase.from('profiles').insert({
                    id: user.id,
                    username: username,
                    display_name: user.user_metadata?.full_name || user.user_metadata?.display_name || username,
                    avatar_url: user.user_metadata?.avatar_url || null,
                })
            }
        }
    }

    // Redirect to home page
    return NextResponse.redirect(new URL('/', requestUrl.origin))
}
