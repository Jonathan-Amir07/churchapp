import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, usernameOrEmail, role, isActive, passwordOrPin } = body;

    const dataToUpdate: any = {};

    if (name) {
      dataToUpdate.firstName = name.split(' ')[0] || name;
      dataToUpdate.lastName = name.split(' ').slice(1).join(' ') || '';
      dataToUpdate.displayName = name;
    }

    if (usernameOrEmail) {
      const isEmail = usernameOrEmail.includes('@');
      dataToUpdate.email = isEmail ? usernameOrEmail : null;
      dataToUpdate.username = !isEmail ? usernameOrEmail : null;
    }

    if (role) dataToUpdate.role = role;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    if (passwordOrPin) {
      dataToUpdate.passwordHash = await bcrypt.hash(passwordOrPin, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.displayName,
      usernameOrEmail: updatedUser.email || updatedUser.username || '',
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
