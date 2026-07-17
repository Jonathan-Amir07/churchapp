import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'instructor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonText } = await req.json();

    if (!lessonText) {
      return NextResponse.json({ error: 'Lesson text is required' }, { status: 400 });
    }

    // Mock AI Response generation
    const mockSummary = "This is an AI-generated summary of the provided lesson text. It highlights the main points and key takeaways for students.";

    return NextResponse.json({
      success: true,
      data: {
        summary: mockSummary,
        keyPoints: [
          'First key point extracted by AI.',
          'Second important concept from the lesson.',
          'A spiritual reflection or application.'
        ]
      }
    });

  } catch (error) {
    console.error('AI Lesson Summary Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
