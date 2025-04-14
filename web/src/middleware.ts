import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLoggedInUser } from './services/userSession';
import { isProduction } from './lib/utils';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/hallinta')) {
    const loginUrl = new URL('/kirjaudu', request.url);

    try {
      const user = await getLoggedInUser();

      if ((!user || !user.labels.includes('admin')) && isProduction) {
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Middleware error', error);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/hallinta/:path*',
};
