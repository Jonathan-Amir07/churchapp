import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [], // Populated dynamically in auth.ts
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id ?? '';
        token.role = user.role;
        token.username = user.username;
        token.avatarUrl = user.avatarUrl;
        token.locale = user.locale;
        token.totalXp = user.totalXp;
        token.totalPoints = user.totalPoints;
        token.currentLevel = user.currentLevel;
      }

      if (trigger === 'update' && session?.user) {
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string | undefined | null;
        session.user.avatarUrl = token.avatarUrl as string | null;
        session.user.locale = token.locale as string;
        session.user.totalXp = token.totalXp as number;
        session.user.totalPoints = token.totalPoints as number;
        session.user.currentLevel = token.currentLevel as any;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
