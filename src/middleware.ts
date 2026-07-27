// src/middleware.ts
export { auth as middleware } from '@/auth';

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
