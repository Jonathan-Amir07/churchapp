import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  requireAuth,
  verifyClassAccess,
  verifyParentChildAccess,
  isAdmin,
  type AuthSession,
} from '@/lib/rbac';

export async function POST(req: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const body = await req.json();
    const { studentId, classId, type, title, body: message, isPrivate } = body;

    const targetStudentId = studentId || session.user.id;

    if (session.user.role === 'student' && targetStudentId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied: can only create prayer requests for yourself' }, { status: 403 });
    }

    if (session.user.role === 'parent') {
      const isChild = await verifyParentChildAccess(session.user.id, targetStudentId);
      if (!isChild) {
        return NextResponse.json({ error: 'Access denied: student is not your child' }, { status: 403 });
      }
    }

    const prayer = await prisma.prayerRequest.create({
      data: {
        studentId: targetStudentId,
        classId: classId || null,
        type: type || 'personal',
        title,
        body: message,
        isPrivate: !!isPrivate,
      },
    });

    return NextResponse.json(prayer, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create prayer request' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const session = result as AuthSession;

  try {
    const url = new URL(req.url);
    const classId = url.searchParams.get('classId');
    const studentId = url.searchParams.get('studentId');

    const where: any = {};
    if (classId) where.classId = classId;
    if (studentId) where.studentId = studentId;

    if (session.user.role === 'student') {
      where.OR = [
        { studentId: session.user.id },
        { isPrivate: false },
      ];
    } else if (session.user.role === 'parent') {
      if (studentId) {
        const isChild = await verifyParentChildAccess(session.user.id, studentId);
        if (!isChild) {
          return NextResponse.json({ error: 'Access denied: student is not your child' }, { status: 403 });
        }
      }
    } else if (session.user.role === 'instructor') {
      if (classId) {
        const hasAccess = await verifyClassAccess(session.user.id, session.user.role, classId);
        if (!hasAccess) {
          return NextResponse.json({ error: 'Access denied: not assigned to this class' }, { status: 403 });
        }
      }
    }

    const prayers = await prisma.prayerRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(prayers);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch prayer requests' }, { status: 500 });
  }
}
