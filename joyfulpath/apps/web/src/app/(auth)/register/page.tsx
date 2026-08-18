'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import Link from 'next/link';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const currentLocale = useLocale();
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);

  const [loading, setLoading] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleLocaleSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=31536000;path=/`;
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      addToast(currentLocale === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
          role
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        addToast(errorData.message || tCommon('error'), 'error');
      } else {
        const data = await res.json();
        addToast(currentLocale === 'en' ? 'Account created successfully' : 'تم إنشاء الحساب بنجاح', 'success');
        
        // Save token
        document.cookie = `ACCESS_TOKEN=${data.access_token}; path=/; max-age=${2 * 60 * 60}`;
        
        const userRole = data.user.role;
        const redirectPath =
          (userRole === 'admin' || userRole === 'instructor' || userRole === 'priest')
            ? `/admin/dashboard`
            : userRole === 'parent'
            ? `/parent/dashboard`
            : `/student/dashboard`;

        router.refresh();
        router.push(redirectPath);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      addToast(tCommon('error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative py-6 md:py-12 max-w-5xl mx-auto flex">
      {/* Floating Language Switcher */}
      <div className="absolute top-0 end-0 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocaleSwitch}
          className="flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-md border border-secondary/30 hover:bg-surface-container-low transition-all shadow-sm rounded-full py-1.5 px-3.5 text-sm font-bold text-secondary"
          icon="language"
          iconPosition="start"
        >
          {currentLocale === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <Card variant="elevated" className="w-full overflow-hidden border border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md shadow-2xl rounded-3xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Coptic Imagery */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary via-primary-container to-secondary p-12 relative overflow-hidden text-on-primary">
          <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight">{currentLocale === 'en' ? 'newsl w nwasl ll sama' : 'نوصل و نوصل للسماء'}</span>
          </div>

          <div className="relative z-10 space-y-6 max-w-sm mt-12">
            <h2 className="text-4xl font-extrabold leading-tight">
              {currentLocale === 'en' ? 'Start Your Journey Today' : 'ابدأ مسارك اليوم'}
            </h2>
            <p className="text-primary-container-on font-medium text-lg opacity-90 leading-relaxed">
              {currentLocale === 'en' 
                ? 'Create an account to join the Sunday School classes, track your progress, and earn spiritual rewards.'
                : 'أنشئ حساباً للانضمام لفصول مدارس الأحد، وتابع تقدمك، واحصل على مكافآت روحية.'}
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-16">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[36px] text-secondary">groups</span>
                <div>
                  <h4 className="font-extrabold text-sm">{currentLocale === 'en' ? 'Community of Faith' : 'مجتمع الإيمان'}</h4>
                  <p className="text-xs opacity-80 mt-1 font-medium">{currentLocale === 'en' ? 'Grow together in Christ.' : 'ننمو معاً في المسيح.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative max-h-[85vh] overflow-y-auto">
          
          <div className="text-center mb-8 md:hidden">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-secondary/30 shadow-md">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary">
                  <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface mb-2">{currentLocale === 'en' ? 'Create Account' : 'إنشاء حساب'}</h1>
          </div>

          <div className="hidden md:block mb-8">
            <h2 className="text-3xl font-extrabold text-on-surface">{currentLocale === 'en' ? 'Create Account' : 'إنشاء حساب'}</h2>
            <p className="text-sm font-medium text-on-surface-variant mt-2">
              {currentLocale === 'en' ? 'Join the newsl w nwasl ll sama community.' : 'انضم لمجتمع نوصل و نوصل للسماء.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selector */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-on-surface mb-2">
                {currentLocale === 'en' ? 'Select Role' : 'اختر الصلاحية'}
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none bg-surface-container border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                >
                  <option value="student">{currentLocale === 'en' ? 'Student' : 'مخدوم'}</option>
                  <option value="parent">{currentLocale === 'en' ? 'Parent' : 'ولي أمر'}</option>
                </select>
                <div className="absolute inset-y-0 end-0 flex items-center px-4 pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={currentLocale === 'en' ? 'First Name' : 'الاسم الأول'}
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                required
              />
              <Input
                label={currentLocale === 'en' ? 'Last Name' : 'الاسم الأخير'}
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Input
              label={t('username')}
              placeholder={t('enterUsername')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon="person"
              disabled={loading}
              required
            />
            
            <Input
              label={currentLocale === 'en' ? 'Email (Optional)' : 'البريد الإلكتروني (اختياري)'}
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="mail"
              disabled={loading}
            />

            <Input
              label={t('password')}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="lock"
              disabled={loading}
              required
              showPasswordToggle
            />

            <Input
              label={currentLocale === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon="lock"
              disabled={loading}
              required
              showPasswordToggle
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6 rounded-xl"
            >
              {currentLocale === 'en' ? 'Sign Up' : 'تسجيل'}
            </Button>

            <div className="text-center mt-6 text-sm text-on-surface-variant font-medium">
              {currentLocale === 'en' ? 'Already have an account?' : 'لديك حساب بالفعل؟'}{' '}
              <Link href="/login" className="text-primary hover:underline font-bold">
                {currentLocale === 'en' ? 'Log In' : 'تسجيل الدخول'}
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
