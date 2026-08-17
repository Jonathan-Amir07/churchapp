'use client';

import { Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';

export default function QuizResultsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-[slide-up_0.4s_ease-out]">
      <div className="text-center space-y-2 mb-8">
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[48px]">workspace_premium</span>
        </div>
        <h1 className="text-3xl font-extrabold">Quiz Completed!</h1>
        <p className="text-on-surface-variant">Here is how you did on "Genesis Chapter 1"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-surface-container-lowest border border-outline-variant text-center">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Final Score</h3>
            <p className="text-4xl font-black text-success">85%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-container-lowest border border-outline-variant text-center">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">XP Earned</h3>
            <p className="text-4xl font-black text-primary">+85</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border border-outline-variant text-center">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Points Earned</h3>
            <p className="text-4xl font-black text-secondary">+17</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">Review Answers</h2>
        
        <Card className="border border-success/30 bg-success/5">
          <CardContent className="p-4 flex gap-4">
            <span className="material-symbols-outlined text-success mt-1">check_circle</span>
            <div>
              <p className="font-bold mb-1">1. Who built the ark?</p>
              <p className="text-sm text-on-surface-variant">Your answer: Noah <span className="text-success font-bold">(Correct)</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-error/30 bg-error/5">
          <CardContent className="p-4 flex gap-4">
            <span className="material-symbols-outlined text-error mt-1">cancel</span>
            <div>
              <p className="font-bold mb-1">2. God created the world in 5 days.</p>
              <p className="text-sm text-on-surface-variant mb-2">Your answer: True <span className="text-error font-bold">(Incorrect)</span></p>
              <div className="text-xs bg-surface-container p-2 rounded text-on-surface italic">
                Correct answer: False. God created the world in 6 days and rested on the 7th.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-500/30 bg-orange-50">
          <CardContent className="p-4 flex gap-4">
            <span className="material-symbols-outlined text-orange-500 mt-1">pending</span>
            <div>
              <p className="font-bold mb-1">3. Explain the rainbow covenant.</p>
              <p className="text-sm text-on-surface-variant mb-2">Your answer: It was a promise to never flood the earth again.</p>
              <div className="text-xs font-bold text-orange-700 bg-orange-100 p-2 rounded inline-block">
                Pending Manual Grading
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Link href="/student/quizzes">
          <Button variant="primary" className="px-8">Back to Quizzes</Button>
        </Link>
      </div>
    </div>
  );
}
