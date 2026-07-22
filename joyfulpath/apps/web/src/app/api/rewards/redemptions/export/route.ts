import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

function toCsv(rows: any[], headers: string[]) {
  const lines = [headers.join(',')];
  for (const r of rows) {
    const vals = headers.map((h) => {
      const v = r[h] ?? '';
      const s = typeof v === 'string' ? v.replace(/"/g, '""') : String(v);
      return `"${s}"`;
    });
    lines.push(vals.join(','));
  }
  return lines.join('\n');
}

export async function GET() {
  try {
    const redemptions = await prisma.rewardRedemption.findMany({
      where: { status: 'pending' },
      include: { reward: true, user: true },
      orderBy: { requestedAt: 'desc' },
    });

    const rows = redemptions.map((r: any) => ({
      id: r.id,
      userEmail: r.user?.email ?? '',
      userId: r.userId,
      rewardTitle: r.reward?.title ?? '',
      rewardId: r.rewardId,
      requestedAt: r.requestedAt.toISOString(),
      status: r.status,
    }));

    const csv = toCsv(rows, ['id', 'userEmail', 'userId', 'rewardTitle', 'rewardId', 'requestedAt', 'status']);

    return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="redemptions_pending.csv"' } });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to export redemptions' }, { status: 500 });
  }
}
