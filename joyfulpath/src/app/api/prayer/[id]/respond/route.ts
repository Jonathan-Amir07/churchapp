import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { responderId, message } = body;

    const response = await prisma.prayerResponse.create({
      data: {
        prayerRequestId: id,
        responderId,
        message,
      },
    });

    await prisma.prayerRequest.update({
      where: { id },
      data: { isAddressed: true, addressedBy: responderId, addressedAt: new Date() },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to post response' }, { status: 500 });
  }
}
