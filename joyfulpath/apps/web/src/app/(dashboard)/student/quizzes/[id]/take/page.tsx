'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Button, ProgressBar } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function TakeQuizPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    { type: 'MCQ', text: 'Who built the ark?', options: ['Moses', 'Noah', 'Abraham', 'David'] },
    { type: 'TF', text: 'God created the world in 6 days.', options: ['True', 'False'] },
    { type: 'SHORT', text: 'Explain the rainbow covenant.' }
  ];

  const handleSubmit = () => {
    alert('Quiz submitted successfully!');
    router.push('/student/quizzes/1/results');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const q = questions[currentQuestion];

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-[slide-up_0.4s_ease-out]">
      <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm sticky top-4 z-10">
        <h1 className="font-extrabold text-lg">Genesis Chapter 1</h1>
        <div className={`flex items-center gap-2 font-bold px-3 py-1.5 rounded-lg ${timeLeft < 60 ? 'bg-error/10 text-error animate-pulse' : 'bg-surface-container'}`}>
          <span className="material-symbols-outlined text-[18px]">timer</span>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-2">
        {questions.map((_, idx) => (
          <div key={idx} className={`flex-1 h-2 rounded-full ${idx <= currentQuestion ? 'bg-primary' : 'bg-surface-container-high'}`} />
        ))}
      </div>

      <Card className="border border-outline-variant bg-surface-container-lowest min-h-[300px]">
        <CardContent className="p-8 space-y-6">
          <div className="text-sm font-bold text-primary uppercase tracking-wider">Question {currentQuestion + 1} of {questions.length}</div>
          <h2 className="text-xl font-bold">{q.text}</h2>

          {q.type !== 'SHORT' ? (
            <div className="space-y-3 pt-4">
              {q.options?.map((opt, idx) => (
                <label key={idx} className="block p-4 border border-outline-variant rounded-xl hover:bg-primary/5 hover:border-primary cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <input type="radio" name={`q${currentQuestion}`} className="w-5 h-5 text-primary" />
                    <span className="font-medium text-on-surface">{opt}</span>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="pt-4">
              <textarea rows={6} className="w-full p-4 border border-outline-variant rounded-xl bg-surface focus:border-primary" placeholder="Type your answer here..." />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))} disabled={currentQuestion === 0}>
          Previous
        </Button>
        {currentQuestion === questions.length - 1 ? (
          <Button variant="primary" className="px-8" onClick={handleSubmit}>Submit Quiz</Button>
        ) : (
          <Button variant="primary" onClick={() => setCurrentQuestion(p => Math.min(questions.length - 1, p + 1))}>
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
}
