'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui';

const faqs = [
  { q: 'What is newsl w nwasl ll sama?', qAr: 'ما هو newsl w nwasl ll sama؟', a: 'newsl w nwasl ll sama is a gamified digital platform for Coptic Orthodox Sunday Schools that makes learning fun through XP, badges, quizzes, and interactive lessons.', aAr: 'newsl w nwasl ll sama هو منصة رقمية تفاعلية لمدارس الأحد القبطية الأرثوذكسية تجعل التعلم ممتعاً من خلال النقاط والأوسمة والمسابقات والدروس التفاعلية.' },
  { q: 'Who can use the platform?', qAr: 'من يمكنه استخدام المنصة؟', a: 'Students, parents, servants, and church administrators can all create accounts and use the platform with role-specific features.', aAr: 'يمكن للطلاب وأولياء الأمور والخدام ومسؤولي الكنيسة إنشاء حسابات واستخدام المنصة بمميزات مخصصة لكل دور.' },
  { q: 'Is newsl w nwasl ll sama free?', qAr: 'هل المنصة مجانية؟', a: 'Yes! newsl w nwasl ll sama is completely free for all churches and Sunday Schools to use.', aAr: 'نعم! newsl w nwasl ll sama مجاني تماماً لجميع الكنائس ومدارس الأحد.' },
  { q: 'How does the rewards system work?', qAr: 'كيف يعمل نظام المكافآت؟', a: 'Students earn XP and Points through attendance, completing lessons, quizzes, and tasks. Points can be redeemed in the Blessings Store for digital items or physical rewards approved by admins.', aAr: 'يكسب الطلاب نقاط XP ونقاط من خلال الحضور وإكمال الدروس والمسابقات والمهام. يمكن استبدال النقاط في متجر البركات بعناصر رقمية أو مكافآت مادية يوافق عليها المسؤولون.' },
  { q: 'Can parents monitor their children?', qAr: 'هل يمكن لأولياء الأمور متابعة أطفالهم؟', a: 'Absolutely. Parents have a dedicated dashboard with attendance records, progress reports, quiz scores, and event RSVPs for all linked children.', aAr: 'بالتأكيد. يمتلك أولياء الأمور لوحة تحكم مخصصة تتضمن سجلات الحضور وتقارير التقدم ونتائج المسابقات وتسجيلات الفعاليات لجميع الأطفال المرتبطين.' },
  { q: 'Does it support Arabic?', qAr: 'هل يدعم اللغة العربية؟', a: 'Yes, newsl w nwasl ll sama fully supports both English and Arabic with proper RTL layout support.', aAr: 'نعم، يدعم newsl w nwasl ll sama بالكامل اللغتين الإنجليزية والعربية مع دعم كامل لتخطيط الكتابة من اليمين لليسار.' },
];

export default function FAQPage() {
  const locale = useLocale();
  const en = locale === 'en';
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-12 pb-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-black text-on-surface">{en ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}</h1>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          {en ? 'Find answers to common questions about JoyfulPath.' : 'اعثر على إجابات للأسئلة الشائعة حول JoyfulPath.'}
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-3">
        {faqs.map((faq, i) => (
          <Card key={i} className="border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full p-5 flex items-center justify-between text-start"
            >
              <h3 className="font-bold text-on-surface">{en ? faq.q : faq.qAr}</h3>
              <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${openIdx === i ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {openIdx === i && (
              <CardContent className="px-5 pb-5 pt-0">
                <p className="text-sm text-on-surface-variant leading-relaxed">{en ? faq.a : faq.aAr}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
