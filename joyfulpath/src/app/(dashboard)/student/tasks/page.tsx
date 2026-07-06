'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, BadgeTag, ProgressBar } from '@/components/ui';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
}

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
  submittedFile?: UploadedFile;
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
    submittedFile: { name: 'genesis_1_1_recitation.mp3', size: '1.4 MB', type: 'audio/mpeg' },
  },
  {
    id: '2',
    titleEn: 'Draw the Creation Days Activity',
    titleAr: 'نشاط رسم أيام الخليقة',
    points: 30,
    status: 'pending',
    instructionsEn: 'Draw a picture illustrating your favorite day of Creation and upload a photo.',
    instructionsAr: 'ارسم لوحة توضح يومك المفضل من أيام الخليقة وارفع صورتها.',
    submittedFile: { name: 'creation_day3_drawing.jpg', size: '2.8 MB', type: 'image/jpeg' },
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

const FILE_TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  'image': { icon: 'image', color: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20' },
  'audio': { icon: 'headphones', color: 'text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20' },
  'video': { icon: 'videocam', color: 'text-teal-500 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20' },
  'application': { icon: 'description', color: 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20' },
};

export default function StudentTasks() {
  const tNav = useTranslations('nav');
  const tTasks = useTranslations('tasks');
  const tCommon = useTranslations('common');
  
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAr = tCommon('appName') !== 'JoyfulPath';

  const handleOpenSubmit = (task: Task) => {
    setSelectedTask(task);
    setSubmissionText('');
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const simulateUpload = (fileName: string, fileSize: string, fileType: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile({ name: fileName, size: fileSize, type: fileType });
          return 100;
        }
        return prev + Math.random() * 25 + 5;
      });
    }, 200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const size = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
      simulateUpload(file.name, size, file.type);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const size = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
      simulateUpload(file.name, size, file.type);
    }
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() && !uploadedFile) return;

    setTasks(prev =>
      prev.map(t =>
        t.id === selectedTask?.id
          ? { ...t, status: 'pending' as const, submittedFile: uploadedFile || undefined }
          : t
      )
    );
    setSelectedTask(null);
    setUploadedFile(null);
    alert(tTasks('submitSuccess'));
  };

  const getFileIcon = (type: string) => {
    const category = type.split('/')[0];
    return FILE_TYPE_ICONS[category] || FILE_TYPE_ICONS['application'];
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

                  {/* Show submitted file if exists */}
                  {task.submittedFile && (
                    <div className="flex items-center gap-3 p-2.5 bg-tertiary/5 rounded-lg border border-tertiary/20">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getFileIcon(task.submittedFile.type).color}`}>
                        <span className="material-symbols-outlined text-[16px]">{getFileIcon(task.submittedFile.type).icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate">{task.submittedFile.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{task.submittedFile.size}</p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
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
                {isAr ? selectedTask.titleAr : selectedTask.titleEn}
              </label>
              <textarea
                rows={4}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder={tTasks('enterSubmission')}
                className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary text-sm font-medium leading-relaxed"
              />
            </div>

            {/* Enhanced File Upload Zone */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,audio/*,video/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!uploadedFile && !isUploading && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  isDragOver
                    ? 'border-primary bg-primary/5 scale-[1.02]'
                    : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container'
                }`}
              >
                <span className={`material-symbols-outlined text-[40px] transition-colors duration-200 ${isDragOver ? 'text-primary' : 'text-outline'}`}>
                  cloud_upload
                </span>
                <p className="text-sm font-bold text-on-surface mt-2">
                  {isAr ? 'اسحب الملف هنا أو اضغط لاختيار ملف' : 'Drag & drop your file here, or click to browse'}
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {tTasks('uploadFile')}
                </p>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/60 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-primary animate-spin">progress_activity</span>
                  <span className="text-xs font-bold text-on-surface">{isAr ? 'جاري رفع الملف...' : 'Uploading file...'}</span>
                </div>
                <ProgressBar value={Math.min(uploadProgress, 100)} size="sm" />
                <p className="text-[10px] text-on-surface-variant text-end font-bold">{Math.min(Math.round(uploadProgress), 100)}%</p>
              </div>
            )}

            {/* Uploaded File Preview */}
            {uploadedFile && !isUploading && (
              <div className="p-4 bg-tertiary/5 rounded-xl border border-tertiary/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileIcon(uploadedFile.type).color}`}>
                      <span className="material-symbols-outlined text-[20px]">{getFileIcon(uploadedFile.type).icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{uploadedFile.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{uploadedFile.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="p-1.5 hover:bg-error/10 rounded-lg transition-colors duration-150"
                  >
                    <span className="material-symbols-outlined text-[18px] text-error">close</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  {isAr ? 'تم رفع الملف بنجاح' : 'File uploaded successfully'}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setSelectedTask(null)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={!submissionText.trim() && !uploadedFile}>
                {tCommon('submit')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
