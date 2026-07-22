// src/app/api/attendance/scan/route.ts
// MOCK: attendance scan API — no real DB used.
// See waiting_database.md > Phase 5 for migration guide.

import { NextRequest, NextResponse } from 'next/server';

// ── In-memory store for duplicate prevention (per server process restart) ──
// MOCK: replace with DB query on real migration
const checkedInToday = new Map<string, string>(); // studentId → timestamp

// Helper — date string like "2026-06-29"
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, scannedBy } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Missing studentId in request body.' },
        { status: 400 }
      );
    }

    const today = todayStr();
    const dupKey = `${studentId}::${today}`;

    // ── MOCK: Duplicate check (in-memory per process) ──────────────────────
    // REAL DB: SELECT id FROM attendance WHERE user_id=studentId AND date=today
    if (checkedInToday.has(dupKey)) {
      return NextResponse.json(
        {
          success: false,
          alreadyCheckedIn: true,
          error: 'Student already checked in today.',
          checkedInAt: checkedInToday.get(dupKey),
        },
        { status: 409 }
      );
    }

    // ── MOCK: Simulate known students ──────────────────────────────────────
    // REAL DB: SELECT * FROM user_profiles WHERE id=studentId AND role='student'
    const MOCK_STUDENTS: Record<string, { name: string; streak: number; xp: number }> = {
      'mock-student-id': { name: 'Jonathan Junior', streak: 5, xp: 1250 },
      'mock-student2-id': { name: 'Mary Grace', streak: 2, xp: 780 },
    };

    const student = MOCK_STUDENTS[studentId];
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Unknown student ID. QR code is not valid.' },
        { status: 404 }
      );
    }

    // ── MOCK: Insert attendance record ─────────────────────────────────────
    // REAL DB: INSERT INTO attendance (user_id, date, status, notes) VALUES (studentId, today, 'present', '')
    const checkInTime = new Date().toISOString();
    checkedInToday.set(dupKey, checkInTime);

    // ── MOCK: XP reward for attendance (+50 XP) ────────────────────────────
    // REAL DB: UPDATE user_profiles SET total_xp = total_xp + 50, current_streak = current_streak + 1 WHERE id = studentId
    const xpAwarded = 50;
    const newStreak = student.streak + 1;

    return NextResponse.json({
      success: true,
      studentId,
      studentName: student.name,
      date: today,
      checkInTime,
      xpAwarded,
      newStreak,
      message: `${student.name} checked in successfully! +${xpAwarded} XP`,
    });
  } catch (err) {
    console.error('[attendance/scan] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
