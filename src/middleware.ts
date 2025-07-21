import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  
  // Using a more reliable way to get the token, directly from the request cookies
  const currentUserCookie = request.cookies.get('firebase-auth-token');
  const currentUser = currentUserCookie ? currentUserCookie.value : undefined;

  // Redirect to login if not authenticated and trying to access dashboard
  if (!currentUser && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Pass redirect path
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged in and trying to access login page
  if (currentUser && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}; 