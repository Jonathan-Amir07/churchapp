import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // In a real scenario, fetch messages for this user
    const mockMessages = [
      { id: '1', senderId: 'inst_1', receiverId: session.user.id, content: 'Welcome to the new semester!', createdAt: new Date() },
    ];

    return NextResponse.json({ success: true, data: mockMessages });
  } catch (error) {
    console.error('Messages API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { receiverId, content } = await req.json();
    if (!receiverId || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // In a real scenario, create message
    // const message = await prisma.message.create({ data: { senderId: session.user.id, receiverId, content } });

    return NextResponse.json({ success: true, message: 'Message sent', data: { receiverId, content } });
  } catch (error) {
    console.error('Messages POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
