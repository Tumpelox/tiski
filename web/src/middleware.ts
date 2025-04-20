import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLoggedInUser } from './services/userSession';
import isAdmin from './lib/isAdmin';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/hallinta')) {
    const loginUrl = new URL('/kirjaudu', request.url);

    try {
      const user = await getLoggedInUser();

      if (!isAdmin(user)) {
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Middleware error', error);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (request.nextUrl.pathname === '/kirjaudu') {
    const user = await getLoggedInUser();
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/hallinta/:path*', '/kirjaudu'],
};
