import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth, isAdmin } from '@/lib/rbac';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const { user } = session;
  if (!isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { nameEn, nameAr, gradeLevel, instructorId } = body;

    const dataToUpdate: any = {};
    if (nameEn) dataToUpdate.name = nameEn;
    if (nameAr) dataToUpdate.description = nameAr;
    if (gradeLevel) dataToUpdate.gradeLevel = gradeLevel;

    const updatedClass = await prisma.class.update({
      where: { id },
      data: dataToUpdate,
    });

    if (instructorId !== undefined) {
      // Remove existing instructor
      await prisma.classMember.deleteMany({
        where: { classId: id, role: 'instructor' }
      });
      
      // Add new one if provided
      if (instructorId) {
        await prisma.classMember.create({
          data: {
            classId: id,
            userId: instructorId,
            role: 'instructor'
          }
        });
      }
    }

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const { user } = session;
  if (!isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;

    // Soft delete
    await prisma.class.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}
