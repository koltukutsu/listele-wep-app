import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the firebase auth token from cookies
  const authCookie = request.cookies.get('firebase-auth-token');
  const isAuthenticated = !!authCookie?.value;

  // Define protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/onboarding') ||
                          pathname === '/profile';
  
  // Define auth routes (should redirect if already authenticated)
  const isAuthRoute = pathname === '/login' || pathname === '/auth/callback';

  // Redirect to login if not authenticated and trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if authenticated and trying to access auth routes
  if (isAuthenticated && isAuthRoute) {
    const redirectPath = request.nextUrl.searchParams.get('redirect');
    const dashboardUrl = new URL(redirectPath || '/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/onboarding/:path*',
    '/profile/:path*',
    '/auth/:path*'
  ],
}; 