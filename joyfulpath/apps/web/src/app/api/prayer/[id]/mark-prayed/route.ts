import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { addressedBy } = body;

    const updated = await prisma.prayerRequest.update({
      where: { id },
      data: { isAddressed: true, addressedBy, addressedAt: new Date() },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to mark prayed' }, { status: 500 });
  }
}
