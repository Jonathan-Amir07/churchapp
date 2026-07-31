'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, BadgeTag, ProgressBar } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import { useAppStore } from '@/stores/app.store';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export default function StudentTasks() {
  const tNav = useTranslations('nav');
  const tTasks = useTranslations('tasks');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);
  
  const supabase = createClient();
  const { tasks, addActivity } = useAppStore(); // Use Zustand instead of supabase
  
  const mappedTasks = tasks.map((t: any) => ({
    id: t.id,
    titleEn: t.taskTitleEn,
    titleAr: t.taskTitleAr,
    points: t.points,
    status: t.status,
    instructionsEn: 'Complete the assignment as described by your instructor.',
    instructionsAr: 'أكمل الواجب كما وصفه لك الخادم.',
    submittedFile: undefined as UploadedFile | undefined,
    feedbackEn: undefined as string | undefined,
    feedbackAr: undefined as string | undefined,
  }));
  
  const [localTasks, setLocalTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalTasks(mappedTasks);
    setIsLoading(false);
  }, [tasks]);

  const locale = useLocale();
  const isAr = locale === 'ar';
  
  const FILE_TYPE_ICONS: Record<string, { icon: string; color: string }> = {
    'image': { icon: 'image', color: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20' },
    'audio': { icon: 'headphones', color: 'text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20' },
    'video': { icon: 'videocam', color: 'text-teal-500 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20' },
    'application': { icon: 'description', color: 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20' },
  };

  const handleOpenSubmit = (task: any) => {
    setSelectedTask(task);
    setSubmissionText('');
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);
    const size = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;

    try {
      if (!selectedTask) throw new Error('No task selected');
      
      const { data, error } = await supabase.storage
        .from('homework')
        .upload(`student-submissions/${selectedTask.id}/${file.name}`, file, {
           upsert: true 
        });

      if (error) throw error;
      setUploadProgress(100);
      
      const { data: urlData } = supabase.storage.from('homework').getPublicUrl(data.path);

      setUploadedFile({ 
        name: file.name, 
        size, 
        type: file.type,
        url: urlData.publicUrl 
      });
    } catch (err) {
      console.error('Upload failed:', err);
      addToast('File upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() && !uploadedFile) return;
    if (!selectedTask) return;

    try {
      setLocalTasks(prev =>
        prev.map(t =>
          t.id === selectedTask.id
            ? { ...t, status: 'pending', submittedFile: uploadedFile || undefined }
            : t
        )
      );
      
      addActivity(
        'Jonathan',
        'task_completed',
        `Submitted task: ${selectedTask.titleEn}`,
        `تم تسليم المهمة: ${selectedTask.titleAr}`
      );
      
      setSelectedTask(null);
      setUploadedFile(null);
      addToast(tTasks('submitSuccess'), 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to submit task', 'error');
    }
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
        {localTasks.map((task) => {
          const title = isAr ? task.titleAr : task.titleEn;
          const instructions = isAr ? task.instructionsAr : task.instructionsEn;
          const feedback = isAr ? task.feedbackAr : task.feedbackEn;

          const isNotStarted = task.status === 'not-started' || task.status === 'not_started';
          const isPending = task.status === 'pending';
          const isApproved = task.status === 'approved';
          const isRevise = task.status === 'revise' || task.status === 'rejected';

          return (
            <Card key={task.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <BadgeTag
                      variant={
                        isApproved
                          ? 'success'
                          : isPending
                          ? 'warning'
                          : isRevise
                          ? 'error'
                          : 'outline'
                      }
                    >
                      {isApproved
                        ? tTasks('statusApproved')
                        : isPending
                        ? tTasks('statusPending')
                        : isRevise
                        ? tTasks('statusRevise')
                        : (isAr ? 'لم يكتمل' : 'Not Started')}
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
                  {(isNotStarted || isRevise) && (
                    <Button variant="primary" size="sm" onClick={() => handleOpenSubmit(task)}>
                      {tTasks('submitTask')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {localTasks.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline">assignment</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">{tTasks('noTasks')}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
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

