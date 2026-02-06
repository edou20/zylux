import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession()

    // Define protected routes
    const protectedRoutes = ['/create', '/settings', '/profile']
    const isProtectedRoute = protectedRoutes.some(route =>
        req.nextUrl.pathname.startsWith(route)
    )

    // If trying to access protected route without session, redirect to login
    if (isProtectedRoute && !session) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If logged in and trying to access auth pages, redirect to home
    const authRoutes = ['/login', '/signup']
    const isAuthRoute = authRoutes.some(route =>
        req.nextUrl.pathname === route
    )

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return res
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
