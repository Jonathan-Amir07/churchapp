import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    // Only instructors/admins/priests can scan/record attendance
    if (user.role === 'student' || user.role === 'parent') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Missing studentId in request body.' },
        { status: 400 }
      );
    }

    const today = new Date(todayStr() + 'T00:00:00.000Z');

    // Duplicate check
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: studentId,
        date: today
      }
    });

    if (existingAttendance) {
      return NextResponse.json(
        {
          success: false,
          alreadyCheckedIn: true,
          error: 'Student already checked in today.',
          checkedInAt: existingAttendance.date,
        },
        { status: 409 }
      );
    }

    // Verify student exists
    const student = await prisma.user.findFirst({
      where: { id: studentId, role: 'student' }
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Unknown student ID. QR code is not valid.' },
        { status: 404 }
      );
    }

    // Insert attendance record
    const checkInTime = new Date();
    await prisma.attendance.create({
      data: {
        userId: studentId,
        date: today,
        status: 'present',
        notes: `Scanned by ${user.name || user.id}`
      }
    });

    // XP reward for attendance (+50 XP)
    const xpAwarded = 50;
    const newStreak = student.currentStreak + 1;

    await prisma.user.update({
      where: { id: studentId },
      data: {
        totalXp: student.totalXp + xpAwarded,
        totalPoints: student.totalPoints + 10,
        currentStreak: newStreak,
        longestStreak: Math.max(student.longestStreak, newStreak)
      }
    });

    return NextResponse.json({
      success: true,
      studentId,
      studentName: student.displayName,
      date: todayStr(),
      checkInTime,
      xpAwarded,
      newStreak,
      message: `${student.displayName} checked in successfully! +${xpAwarded} XP`,
    });
  } catch (err: any) {
    console.error('[attendance/scan] Error:', err);
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: err.message }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
