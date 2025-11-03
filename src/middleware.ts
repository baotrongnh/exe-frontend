import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip middleware for static files, api routes, and public assets
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/images') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Public routes that don't need authentication
    const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/auth/callback']
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

    if (isPublicRoute) {
        return NextResponse.next()
    }

    // All other routes will be protected by their respective layouts
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
