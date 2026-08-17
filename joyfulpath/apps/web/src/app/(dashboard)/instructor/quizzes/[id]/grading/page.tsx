'use client';

import { Card, CardContent, Button } from '@/components/ui';

export default function QuizGradingPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-[slide-up_0.4s_ease-out]">
      <h1 className="text-2xl font-extrabold flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary">analytics</span>
        Quiz Analytics & Grading
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-primary text-white border-0">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm opacity-80 uppercase tracking-wide">Avg Score</h3>
            <p className="text-3xl font-black">85%</p>
          </CardContent>
        </Card>
        <Card className="bg-success text-white border-0">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm opacity-80 uppercase tracking-wide">Pass Rate</h3>
            <p className="text-3xl font-black">92%</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm opacity-80 uppercase tracking-wide">Needs Grading</h3>
            <p className="text-3xl font-black">3</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-bold mt-8 mb-4">Pending Manual Grading (Short Answers)</h2>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="border border-outline-variant bg-surface-container-lowest">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-outline-variant/50 pb-2">
                <span className="font-bold text-sm">Student Name {i}</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">Needs Review</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant">Question:</p>
                <p className="text-sm">Explain the significance of the rainbow covenant.</p>
              </div>
              <div className="bg-surface-container p-3 rounded text-sm italic">
                "It was a promise from God to never flood the earth again."
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex-1">
                  <input type="text" placeholder="Teacher comment..." className="w-full p-2 border border-outline-variant rounded text-sm" />
                </div>
                <div className="w-24 flex items-center gap-2">
                  <input type="number" className="w-full p-2 border border-outline-variant rounded text-sm" placeholder="Points" />
                  <span className="text-xs font-bold">/ 10</span>
                </div>
                <Button variant="success" size="sm">Save Grade</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
