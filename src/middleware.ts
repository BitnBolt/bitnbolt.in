import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply CORS to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Get the origin from the request headers
    const origin = request.headers.get('origin') || '';
    
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3002', // admin frontend
      'http://localhost:3001', // Vendor frontend
      'http://localhost:3000', // Main frontend
      'https://admin.bitnbolt.in', // Production admin domain
      'https://vendor.bitnbolt.in', // Production vendor domain
      'https://bitnbolt.in', // Production main domain
    ];
    

    // Check if the origin is allowed
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // Create response headers
    const headers = {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // 24 hours
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers,
      });
    }

    // For non-OPTIONS requests, continue with the request but add CORS headers
    const response = NextResponse.next();
    
    // Apply CORS headers to the response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // For non-API routes, continue normally
  return NextResponse.next();
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
}; 