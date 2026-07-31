'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Card, CardContent } from '@/components/ui';


export default function LandingPage() {
  const currentLocale = useLocale();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message || !name) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  const features = [
    { icon: 'event_available', title: 'Attendance Tracking', titleAr: 'متابعة حضور مدارس الأحد', desc: 'Realtime session roster management for servants.', descAr: 'إدارة كشوف حضور الفصول الدراسية للخادم بشكل فوري.' },
    { icon: 'qr_code_scanner', title: 'QR Check-In', titleAr: 'تسجيل الحضور بالباركود', desc: 'Secure, fast child check-in scanning on mobile devices.', descAr: 'تسجيل حضور سريع وآمن للمخدومين عن طريق مسح رمز الاستجابة السريع.' },
    { icon: 'library_books', title: 'Interactive Lessons', titleAr: 'مناهج دروس تفاعلية', desc: 'Rich content with audio bible verses, videos, and PDFs.', descAr: 'محتوى غني بالآيات المسموعة، الفيديوهات التعليمية وملفات القراءة.' },
    { icon: 'sports_esports', title: 'Spiritual Tasks', titleAr: 'مهام روحية تفاعلية', desc: 'Earn points and level up by answering fun scripture quizzes.', descAr: 'اجمع النقاط وارتقِ في المستويات عند إجابة مسابقات تفاعلية شيقة.' },
    { icon: 'family_restroom', title: 'Parent Portal', titleAr: 'بوابة أولياء الأمور', desc: 'Keep track of children progress, attendance, and achievements.', descAr: 'متابعة مباشرة لأولياء الأمور لنسب حضور أبنائهم وإنجازاتهم.' },
    { icon: 'military_tech', title: 'Blessings Store', titleAr: 'متجر البركات', desc: 'Redeem points for digital titles, avatar frames, and books.', descAr: 'استبدل النقاط بألقاب فخرية للحساب، إطارات للصور الرمزية وبركات عينية.' }
  ];

  const upcomingEvents = [
    { title: 'Summer Camp 2026: Youth Walk', titleAr: 'معسكر الشباب الصيفي: مسار القوة', date: 'July 15 - July 18', type: 'Camp', location: 'Saint Mary Center' },
    { title: 'Scripture Memorization Challenge', titleAr: 'تحدي حفظ آيات الإنجيل الكبرى', date: 'August 1 - August 5', type: 'Spiritual', location: 'Church Hall' },
    { title: 'Historical Saints Trip', titleAr: 'رحلة استكشاف مسار القديسين التاريخي', date: 'September 12', type: 'Trip', location: 'Desert Monasteries' }
  ];

  const announcements = [
    { title: 'New Sunday School Curriculum', titleAr: 'منهج مدارس الأحد الجديد', date: 'Oct 1', desc: 'We have updated our lessons to align with the new Synod curriculum.', descAr: 'تم تحديث المناهج لتتوافق مع مقررات المجمع المقدس الجديدة.' },
    { title: 'Parents Meeting', titleAr: 'اجتماع أولياء الأمور', date: 'Oct 5', desc: 'Join us after the Divine Liturgy to discuss the new platform features.', descAr: 'انضموا إلينا بعد القداس الإلهي لمناقشة مميزات المنصة الجديدة.' },
    { title: 'Saint Mary Fast Starts', titleAr: 'بدء صوم العذراء مريم', date: 'Aug 7', desc: 'Daily masses and evening praises during the holy fast.', descAr: 'قداسات يومية وتسبحة عشية خلال فترة الصوم المقدس.' }
  ];

  const testimonials = [
    { quote: "JoyfulPath turned Sunday school into an exciting adventure. I love earning badges!", author: "Jonathan, Child (11 yo)", authorAr: "جون، مخدوم (11 سنة)" },
    { quote: "Being able to see my child's attendance and quiz progress in real-time is amazing.", author: "Mary Faith, Parent", authorAr: "ماري فايث، ولي أمر" }
  ];

  const faqs = [
    { q: 'How do I register my child?', qAr: 'كيف أسجل طفلي؟', a: 'You can create a Parent account and then add your child from your dashboard.', aAr: 'يمكنك إنشاء حساب ولي أمر ثم إضافة طفلك من لوحة التحكم الخاصة بك.' },
    { q: 'Can servants track attendance offline?', qAr: 'هل يمكن للخدام تسجيل الحضور بدون إنترنت؟', a: 'Yes! The PWA supports offline QR scanning that syncs when you reconnect.', aAr: 'نعم! التطبيق يدعم مسح الباركود بدون إنترنت ويقوم بالمزامنة عند الاتصال مجدداً.' },
    { q: 'How does the Blessings Store work?', qAr: 'كيف يعمل متجر البركات؟', a: 'Students earn points from quizzes and tasks, which they can redeem for physical or digital rewards chosen by the church.', aAr: 'يجمع المخدومون النقاط من المهام والاختبارات، ويستبدلونها بمكافآت عينية أو رقمية تحددها الكنيسة.' },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const statistics = [
    { label: 'Students', labelAr: 'مخدوم', value: '500+', icon: 'school' },
    { label: 'Servants', labelAr: 'خادم', value: '50+', icon: 'group' },
    { label: 'Lessons', labelAr: 'درس', value: '120+', icon: 'menu_book' },
    { label: 'Badges Earned', labelAr: 'شارة منجزة', value: '2k+', icon: 'workspace_premium' }
  ];

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=500&q=80', alt: 'Sunday School Children', altAr: 'أطفال مدارس الأحد' },
    { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80', alt: 'Church Event', altAr: 'حدث كنسي' },
    { src: 'https://images.unsplash.com/photo-1601142634808-38923eb7c560?w=500&q=80', alt: 'Bible Study', altAr: 'دراسة الكتاب' },
    { src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=500&q=80', alt: 'Youth Group', altAr: 'اجتماع الشباب' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-24 pb-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-surface-container-lowest py-12 overflow-hidden">
        <div className="absolute inset-0 bg-coptic-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-surface-container-lowest z-10" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary-container text-sm font-black border border-secondary/30">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {currentLocale === 'en' ? 'Coptic Orthodox Sunday School Platform' : 'منصة مدارس الأحد القبطية الأرثوذكسية'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-on-surface">
              {currentLocale === 'en' ? 'Explore the Faith Pathway ' : 'استكشف مسار الإيمان '}
              <span className="text-secondary">
                {currentLocale === 'en' ? 'Together' : 'معًا'}
              </span>
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-lg">
              {currentLocale === 'en'
                ? 'Join a premium gamified learning platform that connects children, parents, and servants for an engaging spiritual growth path.'
                : 'انضم لمنصة تعليمية مشوقة ومبتكرة تربط بين المخدومين، أولياء الأمور وخدام الكنيسة لمسار نمو روحي فريد.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">

              <Link href="/login">
                <Button variant="outline" size="lg" className="rounded-full px-8 border-secondary/50 text-secondary-container hover:bg-secondary/10">
                  {currentLocale === 'en' ? 'Servant / Parent Login' : 'دخول الخدام / أولياء الأمور'}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg aspect-square rounded-[3rem] bg-gradient-to-br from-primary via-primary-container to-secondary border-4 border-surface-container-lowest relative overflow-hidden flex items-center justify-center p-8 shadow-2xl">
              <div className="absolute inset-0 bg-coptic-pattern opacity-20 mix-blend-overlay" />
              
              {/* Church Silhouette / Illustration Placeholder */}
              <span className="material-symbols-outlined text-[160px] text-white/80 animate-[float_6s_ease-in-out_infinite] drop-shadow-xl z-10">
                church
              </span>
              
              {/* Floating notification badge */}
              <div className="absolute bottom-12 start-[-20px] md:start-[-40px] bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-center gap-4 shadow-xl z-20 animate-[slide-in-right_1s_ease-out]">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-container font-bold text-xl border border-secondary/50 shadow-[0_0_15px_rgba(201,168,76,0.4)]">⭐</div>
                <div>
                  <h4 className="text-sm font-extrabold text-on-surface">{currentLocale === 'en' ? 'New Badge Unlocked!' : 'حصلت على شارة جديدة!'}</h4>
                  <p className="text-xs text-on-surface-variant font-bold text-primary">{currentLocale === 'en' ? 'Bible Scholar (+50 XP)' : 'عالم الكتاب المقدس (+50 خبرة)'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Weekly Verse (آية الأسبوع) */}
      <section className="max-w-4xl mx-auto px-4 relative z-20 -mt-16">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-elevated border-2 border-secondary/30 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="absolute inset-0 bg-coptic-pattern opacity-5 pointer-events-none" />
          
          <h3 className="text-secondary-container font-black tracking-widest uppercase text-sm mb-6 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            {currentLocale === 'en' ? 'Verse of the Week' : 'آية الأسبوع'}
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </h3>
          
          <blockquote className="text-2xl md:text-4xl font-extrabold text-on-surface leading-snug mb-6 relative z-10">
            &quot;فَرَحًا أَفْرَحُ بِالرَّبِّ، تَبْتَهِجُ نَفْسِي بِإِلهِي، لأَنَّهُ قَدْ أَلْبَسَنِي ثِيَابَ الْخَلاَصِ، كَسَانِي رِدَاءَ الْبِرِّ&quot;
          </blockquote>
          <cite className="text-lg font-bold text-primary relative z-10">(إشعياء 61: 10)</cite>
        </div>
      </section>

      {/* About the Service & Sunday School */}
      <section id="about" className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
              {currentLocale === 'en' ? 'Vision & Mission' : 'رؤيتنا ورسالتنا'}
            </h2>
            <div className="w-24 h-1.5 bg-secondary rounded-full" />
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-medium">
              {currentLocale === 'en'
                ? 'Our mission is to foster interactive learning of biblical history and Coptic Orthodox church tradition in a modern, engaging environment.'
                : 'رسالتنا هي تعزيز التعلم التفاعلي لتاريخ الكتاب المقدس والتقاليد الكنسية القبطية الأرثوذكسية في بيئة عصرية ومشوقة.'}
            </p>
          </div>
          
          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-coptic-pattern opacity-5 pointer-events-none" />
            <h3 className="text-2xl font-extrabold text-on-surface mb-4 flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-primary text-[28px]">import_contacts</span>
              {currentLocale === 'en' ? 'About Sunday School' : 'عن مدارس الأحد'}
            </h3>
            <p className="text-on-surface-variant text-base leading-relaxed font-medium relative z-10">
              {currentLocale === 'en'
                ? 'Sunday School was founded by St. Archdeacon Habib Girgis to preserve the Coptic faith across generations. JoyfulPath honors this legacy by using modern technology to connect our youth with the timeless wisdom of the Church fathers.'
                : 'تأسست مدارس الأحد على يد القديس الأرشيدياكون حبيب جرجس للحفاظ على الإيمان القبطي عبر الأجيال. تكرم مسار الفرح هذا التراث باستخدام التكنولوجيا الحديثة لربط شبابنا بحكمة آباء الكنيسة الخالدة.'}
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-primary text-on-primary py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center space-y-2">
                <span className="material-symbols-outlined text-[40px] text-secondary/80">{stat.icon}</span>
                <span className="text-3xl md:text-5xl font-black">{stat.value}</span>
                <span className="text-sm font-bold opacity-80 uppercase tracking-wider">{currentLocale === 'en' ? stat.label : stat.labelAr}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Saint of the Month & Announcements */}
      <section className="bg-surface-container-low py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Saint of the Month */}
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold text-on-surface flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-container">
                <span className="material-symbols-outlined">person_celebrate</span>
              </span>
              {currentLocale === 'en' ? 'Saint of the Month' : 'قديس الشهر'}
            </h3>
            
            <Card className="border-none bg-gradient-to-br from-primary/90 to-primary-container text-on-primary shadow-elevated relative overflow-hidden">
              <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
              <CardContent className="p-8 relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-start">
                <div className="w-32 h-32 rounded-2xl bg-surface-container-lowest/20 backdrop-blur border-2 border-secondary/50 flex shrink-0 items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-[64px] text-secondary">account_balance</span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-secondary">
                    {currentLocale === 'en' ? 'St. Pope Kyrillos VI' : 'البابا كيرلس السادس'}
                  </h4>
                  <p className="text-sm font-medium leading-relaxed opacity-90">
                    {currentLocale === 'en' 
                      ? 'The 116th Pope of Alexandria, known for his life of continuous prayer, miracles, and building the Saint Mina Monastery.'
                      : 'البابا المائة والسادس عشر في سلسلة الآباء البطاركة، عُرف بحياة الصلاة المستمرة والمعجزات وتأسيس دير الشهيد مارمينا.'}
                  </p>
                  <Link href="/saints">
                    <Button variant="outline" size="sm" className="mt-2 text-on-primary border-on-primary/50 hover:bg-on-primary/10">
                      {currentLocale === 'en' ? 'Read Full Story' : 'اقرأ القصة الكاملة'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Church Announcements */}
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold text-on-surface flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">campaign</span>
              </span>
              {currentLocale === 'en' ? 'Church Announcements' : 'إعلانات الكنيسة'}
            </h3>
            
            <div className="space-y-4">
              {announcements.map((ann, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex gap-4 hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <span className="text-xs font-black text-primary">{ann.date.split(' ')[0]}</span>
                    <span className="text-lg font-black text-on-surface">{ann.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-on-surface">{currentLocale === 'en' ? ann.title : ann.titleAr}</h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">{currentLocale === 'en' ? ann.desc : ann.descAr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-16">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
            {currentLocale === 'en' ? 'Powerful Platform Features' : 'مميزات المنصة الشاملة'}
          </h2>
          <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="h-full border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
                <CardContent className="p-8 text-start space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">{feat.icon}</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-on-surface">
                    {currentLocale === 'en' ? feat.title : feat.titleAr}
                  </h4>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                    {currentLocale === 'en' ? feat.desc : feat.descAr}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="bg-surface-container-low py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
              {currentLocale === 'en' ? 'Upcoming Events' : 'المناسبات القادمة'}
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((ev, idx) => (
              <Card key={idx} className="border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden text-start relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-secondary group-hover:h-2 transition-all" />
                <CardContent className="p-6 pt-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{ev.type}</span>
                    <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">{ev.date}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-on-surface line-clamp-2 min-h-[40px]">
                    {currentLocale === 'en' ? ev.title : ev.titleAr}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">location_on</span>
                    <span>{ev.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 mb-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
            {currentLocale === 'en' ? 'JoyfulPath Gallery' : 'معرض الصور'}
          </h2>
          <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-surface-container-high relative group">
              <Image 
                src={img.src} 
                alt={currentLocale === 'en' ? img.alt : img.altAr} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">

                <span className="text-white font-bold text-sm">
                  {currentLocale === 'en' ? img.alt : img.altAr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-5xl mx-auto px-4 text-center space-y-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface">
          {currentLocale === 'en' ? 'Loved by the Congregation' : 'آراء المخدومين والخدام'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant text-start relative">
              <span className="material-symbols-outlined absolute top-4 end-4 text-[48px] text-primary/10">format_quote</span>
              <p className="text-base md:text-lg italic font-medium text-on-surface-variant leading-relaxed relative z-10 mb-6">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-container font-black">
                  {currentLocale === 'en' ? t.author[0] : t.authorAr[0]}
                </div>
                <h4 className="text-sm font-black text-on-surface">
                  {currentLocale === 'en' ? t.author : t.authorAr}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-surface-container-low py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface">
              {currentLocale === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
            </h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden transition-all duration-200">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-start hover:bg-surface-container-low transition-colors focus:outline-none"
                >
                  <span className="text-base font-extrabold text-on-surface">
                    {currentLocale === 'en' ? faq.q : faq.qAr}
                  </span>
                  <span className="material-symbols-outlined text-primary transition-transform duration-300" style={{ transform: openFaqIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="p-6 pt-0 text-sm font-medium text-on-surface-variant leading-relaxed">
                    {currentLocale === 'en' ? faq.a : faq.aAr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="max-w-4xl mx-auto px-4 text-center space-y-10 pb-10">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface">
            {currentLocale === 'en' ? 'Get In Touch' : 'تواصل معنا'}
          </h2>
          <p className="text-base text-on-surface-variant font-medium">
            {currentLocale === 'en' ? 'Have questions about registration or features? Send us a message.' : 'لديك استفسار عن التسجيل أو المنصة؟ راسلنا فوراً.'}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl shadow-elevated border border-outline-variant p-2 flex flex-col md:flex-row gap-6">
          
          <div className="md:w-1/2 p-6 md:p-8 text-start space-y-6">
            <h3 className="text-2xl font-black text-on-surface">
              {currentLocale === 'en' ? 'Send Message' : 'إرسال رسالة'}
            </h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <input type="text" required placeholder={currentLocale === 'en' ? 'Your Name' : 'الاسم الكامل'} value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-bold" />
              </div>
              <div>
                <input type="email" required placeholder={currentLocale === 'en' ? 'Email Address' : 'البريد الإلكتروني'} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-bold" />
              </div>
              <div>
                <textarea required rows={4} placeholder={currentLocale === 'en' ? 'Your Message...' : 'اكتب رسالتك هنا...'} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-bold resize-none" />
              </div>
              <Button type="submit" variant="primary" fullWidth size="lg" disabled={submitted} className="rounded-xl shadow-md">
                {submitted ? (currentLocale === 'en' ? 'Sent successfully!' : 'تم الإرسال بنجاح!') : (currentLocale === 'en' ? 'Send Message' : 'إرسال الرسالة')}
              </Button>
            </form>
          </div>
          
          <div className="md:w-1/2 bg-surface-container-low rounded-2xl p-8 flex flex-col justify-center gap-8 text-start border border-outline-variant/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-coptic-pattern opacity-10 pointer-events-none" />
            
            <div className="relative z-10 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div>
                <h4 className="text-base font-black text-on-surface">{currentLocale === 'en' ? 'Church Address' : 'عنوان الكنيسة'}</h4>
                <p className="text-sm font-medium text-on-surface-variant mt-1">123 St. Mark Way, Cairo, Egypt</p>
              </div>
            </div>
            
            <div className="relative z-10 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">mail</span>
              </div>
              <div>
                <h4 className="text-base font-black text-on-surface">{currentLocale === 'en' ? 'Email Us' : 'البريد الإلكتروني'}</h4>
                <p className="text-sm font-medium text-on-surface-variant mt-1">sundayschool@joyfulpath.org</p>
              </div>
            </div>
            
            <div className="relative z-10 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <div>
                <h4 className="text-base font-black text-on-surface">{currentLocale === 'en' ? 'Call Us' : 'اتصل بنا'}</h4>
                <p className="text-sm font-medium text-on-surface-variant mt-1">+20 12 3456 7890</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
