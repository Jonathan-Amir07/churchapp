import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    let students;
    if (user.role === 'admin' || user.role === 'priest') {
      students = await prisma.user.findMany({
        where: { role: 'student' },
        include: {
          enrollments: {
            include: { class: true }
          },
          studentBadges: true,
        },
      });
    } else if (user.role === 'instructor') {
      // Instructors only see students in their classes
      const instructorClasses = await prisma.class.findMany({
        where: { instructorId: user.id },
        select: { id: true },
      });
      const classIds = instructorClasses.map((c: any) => c.id);

      students = await prisma.user.findMany({
        where: {
          role: 'student',
          enrollments: {
            some: {
              classId: { in: classIds }
            }
          }
        },
        include: {
          enrollments: {
            include: { class: true }
          },
          studentBadges: true,
        },
      });
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Format for the frontend
    const formattedStudents = students.map((s: any) => ({
      id: s.id,
      name: s.displayName || s.username,
      username: s.username,
      totalXp: s.totalXp,
      totalPoints: s.totalPoints,
      level: s.level,
      levelTitle: 'Seedling', // Logic can be expanded based on level
      badgesCount: s.studentBadges.length,
      lastActive: s.lastLogin ? s.lastLogin.toISOString() : 'Never',
    }));

    return NextResponse.json(formattedStudents);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
