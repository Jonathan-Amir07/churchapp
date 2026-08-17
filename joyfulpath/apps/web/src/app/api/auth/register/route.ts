import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, email, firstName, lastName, role } = body;

    if (!username || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: email || undefined }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Username or email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const displayName = `${firstName} ${lastName}`;

    const user = await prisma.user.create({
      data: {
        username,
        email: email || null,
        passwordHash,
        firstName,
        lastName,
        displayName,
        role,
        forcePasswordChange: false, // New users registering don't need to be forced to change
      }
    });

    // Automatically log them in by creating a JWT
    const jwtPayload = {
      id: user.id,
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange,
      name: user.displayName,
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
        name: user.displayName,
      }
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
