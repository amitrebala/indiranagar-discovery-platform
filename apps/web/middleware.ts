import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED - All admin routes are now public
  // Remove this to re-enable authentication
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};