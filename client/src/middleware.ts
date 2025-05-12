import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on every request
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Log request path for debugging in Vercel
  console.log('Middleware processing path:', pathname);
  
  // Handle campaign routes based on path pattern
  // If it's a campaign route that has a username part but is missing the /campaign suffix
  if (pathname.match(/^\/[^\/]+\/[^\/]+$/) && !pathname.includes('_next') && !pathname.includes('favicon')) {
    console.log('Campaign route detected with username:', pathname);
    
    // Try to extract campaign name and username  
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 2) {
      const campaignName = parts[0];
      return NextResponse.redirect(new URL(`/${campaignName}`, request.url));
    }
  }
  
  // Return the response unchanged for all other requests
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all paths except static files, api routes, and Next.js internal routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
