import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireRole, USER_MANAGEMENT_ROLES, requireAuth } from '@/lib/rbac';

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

/**
 * GET /api/users/[id] - Get a user profile
 * Role-based access:
 * - Admin/Priest: Can view anyone
 * - Instructor: Can view only students assigned to them
 * - Parent: Can view only their own children
 * - Student: Can view only themselves
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await params;
    const { user } = session;

    // RBAC Check
    if (user.role !== 'admin' && user.role !== 'priest') {
      let isAllowed = false;

      if (user.role === 'student' && user.id === id) {
        isAllowed = true;
      } else if (user.role === 'instructor') {
        // Instructors can only view students in their classes
        // In a real app we'd use `verifyStudentAccess` from rbac.ts.
        // I will implement a quick db check here or import verifyStudentAccess.
        const { verifyStudentAccess } = await import('@/lib/rbac');
        isAllowed = await verifyStudentAccess(user.id, user.role, id);
      } else if (user.role === 'parent') {
        const { verifyParentChildAccess } = await import('@/lib/rbac');
        isAllowed = await verifyParentChildAccess(user.id, id);
      }

      if (!isAllowed) {
        return NextResponse.json(
          { error: 'Forbidden: You do not have permission to view this profile' },
          { status: 403 }
        );
      }
    }

    const fetchedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        parentChildren: {
          include: { parent: true, child: true }
        },
        classMemberships: {
          include: { class: true }
        }
      }
    });

    if (!fetchedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Omit sensitive data
    const { passwordHash, ...safeUser } = fetchedUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
