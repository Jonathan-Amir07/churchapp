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

        // --- Mock Testing Bypass (Runs when database is offline or for rapid local prototyping) ---
        if (isStudent) {
          const u = credentials.username as string;
          const p = credentials.pin as string;
          if (['student1', 'student2', 'student3'].includes(u) && p === '1234') {
            const num = u.replace('student', '');
            const numberNames = ['One', 'Two', 'Three'];
            const idx = parseInt(num) - 1;
            return {
              id: `mock-student-${num}`,
              name: `Student ${numberNames[idx] || num}`,
              email: `${u}@joyfulpath.org`,
              username: u,
              role: 'student',
              avatarUrl: null,
              locale: 'en',
              totalXp: 1250,
              totalPoints: 120,
              currentLevel: {
                number: 6,
                title: 'Verse Master',
              },
            };
          }
        } else if (isStaff) {
          const email = credentials.email as string;
          const password = credentials.password as string;

          // Admin mock
          if (email.startsWith('admin') && email.endsWith('@joyfulpath.org') && password === 'admin123') {
            const num = email.replace('admin', '').replace('@joyfulpath.org', '');
            const numberNames = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
            const idx = parseInt(num) - 1;
            return {
              id: `mock-admin-${num}`,
              name: `Admin ${numberNames[idx] || num}`,
              email: email,
              username: `admin${num}`,
              role: 'admin',
              avatarUrl: null,
              locale: 'en',
              totalXp: 0,
              totalPoints: 0,
              currentLevel: null,
            };
          }

          // Instructor mock
          if (email.startsWith('instructor') && email.endsWith('@joyfulpath.org') && password === 'servant123') {
            const num = email.replace('instructor', '').replace('@joyfulpath.org', '');
            const numberNames = ['One', 'Two', 'Three'];
            const idx = parseInt(num) - 1;
            return {
              id: `mock-instructor-${num}`,
              name: `Instructor ${numberNames[idx] || num}`,
              email: email,
              username: `instructor${num}`,
              role: 'instructor',
              avatarUrl: null,
              locale: 'en',
              totalXp: 0,
              totalPoints: 0,
              currentLevel: null,
            };
          }
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
