'use client';

import { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function QuizBuilderPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);

  const handleAddMCQ = () => {
    setQuestions([...questions, { type: 'MCQ', text: '', options: ['', ''], answer: 0 }]);
  };

  const handleAddTF = () => {
    setQuestions([...questions, { type: 'TF', text: '', answer: true }]);
  };

  const handleAddShort = () => {
    setQuestions([...questions, { type: 'SHORT', text: '' }]);
  };

  const handlePublish = () => {
    alert('Quiz Published!');
    router.push('/instructor/classes/123'); // back to class hub
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-[slide-up_0.4s_ease-out]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">build</span>
          Quiz Builder
        </h1>
        <Button variant="success" onClick={handlePublish}>Publish Quiz</Button>
      </div>

      <div className="flex gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={handleAddMCQ}>+ Add Multiple Choice</Button>
        <Button variant="outline" size="sm" onClick={handleAddTF}>+ Add True/False</Button>
        <Button variant="outline" size="sm" onClick={handleAddShort}>+ Add Short Answer</Button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 && (
          <div className="p-8 text-center text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-xl">
            No questions added yet. Start building your quiz!
          </div>
        )}
        {questions.map((q, idx) => (
          <Card key={idx} className="border border-outline-variant bg-surface-container-lowest">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{q.type}</span>
                <span className="text-xs text-on-surface-variant cursor-pointer hover:text-error">Remove</span>
              </div>
              <input type="text" className="w-full p-2 border border-outline-variant rounded text-sm" placeholder="Question text..." />
              
              {q.type === 'MCQ' && (
                <div className="space-y-2 pl-4 border-l-2 border-outline-variant">
                  {q.options.map((_: any, oIdx: number) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input type="radio" name={`q${idx}`} />
                      <input type="text" className="w-full p-1.5 border border-outline-variant rounded text-sm" placeholder={`Option ${oIdx + 1}`} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="text-xs py-1 h-7">Add Option</Button>
                </div>
              )}

              {q.type === 'TF' && (
                <div className="flex gap-4 pl-4">
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name={`q${idx}`} /> True</label>
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name={`q${idx}`} /> False</label>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
