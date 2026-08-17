import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock saints data for the public API
    const saints = [
      { id: '1', name: 'St. Mark the Apostle', nameAr: 'القديس مارمرقس الرسول', title: 'The Evangelist', titleAr: 'الإنجيلي' },
      { id: '2', name: 'St. George', nameAr: 'القديس مارجرجس', title: 'The Prince of Martyrs', titleAr: 'أمير الشهداء' },
      { id: '3', name: 'St. Mary of Egypt', nameAr: 'القديسة مريم المصرية', title: 'The Ascetic', titleAr: 'السائحة' },
    ];

    return NextResponse.json({ success: true, data: saints.slice(0, limit) });
  } catch (error) {
    console.error('Saints API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    return NextResponse.json({ success: true, message: 'Saint profile created successfully', data });
  } catch (error) {
    console.error('Saints POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
