'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, Input } from '@/components/ui';

interface Classroom {
  id: string;
  nameEn: string;
  nameAr: string;
  instructorName: string;
  studentsCount: number;
  gradeLevel: string;
}

const INITIAL_CLASSES: Classroom[] = [
  {
    id: '1',
    nameEn: 'Primary Class A',
    nameAr: 'الفئة الابتدائية أ',
    instructorName: 'Servant Luke',
    studentsCount: 5,
    gradeLevel: 'Grades 1-3',
  },
  {
    id: '2',
    nameEn: 'Junior Class B',
    nameAr: 'الفئة المتوسطة ب',
    instructorName: 'Servant Mary',
    studentsCount: 3,
    gradeLevel: 'Grades 4-6',
  },
];

export default function AdminClasses() {
  const tNav = useTranslations('nav');
  const tClasses = useTranslations('classes');
  const tCommon = useTranslations('common');

  const [classes, setClasses] = useState<Classroom[]>(INITIAL_CLASSES);
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [instructorName, setInstructorName] = useState('Servant Luke');
  const [gradeLevel, setGradeLevel] = useState('Grades 1-3');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAr) {
      alert('Error: Please fill all fields!');
      return;
    }

    const newClass: Classroom = {
      id: String(classes.length + 1),
      nameEn,
      nameAr,
      instructorName,
      studentsCount: 0,
      gradeLevel,
    };

    setClasses((prev) => [...prev, newClass]);
    setIsOpen(false);
    alert(tClasses('saveSuccess'));

    // Reset Form
    setNameEn('');
    setNameAr('');
    setInstructorName('Servant Luke');
    setGradeLevel('Grades 1-3');
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('classes')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {tClasses('description')}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} icon="add_box" iconPosition="start">
          {tClasses('addClass')}
        </Button>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((c) => {
          const isAr = tCommon('appName') !== 'JoyfulPath';
          const name = isAr ? c.nameAr : c.nameEn;

          return (
            <Card key={c.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-black uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                    {c.gradeLevel}
                  </span>
                  <span className="text-xs font-bold text-outline">
                    {tClasses('studentsCount', { count: c.studentsCount })}
                  </span>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-lg font-black text-on-surface leading-tight">
                    {name}
                  </CardTitle>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>{tClasses('instructor')}:</strong> {c.instructorName}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs">
                    {tCommon('edit')}
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-3 text-xs text-error hover:bg-error/5 hover:text-error border-outline-variant/60">
                    {tCommon('delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Class Creation Modal */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)} title={tClasses('addClass')}>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Class Name (English)</label>
                <Input required value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Primary Class A" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">اسم الفصل (عربي)</label>
                <Input required value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="مثال: الفئة الابتدائية أ" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Instructor (Servant)</label>
                <select
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="h-12 w-full px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
                >
                  <option value="Servant Luke">Servant Luke</option>
                  <option value="Servant Mary">Servant Mary</option>
                  <option value="Servant Jonathan">Servant Jonathan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Grade Level Parameter</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="h-12 w-full px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
                >
                  <option value="Grades 1-3">Grades 1-3</option>
                  <option value="Grades 4-6">Grades 4-6</option>
                  <option value="Seniors">Seniors (Grades 7+)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Create Class
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
