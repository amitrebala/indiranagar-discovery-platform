import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page and API routes
    if (request.nextUrl.pathname === '/admin/login' || 
        request.nextUrl.pathname.startsWith('/api/admin/')) {
      return NextResponse.next();
    }
    
    // Check for auth token
    const token = request.cookies.get('admin-token');
    
    if (!token) {
      // Redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Token verification will be done in the layout
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};