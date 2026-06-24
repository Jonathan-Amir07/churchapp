import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        pin: { label: 'PIN', type: 'password' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const isStudent = !!credentials.username && !!credentials.pin;
        const isStaff = !!credentials.email && !!credentials.password;

        if (!isStudent && !isStaff) {
          return null;
        }

        try {
          if (isStudent) {
            const student = await prisma.user.findFirst({
              where: {
                username: credentials.username as string,
                role: 'student',
              },
              include: {
                currentLevel: true,
              },
            });

            if (!student || !student.pinHash || !student.isActive) {
              return null;
            }

            const pinMatch = await bcrypt.compare(credentials.pin as string, student.pinHash);
            if (!pinMatch) return null;

            return {
              id: student.id,
              name: student.displayName,
              email: student.email,
              username: student.username,
              role: student.role,
              avatarUrl: student.avatarUrl,
              locale: student.locale,
              totalXp: student.totalXp,
              totalPoints: student.totalPoints,
              currentLevel: student.currentLevel ? {
                number: student.currentLevel.levelNumber,
                title: student.currentLevel.title,
              } : null,
            };
          } else {
            const staff = await prisma.user.findFirst({
              where: {
                email: credentials.email as string,
                role: { in: ['admin', 'instructor'] },
              },
            });

            if (!staff || !staff.passwordHash || !staff.isActive) {
              return null;
            }

            const passwordMatch = await bcrypt.compare(credentials.password as string, staff.passwordHash);
            if (!passwordMatch) return null;

            return {
              id: staff.id,
              name: staff.displayName,
              email: staff.email,
              username: staff.username,
              role: staff.role,
              avatarUrl: staff.avatarUrl,
              locale: staff.locale,
              totalXp: staff.totalXp,
              totalPoints: staff.totalPoints,
              currentLevel: null,
            };
          }
        } catch (error) {
          console.error('Auth authorize error:', error);
          return null;
        }
      },
    }),
  ],
});
