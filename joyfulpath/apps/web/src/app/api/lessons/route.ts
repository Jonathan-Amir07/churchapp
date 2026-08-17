import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (classId) {
      whereClause.classId = classId;
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Role-based restrictions
    if (user.role === 'instructor') {
      // Instructors can only view lessons for classes they instruct
      const instructorClasses = await prisma.class.findMany({
        where: { instructorId: user.id },
        select: { id: true }
      });
      const classIds = instructorClasses.map((c: any) => c.id);
      
      if (classId && !classIds.includes(classId)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      whereClause.classId = { in: classIds, ...whereClause.classId };
    } else if (user.role === 'student' || user.role === 'parent') {
      // Students/Parents should only see published lessons
      whereClause.status = 'published';
      // Restrict to their enrolled classes
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: user.role === 'student' ? user.id : undefined }, // Parent logic could be expanded
        select: { classId: true }
      });
      const classIds = enrollments.map((e: any) => e.classId);
      whereClause.classId = { in: classIds, ...whereClause.classId };
    }

    const lessons = await prisma.lesson.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { progress: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ lessons });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'admin' && user.role !== 'priest' && user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, content, status, xpReward, pointsReward, classId } = body;

    if (!title || !content || !classId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (user.role === 'instructor') {
      const classCheck = await prisma.class.findUnique({ where: { id: classId } });
      if (!classCheck || classCheck.instructorId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        status: status || 'draft',
        xpReward: parseInt(xpReward) || 0,
        pointsReward: parseInt(pointsReward) || 0,
        classId
      }
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
