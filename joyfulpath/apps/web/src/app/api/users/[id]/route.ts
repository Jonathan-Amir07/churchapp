import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireRole, USER_MANAGEMENT_ROLES } from '@/lib/rbac';

/**
 * PUT /api/users/[id] - Update a user
 * Only priest and admin can update users.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(USER_MANAGEMENT_ROLES);
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, usernameOrEmail, role, isActive, passwordOrPin } = body;

    // Prevent role escalation: only priest can assign priest/admin roles
    if ((role === 'priest' || role === 'admin') && session.user.role !== 'priest') {
      return NextResponse.json(
        { error: 'Forbidden: only a Priest can assign admin/priest roles' },
        { status: 403 }
      );
    }

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

/**
 * DELETE /api/users/[id] - Delete a user
 * Only priest and admin can delete users.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(USER_MANAGEMENT_ROLES);
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await params;

    // Prevent self-deletion
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
