import { NextRequest } from 'next/server';
import { np } from './app/api/next-protect';

export const middleware = async (req: NextRequest) => np.middleware(req);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
