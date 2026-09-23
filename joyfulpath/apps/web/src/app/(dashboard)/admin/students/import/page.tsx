'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import { DataTable } from '@/components/ui/DataTable';
import * as xlsx from 'xlsx';

export default function ImportStudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToast = useNotificationStore(s => s.addToast);

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => setClasses(Array.isArray(data) ? data : data.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleDownloadTemplate = () => {
    const ws = xlsx.utils.json_to_sheet([{
      'Student Name': 'John Doe',
      'Username': 'john.doe',
      'Password': 'password123',
      'Year': 'Grade 10',
      'Date of Birth': '2010-05-15',
      'Phone': '0100000000',
      'Address': 'Cairo, Egypt',
      'Mother Name': 'Jane Doe',
      'Mother Phone': '0100000001',
      'Father Name': 'Mark Doe',
      'Father Phone': '0100000002',
      'Siblings': '2'
    }]);
    
    // Clear out the mock data so it's an empty template with headers
    xlsx.utils.sheet_add_aoa(ws, [[]], { origin: 'A2' }); 

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Template');
    xlsx.writeFile(wb, 'student_import_template.xlsx');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.xlsx')) {
      addToast('Please select a valid .xlsx file', 'error');
      return;
    }
    setFile(selectedFile);
    await uploadForPreview(selectedFile);
  };

  const uploadForPreview = async (selectedFile: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/students/import/preview', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
         const error = await res.json();
         throw new Error(error.message || 'Failed to preview file');
      }

      const data = await res.json();
      setPreviewData(data);
      addToast(`Preview generated!`, 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsUploading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const executeImport = async () => {
    if (!previewData || !previewData.validRows.length) return;
    setIsExecuting(true);
    try {
      const res = await fetch('/api/students/import/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          validRows: previewData.validRows,
          classId: selectedClassId || undefined
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to execute import');
      }

      const data = await res.json();
      setResults(data);
      addToast(`Import completed!`, 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out] pb-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">استيراد المخدومين</h1>
          <p className="text-on-surface-variant text-sm max-w-2xl">قم برفع ملف إكسيل لإنشاء حسابات المخدومين دفعة واحدة.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            تحميل القالب
          </Button>
        </div>
      </div>

      {!previewData && !results && (
        <div className="bg-surface-container-lowest p-12 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4">
           <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">upload_file</span>
           <div className="text-center">
              <h3 className="font-bold text-on-surface">رفع ملف إكسيل</h3>
              <p className="text-sm text-on-surface-variant">الصيغ المدعومة: .xlsx</p>
           </div>
           <input 
              type="file" 
              accept=".xlsx" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              id="file-upload"
           />
           <Button 
              variant="primary" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
           >
              {isUploading ? 'جاري التحميل...' : 'تصفح ومعاينة'}
           </Button>
        </div>
      )}

      {previewData && !results && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-card flex flex-col gap-4">
            <h2 className="text-xl font-bold text-on-surface">معاينة الاستيراد</h2>
            <div className="flex gap-4 items-center flex-wrap">
               <div className="bg-success/10 text-success px-4 py-2 rounded-lg font-bold">
                  {previewData.validCount} صفوف صالحة
               </div>
               <div className="bg-error/10 text-error px-4 py-2 rounded-lg font-bold">
                  {previewData.invalidCount} صفوف غير صالحة
               </div>
            </div>

            {previewData.invalidCount > 0 && (
              <div className="bg-error/5 border border-error/20 rounded-lg p-4 mt-2">
                <h3 className="font-bold text-error mb-2">أخطاء تم العثور عليها</h3>
                <ul className="text-sm text-error space-y-1 list-disc ps-5">
                  {previewData.invalidRows.map((r: any, i: number) => (
                    <li key={i}>
                      صف {r.index}: {r.errors.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-outline-variant pt-4 mt-2 flex flex-col gap-2">
               <label className="text-sm font-bold text-on-surface-variant">تعيين لفصل (اختياري)</label>
               <select 
                 className="p-2 border border-outline-variant rounded-lg max-w-sm"
                 value={selectedClassId}
                 onChange={e => setSelectedClassId(e.target.value)}
               >
                 <option value="">-- بدون فصل --</option>
                 {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>

            <div className="flex gap-4 mt-4">
               <Button variant="outline" onClick={() => setPreviewData(null)}>إلغاء</Button>
               <Button 
                 variant="primary" 
                 disabled={isExecuting || previewData.validCount === 0}
                 onClick={executeImport}
               >
                 {isExecuting ? 'جاري الاستيراد...' : 'تأكيد الاستيراد'}
               </Button>
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-6">
           <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-card flex flex-col items-center justify-center gap-4">
              <span className="material-symbols-outlined text-5xl text-success">check_circle</span>
              <div className="text-center">
                 <h2 className="text-2xl font-bold text-on-surface">تم الاستيراد بنجاح!</h2>
                 <p className="text-on-surface-variant">تمت الإضافة: {results.successful} | فشل: {results.failed}</p>
                 {results.errors && results.errors.length > 0 && (
                    <div className="text-error text-sm mt-2 max-h-32 overflow-y-auto border p-2 text-start">
                      {results.errors?.map((r: any, i: number) => <div key={i}>{r.error}</div>)}
                    </div>
                 )}
              </div>
              
              <div className="mt-4 flex gap-4">
                 <Button variant="outline" onClick={() => window.location.href = '/admin/students'}>
                    العودة للمخدومين
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
