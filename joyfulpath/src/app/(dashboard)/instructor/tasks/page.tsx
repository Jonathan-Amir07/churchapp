'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, BadgeTag } from '@/components/ui';

interface Submission {
  id: string;
  studentName: string;
  taskTitleEn: string;
  taskTitleAr: string;
  submissionText: string;
  submittedAt: string;
  points: number;
}

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub1',
    studentName: 'Mark Faith',
    taskTitleEn: 'Draw the Creation Days Activity',
    taskTitleAr: 'نشاط رسم أيام الخليقة',
    submissionText: 'https://joyfulpath-storage.local/submissions/mark_creation.png (A beautiful drawing representing Day 1: separating light from darkness)',
    submittedAt: '2026-06-24T12:30:00Z',
    points: 30,
  },
  {
    id: 'sub2',
    studentName: 'Luke Evangelist',
    taskTitleEn: 'Color Noah\'s Ark Illustration',
    taskTitleAr: 'تلوين رسمة فلك نوح',
    submissionText: 'I colored the Ark brown and the rainbow with all seven colors! The drawing is attached.',
    submittedAt: '2026-06-24T14:10:00Z',
    points: 30,
  },
];

export default function InstructorTasks() {
  const tNav = useTranslations('nav');
  const tTasks = useTranslations('tasks');
  const tCommon = useTranslations('common');

  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleReview = (id: string, approved: boolean) => {
    setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
    setSelectedSub(null);
    setFeedback('');
    alert(
      approved
        ? tTasks('approveSuccess')
        : tTasks('rejectSuccess')
    );
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tTasks('reviewPending')}
        </h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          {tTasks('instructorDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {submissions.map((sub) => {
          const isAr = tCommon('appName') !== 'JoyfulPath';
          const title = isAr ? sub.taskTitleAr : sub.taskTitleEn;

          return (
            <Card key={sub.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      {sub.studentName}
                    </span>
                    <span className="text-xs font-bold text-outline">
                      {tTasks('submittedAt', { time: new Date(sub.submittedAt).toLocaleTimeString() })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <CardTitle className="text-lg font-black text-on-surface leading-tight">
                      {title}
                    </CardTitle>
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {sub.submissionText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Button variant="primary" size="sm" onClick={() => setSelectedSub(sub)}>
                    {tTasks('grade')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {submissions.length === 0 && (
          <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline">task_alt</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">{tTasks('noPending')}</p>
          </div>
        )}
      </div>

      {/* Review Dialog */}
      {selectedSub && (
        <Modal isOpen={true} onClose={() => setSelectedSub(null)} title={tTasks('grade')}>
          <div className="space-y-6 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-outline">
                <span>{tTasks('studentNameLabel', { name: selectedSub.studentName })}</span>
                <span>{tTasks('rewardLabel', { points: selectedSub.points })}</span>
              </div>
              <h4 className="text-sm font-black text-on-surface">
                {tCommon('appName') !== 'JoyfulPath' ? selectedSub.taskTitleAr : selectedSub.taskTitleEn}
              </h4>
            </div>

            <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/60">
              <p className="text-xs font-bold text-on-surface-variant mb-1">{tTasks('studentSubmission')}</p>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {selectedSub.submissionText}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">
                {tTasks('comments')} / Feedback
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Good job! / Please edit..."
                className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary text-sm font-medium leading-relaxed"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" onClick={() => setSelectedSub(null)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleReview(selectedSub.id, false)}>
                {tTasks('rejectBtn')}
              </Button>
              <Button variant="success" size="sm" onClick={() => handleReview(selectedSub.id, true)}>
                {tTasks('approveBtn')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
