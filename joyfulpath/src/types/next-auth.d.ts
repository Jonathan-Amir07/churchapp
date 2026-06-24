import NextAuth, { type DefaultSession, type DefaultUser } from 'next-auth';
import { type JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: string;
    username?: string | null;
    avatarUrl?: string | null;
    locale: string;
    totalXp: number;
    totalPoints: number;
    currentLevel?: {
      number: number;
      title: string;
    } | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      username?: string | null;
      avatarUrl?: string | null;
      locale: string;
      totalXp: number;
      totalPoints: number;
      currentLevel?: {
        number: number;
        title: string;
      } | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    username?: string | null;
    avatarUrl?: string | null;
    locale: string;
    totalXp: number;
    totalPoints: number;
    currentLevel?: {
      number: number;
      title: string;
    } | null;
  }
}
