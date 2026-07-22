'use client';

import { useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui';

const saints = [
  { name: 'St. Mark the Evangelist', nameAr: 'القديس مرقس الرسول', title: 'Founder of the Coptic Church', icon: 'church', color: 'bg-red-100 text-red-600' },
  { name: 'St. Athanasius the Apostolic', nameAr: 'القديس أثناسيوس الرسولي', title: 'Defender of the Faith', icon: 'shield', color: 'bg-blue-100 text-blue-600' },
  { name: 'St. Cyril the Great', nameAr: 'القديس كيرلس الكبير', title: 'Pillar of Faith', icon: 'auto_stories', color: 'bg-purple-100 text-purple-600' },
  { name: 'St. Anthony the Great', nameAr: 'القديس أنطونيوس الكبير', title: 'Father of Monasticism', icon: 'landscape', color: 'bg-amber-100 text-amber-700' },
  { name: 'St. Mary (Theotokos)', nameAr: 'القديسة العذراء مريم', title: 'Mother of God', icon: 'star', color: 'bg-sky-100 text-sky-600' },
  { name: 'St. George the Martyr', nameAr: 'الشهيد مارجرجس', title: 'Patron of Courage', icon: 'military_tech', color: 'bg-green-100 text-green-600' },
  { name: 'St. Mina the Wonder Worker', nameAr: 'القديس مينا العجايبى', title: 'The Miracle Worker', icon: 'flare', color: 'bg-orange-100 text-orange-600' },
  { name: 'Pope Shenouda III', nameAr: 'البابا شنودة الثالث', title: 'Pope of Sunday School', icon: 'school', color: 'bg-indigo-100 text-indigo-600' },
];

export default function SaintsPage() {
  const locale = useLocale();
  const en = locale === 'en';

  return (
    <div className="space-y-12 pb-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-black text-on-surface">{en ? 'Saints Library' : 'مكتبة القديسين'}</h1>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          {en ? 'Explore the lives and teachings of the great saints of the Coptic Orthodox Church.' : 'استكشف حياة وتعاليم قديسي الكنيسة القبطية الأرثوذكسية العظماء.'}
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {saints.map((saint, i) => (
          <Card key={i} className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer">
            <CardContent className="p-6 space-y-4 text-center">
              <div className={`w-16 h-16 mx-auto rounded-full ${saint.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>{saint.icon}</span>
              </div>
              <div>
                <h3 className="font-extrabold text-on-surface">{en ? saint.name : saint.nameAr}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{saint.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
