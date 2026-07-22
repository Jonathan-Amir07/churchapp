'use client';

import { useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui';

const branches = [
  { name: 'Main Cathedral', nameAr: 'الكاتدرائية الرئيسية', address: 'Cairo, Egypt', services: 3, students: 120 },
  { name: 'St. Mary Heliopolis', nameAr: 'العذراء مريم - مصر الجديدة', address: 'Heliopolis, Cairo', services: 2, students: 85 },
  { name: 'St. Mark Shoubra', nameAr: 'مارمرقس - شبرا', address: 'Shoubra, Cairo', services: 2, students: 95 },
  { name: 'St. George Sporting', nameAr: 'مارجرجس - سبورتنج', address: 'Alexandria, Egypt', services: 2, students: 70 },
];

export default function BranchesPage() {
  const locale = useLocale();
  const en = locale === 'en';

  return (
    <div className="space-y-12 pb-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-black text-on-surface">{en ? 'Church Branches' : 'فروع الكنيسة'}</h1>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          {en ? 'Find a Sunday School near you.' : 'ابحث عن مدرسة أحد قريبة منك.'}
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b, i) => (
          <Card key={i} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>church</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-on-surface">{en ? b.name : b.nameAr}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {b.address}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="text-center">
                  <p className="text-xl font-extrabold text-primary">{b.services}</p>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant">{en ? 'Services' : 'خدمات'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-extrabold text-tertiary">{b.students}</p>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant">{en ? 'Students' : 'طلاب'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
