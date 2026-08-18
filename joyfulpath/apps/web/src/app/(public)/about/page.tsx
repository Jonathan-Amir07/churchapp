'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui';

export default function AboutPage() {
  const locale = useLocale();
  const en = locale === 'en';

  return (
    <div className="space-y-20 pb-12">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-surface-container-low to-background">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center space-y-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-on-surface"
          >
            {en ? 'About newsl w nwasl ll sama' : 'عن منصة newsl w nwasl ll sama'}
          </motion.h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
            {en
              ? 'newsl w nwasl ll sama is a Coptic Orthodox gamified Sunday School platform created to nurture faith, build community, and make spiritual education engaging for the next generation.'
              : 'newsl w nwasl ll sama هي منصة مدارس الأحد القبطية الأرثوذكسية التفاعلية، مصممة لتعزيز الإيمان وبناء المجتمع الكنسي وجعل التعليم الروحي ممتعاً للأجيال القادمة.'}
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-primary">visibility</span>
            </div>
            <h2 className="text-2xl font-extrabold text-on-surface">{en ? 'Our Vision' : 'رؤيتنا'}</h2>
            <p className="text-on-surface-variant leading-relaxed">
              {en
                ? 'To be the leading digital platform for Coptic Orthodox Sunday Schools worldwide, making faith education accessible, interactive, and deeply rooted in the traditions of the Apostolic Church.'
                : 'أن نكون المنصة الرقمية الرائدة لمدارس الأحد القبطية الأرثوذكسية حول العالم، مما يجعل تعليم الإيمان متاحاً وتفاعلياً ومتجذراً في تقاليد الكنيسة الرسولية.'}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-tertiary">flag</span>
            </div>
            <h2 className="text-2xl font-extrabold text-on-surface">{en ? 'Our Mission' : 'مهمتنا'}</h2>
            <p className="text-on-surface-variant leading-relaxed">
              {en
                ? 'To connect children, parents, and servants through a modern digital platform that uses gamification, interactive lessons, and community tools to foster spiritual growth rooted in Coptic Orthodox theology.'
                : 'ربط الأطفال وأولياء الأمور والخدام من خلال منصة رقمية حديثة تستخدم الألعاب والدروس التفاعلية وأدوات المجتمع لتعزيز النمو الروحي المتجذر في اللاهوت القبطي الأرثوذكسي.'}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* About Sunday School */}
      <section className="bg-surface-container-low py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6 text-center">
          <h2 className="text-3xl font-extrabold text-on-surface">{en ? 'About Sunday School' : 'عن مدارس الأحد'}</h2>
          <p className="text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            {en
              ? 'The Sunday School movement in the Coptic Orthodox Church is a cornerstone of spiritual education, established by Pope Shenouda III and continuing the rich tradition of catechetical instruction that dates back to the early church fathers of Alexandria. Our program follows the official Coptic Orthodox curriculum, covering Bible stories, church history, liturgical life, and the lives of the saints.'
              : 'حركة مدارس الأحد في الكنيسة القبطية الأرثوذكسية هي ركيزة أساسية للتعليم الروحي، أسسها البابا شنودة الثالث واستمرت في التقليد الغني للتعليم المسيحي الذي يعود إلى آباء الكنيسة الأوائل في الإسكندرية.'}
          </p>
        </div>
      </section>

      {/* About the Church */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 space-y-6 text-center">
        <h2 className="text-3xl font-extrabold text-on-surface">{en ? 'About the Church' : 'عن الكنيسة'}</h2>
        <p className="text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
          {en
            ? 'The Coptic Orthodox Church of Alexandria is one of the oldest Christian churches in the world, founded by Saint Mark the Evangelist in the first century. With a rich liturgical tradition spanning over two millennia, our church continues to be a beacon of faith, hope, and charity in the modern world.'
            : 'الكنيسة القبطية الأرثوذكسية بالإسكندرية هي واحدة من أقدم الكنائس المسيحية في العالم، أسسها القديس مرقس الرسول في القرن الأول الميلادي. بتقليد ليتورجي غني يمتد لأكثر من ألفي عام، تستمر كنيستنا في أن تكون منارة للإيمان والرجاء والمحبة.'}
        </p>
      </section>
    </div>
  );
}
