import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json(
        { message: 'Missing username, password, or role' },
        { status: 400 }
      );
    }

    // --- MOCK TEST ACCOUNTS ---
    // Added to allow immediate testing of the UI without needing a populated database
    const testAccounts: Record<string, string> = {
      'test_student': 'student',
      'test_parent': 'parent',
      'test_instructor': 'instructor',
      'test_admin': 'admin',
      'test_priest': 'priest'
    };

    if (testAccounts[username] && password === 'password123') {
      const mockRole = testAccounts[username];
      const jwtPayload = {
        id: `mock-${mockRole}-id`,
        sub: `mock-${mockRole}-id`,
        username: username,
        email: `${username}@joyfulpath.com`,
        role: mockRole,
        forcePasswordChange: false,
        name: `Test ${mockRole.charAt(0).toUpperCase() + mockRole.slice(1)}`,
      };

      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key');
      const alg = 'HS256';
      
      const access_token = await new SignJWT(jwtPayload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);

      return NextResponse.json({
        access_token,
        user: jwtPayload
      });
    }
    // ---------------------------

    // Find user in the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ],
        role: role,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials or user not active' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Construct a JWT payload to encode
    const jwtPayload = {
      id: user.id,
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange,
      name: user.displayName || user.firstName,
    };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key');
    const alg = 'HS256';

    const access_token = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret);

    return NextResponse.json({
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        forcePasswordChange: user.forcePasswordChange,
        name: user.displayName || user.firstName,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
