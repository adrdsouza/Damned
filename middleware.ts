// middleware.ts
import { NextResponse } from 'next/server';

export async function middleware(request: Request) {
  const sessionToken = request.headers.get('woocommerce-session');

  // Ensure the session token is present
  if (!sessionToken) {
    return new NextResponse('Unauthorized access', { status: 401 });
  }

  // Verify session token by calling your session endpoint
  const sessionResponse = await fetch(
    `${process.env.FRONTEND_URL}/api/session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken }),
    }
  );

  if (!sessionResponse.ok) {
    return new NextResponse('Invalid session token', { status: 401 });
  }

  const sessionData = await sessionResponse.json();

  if (!sessionData || !sessionData.sessionToken) {
    return new NextResponse('Unauthorized access', { status: 401 });
  }

  // Continue to the process-nmi route if token is valid

  return NextResponse.next();
}

// Apply middleware only to the specific route
export const config = {
  matcher: ['/api/process-nmi'],
};
