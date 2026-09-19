'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

export default function NewStudentPage() {
  const router = useRouter();
  const addToast = useNotificationStore(s => s.addToast);

  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phone: '',
    year: '',
    dateOfBirth: '',
    address: '',
    classId: '',
    motherName: '',
    motherPhone: '',
    fatherName: '',
    fatherPhone: '',
  });

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => {
        setClasses(Array.isArray(data) ? data : data.data || []);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create student');
      }

      addToast('Student created successfully', 'success');
      router.push('/admin/students');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out] pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">إضافة طالب جديد</h1>
        <p className="text-on-surface-variant text-sm">قم بإدخال بيانات الطالب وعائلته لإنشاء حسابه وتخصيصه لفصل.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-surface p-8 rounded-xl border border-outline-variant shadow-sm">
        
        {/* Student Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-2">بيانات الطالب</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">الاسم الأول *</label>
              <Input required name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">اسم العائلة *</label>
              <Input required name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">اسم المستخدم *</label>
              <Input required name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">كلمة المرور *</label>
              <Input required type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">رقم الهاتف</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">تاريخ الميلاد</label>
              <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">العنوان</label>
              <Input name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">السنة الدراسية</label>
              <Input name="year" value={formData.year} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">تخصيص فصل</label>
              <select 
                name="classId" 
                value={formData.classId} 
                onChange={handleChange}
                className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                <option value="">-- بدون فصل --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Family Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-2">بيانات العائلة (اختياري)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">اسم الأم</label>
              <Input name="motherName" value={formData.motherName} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">رقم هاتف الأم (يستخدم كمعرف)</label>
              <Input name="motherPhone" value={formData.motherPhone} onChange={handleChange} placeholder="01xxxxxxxxx" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">اسم الأب</label>
              <Input name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1 block">رقم هاتف الأب (يستخدم كمعرف)</label>
              <Input name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} placeholder="01xxxxxxxxx" />
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mt-2">ملاحظة: إذا تم إدخال رقم هاتف الأب أو الأم، سيتم إنشاء حساب ولي أمر تلقائياً وربطه بالطالب.</p>
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t border-outline-variant">
          <Button variant="outline" type="button" onClick={() => router.push('/admin/students')}>إلغاء</Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'جاري الحفظ...' : 'حفظ وإنشاء الطالب'}
          </Button>
        </div>
      </form>
    </div>
  );
}
