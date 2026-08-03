import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth, isAdmin, getInstructorClassIds } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const { user } = session;

  try {
    let classes;
    if (isAdmin(user.role)) {
      // Admins/Priests see all classes
      classes = await prisma.class.findMany({
        where: { deletedAt: null },
        include: {
          members: {
            where: { role: 'instructor', isActive: true },
            include: { user: true }
          },
          _count: {
            select: { members: { where: { role: 'student', isActive: true } } }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (user.role === 'instructor') {
      // Instructors see only their assigned classes
      const assignedClassIds = await getInstructorClassIds(user.id);
      classes = await prisma.class.findMany({
        where: { id: { in: assignedClassIds }, deletedAt: null },
        include: {
          members: {
            where: { role: 'instructor', isActive: true },
            include: { user: true }
          },
          _count: {
            select: { members: { where: { role: 'student', isActive: true } } }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Parents and Students should probably use a different endpoint or get a restricted view
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formattedClasses = classes.map((c: any) => ({
      id: c.id,
      nameEn: c.name, // The db just has 'name' and 'description'
      nameAr: c.description || c.name, // Using description for arabic name temporarily
      instructorName: c.members[0]?.user?.displayName || 'Unassigned',
      studentsCount: c._count.members,
      gradeLevel: c.gradeLevel || 'N/A'
    }));

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  const { user } = session;

  if (!isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { nameEn, nameAr, gradeLevel, instructorId } = body;

    if (!nameEn) {
      return NextResponse.json({ error: 'Missing class name' }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        name: nameEn,
        description: nameAr,
        gradeLevel: gradeLevel || 'Grades 1-3',
        academicYear: new Date().getFullYear().toString(),
        createdBy: user.id,
      }
    });

    if (instructorId) {
       await prisma.classMember.create({
         data: {
           classId: newClass.id,
           userId: instructorId,
           role: 'instructor'
         }
       });
    }

    return NextResponse.json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}
