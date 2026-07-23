import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import { uuidv7 } from '@/lib/uuidv7';

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
          id: uuidv7(),
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
  },
  pages: { signIn: '/' },
});
