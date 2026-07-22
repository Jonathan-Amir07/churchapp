import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Mock response for now, in a real scenario we'd query the Synaxarium model
    // const reading = await prisma.synaxarium.findFirst({ where: { date } });
    
    const mockReading = {
      date,
      title: 'Departure of St. John the Baptist',
      titleAr: 'نياحة القديس يوحنا المعمدان',
      content: 'On this day, St. John the Baptist, the forerunner and baptizer of our Lord Jesus Christ, was martyred by Herod the King.',
      contentAr: 'في مثل هذا اليوم استشهد القديس يوحنا المعمدان، السابق والصابغ لربنا يسوع المسيح، على يد هيرودس الملك.',
    };

    return NextResponse.json({ success: true, data: mockReading });
  } catch (error) {
    console.error('Synaxarium API Error:', error);
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
    
    // In a real scenario, we'd save to DB
    // const newReading = await prisma.synaxarium.create({ data });

    return NextResponse.json({ success: true, message: 'Reading added successfully', data });
  } catch (error) {
    console.error('Synaxarium POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
