import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google' || !user.email || !account.providerAccountId) return false;
      const existing = await prisma.user.findFirst({
        where: { providerAccountId: account.providerAccountId },
        select: { id: true, deletedAt: true },
      });
      if (existing) return existing.deletedAt === null;
      const emailMatch = await prisma.user.findFirst({
        where: { email: user.email, deletedAt: null },
        select: { id: true, providerAccountId: true },
      });
      if (emailMatch && emailMatch.providerAccountId !== account.providerAccountId) return false;
      await prisma.user.create({
        data: {
          email: user.email,
          authProvider: 'GOOGLE',
          providerAccountId: account.providerAccountId,
          displayName: user.name ?? user.email.split('@')[0],
          avatarUrl: user.image,
        },
      });
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === 'google' && account.providerAccountId) {
        const user = await prisma.user.findFirst({
          where: { providerAccountId: account.providerAccountId, deletedAt: null },
          select: { id: true },
        });
        const userId = user?.id;
        if (userId) token.userId = userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.userId === 'string') session.user.id = token.userId;
      return session;
    },
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
  pages: { signIn: '/' },
});
