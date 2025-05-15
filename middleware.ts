import NextAuth from 'next-auth';
import type { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/(auth)/auth';
import authConfig from './app/(auth)/auth.config';
import { IsOwner } from './lib/is-owner';
import { IsTrainer } from './lib/is-trainer';
/**
 * Public routes that are accessible without authentication
 * @type {string[]}
 */
const publicRoutes: string[] = ['/', '/about', '/contact', '/pricing'];

/**
 * Prefix for all authentication-related API routes
 * @type {string}
 */
const ApiRoutesPrefix: string = '/api/auth';

/**
 * Routes used for authentication purposes (login/signup)
 * @type {string[]}
 */
const AuthRoutes: string[] = ['/signin', '/signup'];

/**
 * Protected routes that require authentication and specific roles
 * @type {string[]}
 */
const ProtectedRoutes: string[] = ['/dashboard', '/settings', '/profile'];

/**
 * Main middleware function to handle authentication and authorization
 */
export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const session = await auth();

	// Check authentication status
	const isLoggedIn = !!session;

	// Check route types
	const isApiRoute = pathname.startsWith(ApiRoutesPrefix);
	const isPublicRoute = publicRoutes.some((route) => pathname === route);
	const isAuthRoute = AuthRoutes.some((route) => pathname === route);
	const isProtectedRoute = ProtectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	// 1. API Routes - Always pass through
	if (isApiRoute) {
		return NextResponse.next();
	}

	// 2. Authentication Routes (signin/signup)
	if (isAuthRoute) {
		// Allow access to auth routes if not logged in
		return NextResponse.next();
	}

	// 3. Public Routes - Always accessible
	if (isPublicRoute) {
		return NextResponse.next();
	}

	// 4. Protected Routes - Requires authentication
	if (isProtectedRoute) {
		// Not logged in - redirect to signin
		if (!isLoggedIn || !session) {
			const redirectUrl = new URL('/signin', request.url);
			redirectUrl.searchParams.set('callbackUrl', request.url);
			return NextResponse.redirect(redirectUrl);
		}

		// If authenticated and accessing a protected route, allow access
		// Specific dashboard/role logic will be handled in the layout/page components
		return NextResponse.next();
	}

	// 5. Default behavior - allow access to any other routes
	return NextResponse.next();
}

/**
 * Matcher configuration for the middleware
 * Excludes specific paths from middleware processing
 */
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|verify|verify-request|.*\\..*).*)'],
};
