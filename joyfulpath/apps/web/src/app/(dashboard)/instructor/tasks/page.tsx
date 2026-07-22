'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, BadgeTag } from '@/components/ui';

interface SubmissionFile {
  name: string;
  size: string;
  type: string;
}

interface Submission {
  id: string;
  studentName: string;
  taskTitleEn: string;
  taskTitleAr: string;
  submissionText: string;
  submittedAt: string;
  points: number;
  attachedFiles: SubmissionFile[];
}

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub1',
    studentName: 'Mark Faith',
    taskTitleEn: 'Draw the Creation Days Activity',
    taskTitleAr: 'نشاط رسم أيام الخليقة',
    submissionText: 'A beautiful drawing representing Day 1: separating light from darkness. I used watercolors for the sky gradient.',
    submittedAt: '2026-06-24T12:30:00Z',
    points: 30,
    attachedFiles: [
      { name: 'mark_creation_day1.png', size: '2.4 MB', type: 'image/png' },
      { name: 'mark_notes.pdf', size: '340 KB', type: 'application/pdf' },
    ],
  },
  {
    id: 'sub2',
    studentName: 'Luke Evangelist',
    taskTitleEn: 'Color Noah\'s Ark Illustration',
    taskTitleAr: 'تلوين رسمة فلك نوح',
    submissionText: 'I colored the Ark brown and the rainbow with all seven colors! The drawing is attached.',
    submittedAt: '2026-06-24T14:10:00Z',
    points: 30,
    attachedFiles: [
      { name: 'luke_noahs_ark.jpg', size: '1.8 MB', type: 'image/jpeg' },
    ],
  },
  {
    id: 'sub3',
    studentName: 'Sarah Grace',
    taskTitleEn: 'Memorize Genesis 1:1 Verse',
    taskTitleAr: 'تسميع آية تكوين ١:١',
    submissionText: 'Recorded my recitation of Genesis 1:1. I practiced it five times before recording!',
    submittedAt: '2026-06-25T09:45:00Z',
    points: 30,
    attachedFiles: [
      { name: 'sarah_genesis_1_1.mp3', size: '1.1 MB', type: 'audio/mpeg' },
    ],
  },
];

const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  image: { icon: 'image', color: 'text-blue-500 bg-blue-50' },
  audio: { icon: 'headphones', color: 'text-purple-500 bg-purple-50' },
  video: { icon: 'videocam', color: 'text-teal-500 bg-teal-50' },
  application: { icon: 'description', color: 'text-orange-500 bg-orange-50' },
};

export default function InstructorTasks() {
  const tNav = useTranslations('nav');
  const tTasks = useTranslations('tasks');
  const tCommon = useTranslations('common');

  const isAr = tCommon('appName') !== 'JoyfulPath';
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

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

  const handleDownloadFile = (fileName: string) => {
    setDownloadingFile(fileName);
    setTimeout(() => {
      setDownloadingFile(null);
      alert(isAr ? `تم تنزيل: ${fileName}` : `Downloaded: ${fileName}`);
    }, 1000);
  };

  const getFileIcon = (type: string) => {
    const category = type.split('/')[0];
    return FILE_ICONS[category] || FILE_ICONS.application;
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px] text-yellow-600" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">{submissions.length}</p>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{isAr ? 'في الانتظار' : 'Pending'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px] text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>attach_file</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">{submissions.reduce((acc, s) => acc + s.attachedFiles.length, 0)}</p>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{isAr ? 'مرفقات' : 'Attachments'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px] text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">{new Set(submissions.map(s => s.studentName)).size}</p>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{isAr ? 'طلاب' : 'Students'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {submissions.map((sub) => {
          const title = isAr ? sub.taskTitleAr : sub.taskTitleEn;

          return (
            <Card key={sub.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                </div>

                {/* Attached Files Preview */}
                {sub.attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/40">
                    {sub.attachedFiles.map((file, idx) => {
                      const fileStyle = getFileIcon(file.type);
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant/60 text-xs"
                        >
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${fileStyle.color}`}>
                            <span className="material-symbols-outlined text-[14px]">{fileStyle.icon}</span>
                          </div>
                          <span className="font-bold text-on-surface max-w-[140px] truncate">{file.name}</span>
                          <span className="text-on-surface-variant">{file.size}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                {isAr ? selectedSub.taskTitleAr : selectedSub.taskTitleEn}
              </h4>
            </div>

            <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/60">
              <p className="text-xs font-bold text-on-surface-variant mb-1">{tTasks('studentSubmission')}</p>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {selectedSub.submissionText}
              </p>
            </div>

            {/* Attached Files in Review */}
            {selectedSub.attachedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">attach_file</span>
                  {isAr ? 'الملفات المرفقة' : 'Attached Files'}
                </h4>
                <div className="space-y-2">
                  {selectedSub.attachedFiles.map((file, idx) => {
                    const fileStyle = getFileIcon(file.type);
                    const isDownloading = downloadingFile === file.name;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-surface-container rounded-xl border border-outline-variant/60 hover:bg-surface-container-high transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${fileStyle.color}`}>
                            <span className="material-symbols-outlined text-[18px]">{fileStyle.icon}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-on-surface">{file.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{file.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(file.name)}
                          disabled={isDownloading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors duration-150 disabled:opacity-50"
                        >
                          <span className={`material-symbols-outlined text-[16px] ${isDownloading ? 'animate-spin' : ''}`}>
                            {isDownloading ? 'progress_activity' : 'download'}
                          </span>
                          {isDownloading ? '...' : (isAr ? 'تنزيل' : 'Download')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
