import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const envUrl = process.env.DATABASE_URL;
    const users = await prisma.user.findMany({ take: 1 });
    return NextResponse.json({ success: true, envUrl, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, envUrl: process.env.DATABASE_URL, error: error.message, stack: error.stack });
  }
}
