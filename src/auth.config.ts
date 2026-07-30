// src/auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  providers: [], // Middleware用には空配列（auth.ts 側でオーバーライドします）
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname === '/';

      if (!isOnLoginPage && !isLoggedIn) {
        const redirectUrl = new URL('/', nextUrl.origin);
        redirectUrl.searchParams.append('callbackUrl', nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      if (isOnLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl.origin));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;