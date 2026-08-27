'use client';

import { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToast = useNotificationStore(s => s.addToast);

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
      const res = await fetch('/api/students/import', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
         const error = await res.json();
         throw new Error(error.message || 'Failed to import file');
      }

      const data = await res.json();
      setResults(data);
      addToast(`Import finished!`, 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsUploading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out] pb-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Import Students</h1>
          <p className="text-on-surface-variant text-sm max-w-2xl">Upload an Excel file to bulk create student accounts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download Template
          </Button>
        </div>
      </div>

      {!results && (
        <div className="bg-surface p-12 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4">
           <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">upload_file</span>
           <div className="text-center">
              <h3 className="font-bold text-on-surface">Upload Excel File</h3>
              <p className="text-sm text-on-surface-variant">Supported formats: .xlsx</p>
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
              {isUploading ? 'Uploading & Importing...' : 'Browse & Import'}
           </Button>
        </div>
      )}

      {results && (
        <div className="space-y-6">
           <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm flex flex-col items-center justify-center gap-4">
              <span className="material-symbols-outlined text-5xl text-success">check_circle</span>
              <div className="text-center">
                 <h2 className="text-2xl font-bold text-on-surface">Import Completed!</h2>
                 <p className="text-on-surface-variant">Created: {results.created} | Duplicates: {results.duplicate} | Invalid: {results.invalid} | Failed: {results.failed}</p>
                 {results.reasons && results.reasons.length > 0 && (
                    <div className="text-error text-sm mt-2 max-h-32 overflow-y-auto border p-2 text-left">
                      {results.reasons.map((r: string, i: number) => <div key={i}>{r}</div>)}
                    </div>
                 )}
              </div>
              
              <div className="mt-4 flex gap-4">
                 <Button variant="outline" onClick={() => window.location.href = '/admin/students'}>
                    Back to Students
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
