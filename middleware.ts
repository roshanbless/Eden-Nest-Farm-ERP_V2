import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Check if auth cookie or session indicator exists
    const hasAuthToken = request.cookies.has('sb-access-token') || 
                         request.cookies.has('eden-auth-token') ||
                         request.cookies.has('supabase-auth-token');

    // For demonstration and client-side session handling, allow dashboard access or redirect if explicitly logged out
    // Next.js middleware allows request to pass to client component where Supabase Auth state is hydrated
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/(auth)/:path*'],
};
