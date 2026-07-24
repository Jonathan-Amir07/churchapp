'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Card } from '@/components/ui';

const galleryItems = [
  { img: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Summer Camp', titleAr: 'المعسكر الصيفي' },
  { img: 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Sunday School Festival', titleAr: 'مهرجان مدارس الأحد' },
  { img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Bible Study', titleAr: 'دراسة الكتاب المقدس' },
  { img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Choir Practice', titleAr: 'تدريب خورس الألحان' },
  { img: 'https://images.unsplash.com/photo-1473181446192-6688ca8bb989?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Church Trip', titleAr: 'رحلة الكنيسة' },
  { img: 'https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Volunteer Work', titleAr: 'العمل التطوعي' },
];

export default function GalleryPage() {
  const locale = useLocale();
  const en = locale === 'en';

  return (
    <div className="space-y-12 pb-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-black text-on-surface">{en ? 'Photo Gallery' : 'معرض الصور'}</h1>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          {en ? 'Memories from our latest events and activities.' : 'ذكريات من أحدث فعالياتنا وأنشطتنا.'}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, i) => (
          <Card key={i} className="border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden group cursor-pointer">
            <div className="relative h-64 overflow-hidden">
              <Image src={item.img} alt={en ? item.title : item.titleAr} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 z-10">
                <h3 className="text-white font-bold text-lg">{en ? item.title : item.titleAr}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

