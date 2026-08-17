'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, Button } from '@/components/ui';

export default function ReviewTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const handleGrade = () => {
    alert('Submission graded!');
    router.back();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-[slide-up_0.4s_ease-out]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">assignment</span>
          Review Submissions
        </h1>
        <Button variant="outline" onClick={() => router.back()}>Back</Button>
      </div>

      <div className="space-y-4">
        {[
          { id: '1', student: 'Jonathan Amir', status: 'Needs Review', submittedAt: '2 hours ago', content: 'Here is my summary of Genesis chapter 1...' },
          { id: '2', student: 'Mark Safwat', status: 'Graded', submittedAt: '1 day ago', content: 'God created the heavens and the earth...' },
        ].map((sub) => (
          <Card key={sub.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {sub.student[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">{sub.student}</h3>
                    <p className="text-xs text-on-surface-variant">Submitted {sub.submittedAt}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${sub.status === 'Graded' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {sub.status}
                </span>
              </div>

              <div className="p-4 bg-surface-container rounded-lg text-sm italic">
                "{sub.content}"
              </div>

              {sub.status === 'Needs Review' && (
                <div className="pt-2 flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold mb-1">Feedback</label>
                    <input type="text" className="w-full p-2 border border-outline-variant rounded-md text-sm" placeholder="Great job!" />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-bold mb-1">XP Awarded</label>
                    <input type="number" defaultValue={50} className="w-full p-2 border border-outline-variant rounded-md text-sm" />
                  </div>
                  <Button variant="success" size="sm" onClick={handleGrade}>Submit Grade</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
