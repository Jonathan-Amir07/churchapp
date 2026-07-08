import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { uploadFile, deleteFile, STORAGE_BUCKETS } from '@/lib/supabase/storage';

type Params = Promise<{ id: string }>;

/**
 * POST /api/lessons/[id]/upload - Upload attachment for lesson
 */
export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    if (lesson.createdBy !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload to Supabase
    const uploadResult = await uploadFile({
      bucket: 'lessons',
      path: `${id}/${Date.now()}-${file.name}`,
      file,
    });

    // Save attachment metadata
    const attachment = await prisma.lessonAttachment.create({
      data: {
        lessonId: id,
        fileName: uploadResult.filename,
        fileUrl: uploadResult.url,
        fileType: uploadResult.type,
        fileSize: uploadResult.size,
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/lessons/[id]/upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lessons/[id]/upload?attachmentId=X - Delete attachment
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const attachmentId = request.nextUrl.searchParams.get('attachmentId');
    if (!attachmentId) {
      return NextResponse.json(
        { error: 'attachmentId is required' },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    if (lesson.createdBy !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const attachment = await prisma.lessonAttachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      );
    }

    // Delete from storage
    await deleteFile('lessons', attachment.fileName.startsWith('http') ? new URL(attachment.fileUrl).pathname.slice(1) : `${id}/${attachment.fileName}`);

    // Delete from database
    await prisma.lessonAttachment.delete({ where: { id: attachmentId } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/lessons/[id]/upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete attachment' },
      { status: 500 }
    );
  }
}
