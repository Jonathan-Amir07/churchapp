import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;

    const rewards = await prisma.reward.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formatted = rewards.map((r: any) => ({
      id: r.id,
      title: r.titleEn,
      titleAr: r.titleAr,
      description: r.descriptionEn,
      descriptionAr: r.descriptionAr,
      pointsCost: r.pointsCost,
      stock: r.stockLevel,
      type: r.type,
      icon: r.imageUrl || 'emoji_events',
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;
    const user = session.user;
    if (user.role !== 'admin' && user.role !== 'priest') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, titleAr, description, descriptionAr, pointsCost, stock, type, icon } = body;

    if (!title || !titleAr || !description || !descriptionAr) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reward = await prisma.reward.create({
      data: {
        titleEn: title,
        titleAr: titleAr,
        descriptionEn: description,
        descriptionAr: descriptionAr,
        pointsCost: parseInt(pointsCost) || 50,
        stockLevel: parseInt(stock) || 10,
        type: type || 'digital',
        imageUrl: icon || 'emoji_events',
      }
    });

    return NextResponse.json(reward);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
