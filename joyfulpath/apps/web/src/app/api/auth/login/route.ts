import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json(
        { message: 'Missing username, password, or role' },
        { status: 400 }
      );
    }

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
      email: user.email,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange,
      name: user.displayName || user.firstName,
    };

    // Base64 encode for mock mode (as agreed in plan)
    const access_token = 'mock.' + Buffer.from(JSON.stringify(jwtPayload)).toString('base64') + '.signature';

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
