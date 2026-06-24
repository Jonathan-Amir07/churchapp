'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, BadgeTag } from '@/components/ui';

interface Task {
  id: string;
  titleEn: string;
  titleAr: string;
  points: number;
  status: 'approved' | 'pending' | 'revise' | 'not-started';
  instructionsEn: string;
  instructionsAr: string;
  feedbackEn?: string;
  feedbackAr?: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    titleEn: 'Memorize Genesis 1:1 Verse',
    titleAr: 'تسميع آية تكوين ١:١',
    points: 30,
    status: 'approved',
    instructionsEn: 'Record an audio reciting the Genesis 1:1 verse word-for-word and upload it.',
    instructionsAr: 'قم بتسجيل مقطع صوتي لتسميع آية تكوين ١:١ كلمة بكلمة وارفعه هنا.',
    feedbackEn: 'Excellent pronunciation and perfect memorization! Keep it up!',
    feedbackAr: 'نطق ممتاز وحفظ متقن جداً! استمر في هذا الأداء الرائع!',
  },
  {
    id: '2',
    titleEn: 'Draw the Creation Days Activity',
    titleAr: 'نشاط رسم أيام الخليقة',
    points: 30,
    status: 'pending',
    instructionsEn: 'Draw a picture illustrating your favorite day of Creation and upload a photo.',
    instructionsAr: 'ارسم لوحة توضح يومك المفضل من أيام الخليقة وارفع صورتها.',
  },
  {
    id: '3',
    titleEn: 'Memorize Genesis 9:13 Verse',
    titleAr: 'تسميع آية تكوين ٩:١٣',
    points: 30,
    status: 'revise',
    instructionsEn: 'Recite Genesis 9:13. Ensure the reference is mentioned clearly at the start.',
    instructionsAr: 'قم بتسجيل مقطع صوتي لتسميع آية تكوين ٩:١٣ وتأكد من ذكر الشاهد بوضوح في البداية.',
    feedbackEn: 'You missed the last part of the verse. Please re-record and submit again!',
    feedbackAr: 'لقد نسيت الجزء الأخير من الآية. يرجى إعادة التسجيل والتسليم مرة أخرى!',
  },
  {
    id: '4',
    titleEn: "Color Noah's Ark Illustration",
    titleAr: 'تلوين رسمة فلك نوح',
    points: 30,
    status: 'not-started',
    instructionsEn: 'Download the worksheet, color Noah\'s Ark and the rainbow, then take a photo and upload.',
    instructionsAr: 'قم بتنزيل ورقة العمل وتلوين فلك نوح وقوس قزح، ثم التقط صورة وقم برفعها.',
  },
];

export default function StudentTasks() {
  const tNav = useTranslations('nav');
  const tTasks = useTranslations('tasks');
  const tCommon = useTranslations('common');
  
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState('');

  const handleOpenSubmit = (task: Task) => {
    setSelectedTask(task);
    setSubmissionText('');
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    setTasks(prev =>
      prev.map(t =>
        t.id === selectedTask?.id ? { ...t, status: 'pending' } : t
      )
    );
    setSelectedTask(null);
    alert(tTasks('submitSuccess'));
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('tasks')}
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base max-w-2xl">
          {tTasks('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => {
          const isAr = tCommon('appName') !== 'JoyfulPath';
          const title = isAr ? task.titleAr : task.titleEn;
          const instructions = isAr ? task.instructionsAr : task.instructionsEn;
          const feedback = isAr ? task.feedbackAr : task.feedbackEn;

          return (
            <Card key={task.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <BadgeTag
                      variant={
                        task.status === 'approved'
                          ? 'success'
                          : task.status === 'pending'
                          ? 'warning'
                          : task.status === 'revise'
                          ? 'error'
                          : 'outline'
                      }
                    >
                      {tTasks(
                        task.status === 'approved'
                          ? 'statusApproved'
                          : task.status === 'pending'
                          ? 'statusPending'
                          : task.status === 'revise'
                          ? 'statusRevise'
                          : 'statusRevise'
                      )}
                    </BadgeTag>
                    <span className="text-xs font-black text-secondary">
                      {tTasks('pointsValue', { points: task.points })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <CardTitle className="text-lg font-black text-on-surface leading-tight">
                      {title}
                    </CardTitle>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <strong>{tTasks('instructions')}:</strong> {instructions}
                    </p>
                  </div>

                  {feedback && (
                    <div className="p-3.5 bg-surface-container rounded-xl border border-outline-variant/60">
                      <p className="text-xs font-bold text-primary mb-0.5">
                        {tTasks('feedback')}
                      </p>
                      <p className="text-xs text-on-surface-variant italic leading-relaxed">
                        {feedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  {(task.status === 'not-started' || task.status === 'revise') && (
                    <Button variant="primary" size="sm" onClick={() => handleOpenSubmit(task)}>
                      {tTasks('submitTask')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedTask && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          title={tTasks('submitTask')}
        >
          <form onSubmit={handleSubmitTask} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant">
                {tCommon('appName') !== 'JoyfulPath' ? selectedTask.titleAr : selectedTask.titleEn}
              </label>
              <textarea
                required
                rows={4}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder={tTasks('enterSubmission')}
                className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary text-sm font-medium leading-relaxed"
              />
            </div>

            <div className="border border-dashed border-outline-variant rounded-xl p-6 text-center hover:bg-surface-container transition duration-150 cursor-pointer">
              <span className="material-symbols-outlined text-[32px] text-outline">upload_file</span>
              <p className="text-xs text-on-surface-variant font-bold mt-1">
                {tTasks('uploadFile')}
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setSelectedTask(null)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tCommon('submit')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
