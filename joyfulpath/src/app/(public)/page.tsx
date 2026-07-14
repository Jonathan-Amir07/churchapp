'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Card, CardContent } from '@/components/ui';

export default function LandingPage() {
  const currentLocale = useLocale();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    { icon: 'event_available', title: 'Attendance Tracking', titleAr: 'متابعة الحضور والغياب', desc: 'Realtime session roster management for servants.', descAr: 'إدارة كشوف حضور الفصول الدراسية للخادم بشكل فوري.' },
    { icon: 'qr_code_scanner', title: 'QR Attendance Check-In', titleAr: 'تسجيل الحضور بالباركود', desc: 'Secure, fast child check-in scanning on mobile devices.', descAr: 'تسجيل حضور سريع وآمن للطلبة عن طريق مسح رمز الاستجابة السريع.' },
    { icon: 'library_books', title: 'Interactive Sunday School Lessons', titleAr: 'مناهج دروس تفاعلية', desc: 'Rich content with audio bible verses, videos, and PDFs.', descAr: 'محتوى غني بالآيات المسموعة، الفيديوهات التعليمية وملفات القراءة.' },
    { icon: 'sports_esports', title: 'Spiritual Challenges & Tasks', titleAr: 'مسابقات ومهام تفاعلية', desc: 'Earn points and level up by answering fun scripture quizzes.', descAr: 'اجمع النقاط وارتقِ في المستويات عند إجابة مسابقات تفاعلية شيقة.' },
    { icon: 'family_restroom', title: 'Parent Portal', titleAr: 'بوابة أولياء الأمور', desc: 'Keep track of children progress, attendance, and achievements.', descAr: 'متابعة مباشرة لأولياء الأمور لنسب حضور أطفالهم وإنجازاتهم.' },
    { icon: 'military_tech', title: 'Badges & Blessings Store', titleAr: 'متجر بركات وأوسمة فخرية', desc: 'Redeem points for digital titles, avatar frames, and books.', descAr: 'استبدل النقاط بألقاب فخرية للحساب، إطارات للصور الرمزية وبركات عينية.' }
  ];

  const upcomingEvents = [
    { title: 'Summer Camp 2026: Youth Walk', titleAr: 'معسكر الشباب الصيفي: مسار القوة', date: 'July 15 - July 18', type: 'Camp', location: 'Saint Mary Center' },
    { title: 'Scripture Memorization Challenge', titleAr: 'تحدي حفظ آيات الإنجيل الكبرى', date: 'August 1 - August 5', type: 'Spiritual', location: 'Church Hall' },
    { title: 'Historical Saints Trip', titleAr: 'رحلة استكشاف مسار القديسين التاريخي', date: 'September 12', type: 'Trip', location: 'Desert Monasteries' }
  ];

  const testimonials = [
    { quote: "JoyfulPath turned Sunday school into an exciting adventure. I love earning badges!", author: "Jonathan, Child (11 yo)", authorAr: "جون، مخدوم (11 سنة)" },
    { quote: "Being able to see my child's attendance and quiz progress in real-time is amazing.", author: "Mary Faith, Parent", authorAr: "ماري فايث، ولي أمر" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-24 pb-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-dot-pattern bg-surface-container-low py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-start"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-black border border-primary/20">
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              {currentLocale === 'en' ? 'Interactive Sunday School Platform' : 'منصة مدارس الأحد التفاعلية'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-on-surface">
              {currentLocale === 'en' ? 'Explore the Faith Pathway ' : 'استكشف مسار الإيمان '}
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                {currentLocale === 'en' ? 'Together' : 'معًا'}
              </span>
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-lg">
              {currentLocale === 'en'
                ? 'Join a premium gamified learning platform that connects children, parents, and servants for an engaging spiritual growth path.'
                : 'انضم لمنصة تعليمية مشوقة ومبتكرة تربط بين المخدومين، أولياء الأمور وخدام الكنيسة لمسار نمو روحي فريد.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register">
                <Button variant="primary" size="lg" className="rounded-full shadow-elevated">
                  {currentLocale === 'en' ? 'Get Started' : 'ابدأ الآن'}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="rounded-full">
                  {currentLocale === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-primary/10 via-primary-container/20 to-secondary-container/20 border-2 border-outline-variant/60 relative overflow-hidden flex items-center justify-center p-8 shadow-elevated">
              <span className="material-symbols-outlined text-[180px] text-primary/30 animate-[float_6s_ease-in-out_infinite]">
                auto_stories
              </span>
              <div className="absolute top-8 start-8 bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-center gap-3 shadow-md">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">⭐</div>
                <div>
                  <h4 className="text-sm font-extrabold text-on-surface">Level 3 Reached</h4>
                  <p className="text-xs text-on-surface-variant font-medium">Earned +50 XP Today</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
            {currentLocale === 'en' ? 'Spiritual Growth & Enrichment' : 'النمو والتمكين الروحي'}
          </h2>
          <p className="text-on-surface-variant text-base max-w-xl mx-auto">
            {currentLocale === 'en'
              ? 'Our mission is to foster interactive learning of biblical history and church tradition.'
              : 'رسالتنا هي تعزيز التعلم التفاعلي لتاريخ الكتاب المقدس والتقاليد الكنسية العريقة.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-8 space-y-4 text-start">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">explore</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">{currentLocale === 'en' ? 'Explore Missions' : 'استكشاف المهام'}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {currentLocale === 'en' ? 'Complete lessons to build knowledge and strengthen faith path.' : 'أكمل الدروس لبناء المعرفة وتقوية مسار الإيمان.'}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-8 space-y-4 text-start">
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                <span className="material-symbols-outlined text-[28px]">emoji_events</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">{currentLocale === 'en' ? 'Earn Rewards' : 'اجمع الجوائز'}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {currentLocale === 'en' ? 'Redeem accumulated study points for real rewards.' : 'استبدل نقاط الدراسة المتراكمة بمكافآت حقيقية.'}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardContent className="p-8 space-y-4 text-start">
              <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[28px]">volunteer_activism</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">{currentLocale === 'en' ? 'Stay Connected' : 'تواصل مستمر'}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {currentLocale === 'en' ? 'Connect parents and servants to track attendance and lessons.' : 'الربط بين أولياء الأمور والخدام لمتابعة الدروس والحضور.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="bg-surface-container-low py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
              {currentLocale === 'en' ? 'Powerful Platform Features' : 'مميزات المنصة الشاملة'}
            </h2>
            <p className="text-on-surface-variant text-base max-w-xl mx-auto">
              {currentLocale === 'en' ? 'Designed for modern churches.' : 'مصممة خصيصًا لتلائم الكنائس العصرية.'}
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:translate-y-[-4px] transition-transform duration-200">
                  <CardContent className="p-6 text-start space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[24px]">{feat.icon}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-on-surface">
                      {currentLocale === 'en' ? feat.title : feat.titleAr}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {currentLocale === 'en' ? feat.desc : feat.descAr}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
            {currentLocale === 'en' ? 'Upcoming Events & Camps' : 'الفعاليات والمعسكرات القادمة'}
          </h2>
          <p className="text-on-surface-variant text-base max-w-xl mx-auto">
            {currentLocale === 'en' ? 'Register and participate in church social activities.' : 'سجل وشارك في الأنشطة والرحلات الكنسية المتنوعة.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.map((ev, idx) => (
            <Card key={idx} className="border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden text-start">
              <div className="h-2 bg-primary-container" />
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{ev.type}</span>
                  <span className="text-xs font-bold text-on-surface-variant">{ev.date}</span>
                </div>
                <h3 className="text-base font-extrabold text-on-surface">
                  {currentLocale === 'en' ? ev.title : ev.titleAr}
                </h3>
                <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>{ev.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-surface-container-low py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">
            {currentLocale === 'en' ? 'Loved by Students & Parents' : 'منصة محبوبة من الطلاب وأولياء الأمور'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="border border-outline-variant bg-surface-container-lowest p-6 text-start shadow-sm relative">
                <CardContent className="space-y-4 pt-4">
                  <p className="text-sm italic text-on-surface-variant leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <h4 className="text-xs font-bold text-primary">
                    - {currentLocale === 'en' ? t.author : t.authorAr}
                  </h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="max-w-lg mx-auto px-4 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">
            {currentLocale === 'en' ? 'Contact Us' : 'تواصل معنا'}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {currentLocale === 'en' ? 'Have questions? Send us a message.' : 'لديك استفسار؟ راسلنا فوراً.'}
          </p>
        </div>

        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleContactSubmit} className="space-y-4 text-start">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1.5">
                  {currentLocale === 'en' ? 'Your Name' : 'الاسم'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1.5">
                  {currentLocale === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1.5">
                  {currentLocale === 'en' ? 'Message' : 'الرسالة'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium resize-none"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="md" disabled={submitted}>
                {submitted ? (currentLocale === 'en' ? 'Sent!' : 'تم الإرسال!') : (currentLocale === 'en' ? 'Send Message' : 'إرسال الرسالة')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
