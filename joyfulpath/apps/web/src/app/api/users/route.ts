import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format for frontend
    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.displayName || `${user.firstName} ${user.lastName}`.trim(),
      usernameOrEmail: user.email || user.username || '',
      role: user.role,
      isActive: user.isActive,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, usernameOrEmail, passwordOrPin, role } = body;

    if (!name || !usernameOrEmail || !passwordOrPin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isEmail = usernameOrEmail.includes('@');
    const email = isEmail ? usernameOrEmail : null;
    const username = !isEmail ? usernameOrEmail : null;

    const hashedPassword = await bcrypt.hash(passwordOrPin, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        displayName: name,
        email,
        username,
        role: role || 'student',
        passwordHash: hashedPassword,
        isActive: true,
      },
    });

    return NextResponse.json({
      id: newUser.id,
      name: newUser.displayName,
      usernameOrEmail: newUser.email || newUser.username || '',
      role: newUser.role,
      isActive: newUser.isActive,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
