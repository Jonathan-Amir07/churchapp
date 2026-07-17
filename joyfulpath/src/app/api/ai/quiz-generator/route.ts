import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'instructor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, difficulty, questionCount } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Mock AI Response generation
    const mockQuestions = Array.from({ length: questionCount || 5 }).map((_, i) => ({
      questionText: `Generated question ${i + 1} about ${topic} (${difficulty})`,
      options: [
        { text: 'Option A', isCorrect: true },
        { text: 'Option B', isCorrect: false },
        { text: 'Option C', isCorrect: false },
        { text: 'Option D', isCorrect: false },
      ],
      explanation: 'AI generated explanation here.'
    }));

    return NextResponse.json({
      success: true,
      data: {
        title: `AI Generated Quiz: ${topic}`,
        questions: mockQuestions
      }
    });

  } catch (error) {
    console.error('AI Quiz Generator Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
