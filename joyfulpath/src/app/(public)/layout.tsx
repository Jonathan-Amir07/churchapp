'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentLocale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLocaleSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=31536000;path=/`;
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header
        className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/60 shadow-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center border border-secondary/50 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-secondary">
                <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-primary">
              {currentLocale === 'en' ? 'JoyfulPath' : 'مسار الفرح'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-black text-sm text-on-surface-variant">
            <Link href="#about" className="hover:text-primary transition-colors">
              {currentLocale === 'en' ? 'About' : 'عن المنصة'}
            </Link>
            <Link href="#features" className="hover:text-primary transition-colors">
              {currentLocale === 'en' ? 'Features' : 'المميزات'}
            </Link>
            <Link href="#events" className="hover:text-primary transition-colors">
              {currentLocale === 'en' ? 'Events' : 'الفعاليات'}
            </Link>
            <Link href="#testimonials" className="hover:text-primary transition-colors">
              {currentLocale === 'en' ? 'Reviews' : 'الآراء'}
            </Link>
            <Link href="#contact" className="hover:text-primary transition-colors">
              {currentLocale === 'en' ? 'Contact' : 'تواصل معنا'}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLocaleSwitch}
              icon="language"
              iconPosition="start"
              className="rounded-full"
            >
              {currentLocale === 'en' ? 'العربية' : 'English'}
            </Button>
            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-full">
                {currentLocale === 'en' ? 'Sign In' : 'تسجيل الدخول'}
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" className="rounded-full">
                {currentLocale === 'en' ? 'Get Started' : 'ابدأ الآن'}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface flex items-center justify-center p-2 rounded-xl bg-surface-container"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface-container-lowest border-b border-outline-variant py-4 px-6 flex flex-col gap-4 animate-[slide-up_0.2s_ease-out]">
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-on-surface hover:text-primary"
            >
              {currentLocale === 'en' ? 'About' : 'عن المنصة'}
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-on-surface hover:text-primary"
            >
              {currentLocale === 'en' ? 'Features' : 'المميزات'}
            </Link>
            <Link
              href="#events"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-on-surface hover:text-primary"
            >
              {currentLocale === 'en' ? 'Events' : 'الفعاليات'}
            </Link>
            <Link
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-on-surface hover:text-primary"
            >
              {currentLocale === 'en' ? 'Reviews' : 'الآراء'}
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-on-surface hover:text-primary"
            >
              {currentLocale === 'en' ? 'Contact' : 'تواصل معنا'}
            </Link>
            <hr className="border-outline-variant/60" />
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  handleLocaleSwitch();
                  setMobileMenuOpen(false);
                }}
                icon="language"
                iconPosition="start"
              >
                {currentLocale === 'en' ? 'العربية' : 'English'}
              </Button>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="outline" fullWidth>
                  {currentLocale === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="primary" fullWidth>
                  {currentLocale === 'en' ? 'Get Started' : 'ابدأ الآن'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/60 py-12 text-center text-on-surface-variant relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 relative z-10">
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-secondary/30">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-secondary">
                <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-black text-on-surface">{currentLocale === 'en' ? 'JoyfulPath' : 'مسار الفرح'}</span>
          </div>
          <p className="text-sm max-w-md mx-auto leading-relaxed">
            {currentLocale === 'en'
              ? 'Empowering the next generation of faith explorers with modern digital church education and gamified bible learning.'
              : 'تمكين الجيل القادم من مستكشفي الإيمان من خلال منصة تعليمية مسيحية متطورة وألعاب لتعليم الكتاب المقدس.'}
          </p>
          <div className="flex justify-center gap-6 text-sm font-bold">
            <Link href="/privacy" className="hover:text-primary">{currentLocale === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}</Link>
            <Link href="/terms" className="hover:text-primary">{currentLocale === 'en' ? 'Terms of Service' : 'شروط الخدمة'}</Link>
          </div>
          <p className="text-xs opacity-60">
            &copy; {year || ''} {currentLocale === 'en' ? 'JoyfulPath Sunday School. All rights reserved.' : 'مدارس الأحد مسار الفرح. جميع الحقوق محفوظة.'}
          </p>
        </div>
        <div className="absolute inset-0 bg-coptic-pattern opacity-[0.02] pointer-events-none" />
      </footer>
    </div>
  );
}
