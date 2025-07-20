import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // For Firebase, middleware is often used for server-side session management,
  // but since we are in "fake data" mode, we will just keep it minimal.
  // The auth checks are disabled.

  const { pathname } = request.nextUrl;
  const currentUser = request.cookies.get('firebase-auth-token')?.value;

  // TEMPORARILY DISABLED: Redirect to login if not authenticated
  // if (!currentUser && pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // Redirect to dashboard if logged in and trying to access login
  if (currentUser && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}; 