// src/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { DEMO_USER_EMAIL, ensureDemoUserData } from '@/lib/demo-seed';
import { prisma } from '@/lib/prisma';

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      id: 'demo',
      name: 'Demo Login',
      credentials: {},
      async authorize() {
        const demoUser = await ensureDemoUserData(prisma);
        return {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.displayName,
          image: demoUser.avatarUrl ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'demo') {
        return user.email === DEMO_USER_EMAIL;
      }

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
    async jwt({ token, account, user }) {
      if (typeof user?.id === 'string') {
        token.userId = user.id;
      }

      if (account?.provider === 'google' && account.providerAccountId) {
        const dbUser = await prisma.user.findFirst({
          where: { providerAccountId: account.providerAccountId, deletedAt: null },
          select: { id: true },
        });
        const userId = dbUser?.id;
        if (userId) token.userId = userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.userId === 'string') session.user.id = token.userId;
      return session;
    },
  },
});