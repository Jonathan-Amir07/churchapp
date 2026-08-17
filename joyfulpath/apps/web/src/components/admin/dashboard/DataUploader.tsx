'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

export function DataUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setSuccess(false);

    // Mock an upload delay
    setTimeout(() => {
      setIsUploading(false);
      setSuccess(true);
      setFile(null);
    }, 1500);
  };

  return (
    <Card className="border-secondary/20 shadow-sm bg-surface-container-lowest">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">upload_file</span>
          استيراد البيانات (Excel / PDF)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="border-2 border-dashed border-outline-variant/60 rounded-lg p-4 text-center cursor-pointer hover:bg-surface-container transition-colors relative">
            <input 
              type="file" 
              accept=".xlsx,.xls,.pdf" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <p className="text-sm font-medium text-on-surface truncate">{file.name}</p>
            ) : (
              <div>
                <span className="material-symbols-outlined text-[24px] text-outline mb-1">cloud_upload</span>
                <p className="text-xs text-on-surface-variant">اسحب الملف هنا أو انقر للاختيار</p>
              </div>
            )}
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            fullWidth 
            disabled={!file || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? 'جاري الرفع...' : 'رفع البيانات'}
          </Button>
          {success && <p className="text-xs text-green-600 font-bold text-center mt-1">تم رفع البيانات بنجاح!</p>}
        </div>
      </CardContent>
    </Card>
  );
}
