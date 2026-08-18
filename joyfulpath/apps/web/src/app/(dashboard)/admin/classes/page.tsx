'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, Input, SearchBar } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

interface Classroom {
  id: string;
  nameEn: string;
  nameAr: string;
  instructorName: string;
  studentsCount: number;
  gradeLevel: string;
}



export default function AdminClasses() {
  const tNav = useTranslations('nav');
  const tClasses = useTranslations('classes');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);

  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grades 1-3');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/classes');
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredClasses = useMemo(() => {
    if (!searchQuery) return classes;
    const q = searchQuery.toLowerCase();
    return classes.filter(
      (c) =>
        c.nameEn.toLowerCase().includes(q) ||
        c.nameAr.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q) ||
        c.gradeLevel.toLowerCase().includes(q)
    );
  }, [classes, searchQuery]);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAr) {
      addToast('Error: Please fill all fields!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameEn, nameAr, gradeLevel }), // Ignoring instructor assignment here for simplicity, typically you'd pick from a list
      });

      if (!res.ok) throw new Error('Failed to create');
      
      addToast(tClasses('saveSuccess'), 'success');
      setIsOpen(false);
      fetchClasses();

      // Reset Form
      setNameEn('');
      setNameAr('');
      setInstructorName('');
      setGradeLevel('Grades 1-3');
    } catch (e) {
      addToast('Failed to create class', 'error');
    }
  }, [nameEn, nameAr, gradeLevel, addToast, tClasses]);

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
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} icon="add" iconPosition="start">
          {tClasses('addClass')}
        </Button>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search classes by name, servant or grade level..."
        resultCount={filteredClasses.length}
        totalCount={classes.length}
      />

      {/* List of classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClasses.map((c) => {
          const name = isAr ? c.nameAr : c.nameEn;

          return (
            <Card key={c.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                    {c.gradeLevel}
                  </span>
                  <span className="text-xs font-bold text-outline">
                    {tClasses('studentsCount', { count: c.studentsCount })}
                  </span>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-xl font-black text-on-surface">
                    {name}
                  </CardTitle>
                  <p className="text-xs text-on-surface-variant">
                    <strong>{tClasses('instructor')}:</strong> {c.instructorName}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs">
                    {tCommon('edit')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {loading ? (
          <div className="col-span-full text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline animate-spin">refresh</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">Loading classes...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline">school</span>
            <p className="text-on-surface-variant text-sm font-bold mt-2">No classes found.</p>
          </div>
        ) : null}
      </div>

      {/* Creation Modal */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)} title={tClasses('addClass')}>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tClasses('classNameEn')}</label>
                <Input required value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Primary Class A" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tClasses('classNameAr')}</label>
                <Input required value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="مثال: الفئة الابتدائية أ" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tClasses('instructorLabel')}</label>
              <Input
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tClasses('gradeLevelParam')}</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium"
              >
                <option value="Grades 1-3">{tClasses('grades1to3')}</option>
                <option value="Grades 4-6">{tClasses('grades4to6')}</option>
                <option value="Grades 7+">{tClasses('seniors')}</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tClasses('createClassBtn')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

