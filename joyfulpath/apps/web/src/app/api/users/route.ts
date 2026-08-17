import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireRole, USER_MANAGEMENT_ROLES } from '@/lib/rbac';

/**
 * GET /api/users - List all users
 * Only priest and admin can list all users.
 */
export async function GET(req: NextRequest) {
  const session = await requireRole(USER_MANAGEMENT_ROLES);
  if (session instanceof NextResponse) return session;

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

/**
 * POST /api/users - Create a new user
 * Only priest and admin can create users.
 */
export async function POST(req: NextRequest) {
  const session = await requireRole(USER_MANAGEMENT_ROLES);
  if (session instanceof NextResponse) return session;

  try {
    const body = await req.json();
    const { name, usernameOrEmail, passwordOrPin, role } = body;

    if (!name || !usernameOrEmail || !passwordOrPin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only priest can create priest or admin accounts
    if ((role === 'priest' || role === 'admin') && session.user.role !== 'priest') {
      return NextResponse.json(
        { error: 'Forbidden: only a Priest can create admin/priest accounts' },
        { status: 403 }
      );
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
