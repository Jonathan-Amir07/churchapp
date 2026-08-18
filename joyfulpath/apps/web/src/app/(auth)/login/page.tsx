'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const currentLocale = useLocale();
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);

  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLocaleSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=31536000;path=/`;
    window.location.reload();
  };

  // OAuth login removed as per Phase 1 - Admin managed accounts only

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!username || !password) {
        addToast(currentLocale === 'en' ? 'Please enter both username and password' : 'يرجى إدخال اسم المستخدم وكلمة المرور', 'error');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          role
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        addToast(errorData.message || t('invalidCredentials'), 'error');
      } else {
        const data = await res.json();
        addToast(tCommon('success'), 'success');
        
        // Save token
        document.cookie = `ACCESS_TOKEN=${data.access_token}; path=/; max-age=${2 * 60 * 60}`;
        
        const user = data.user;
        if (user.forcePasswordChange) {
          document.cookie = `HAS_CHANGED_PASSWORD=false; path=/`;
          router.refresh();
          router.push('/change-password');
          return;
        }

        const userRole = user.role;
        
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
      console.error('Login submit error:', err);
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
              {currentLocale === 'en' ? 'Continue Your Spiritual Journey' : 'أكمل مسارك الروحي'}
            </h2>
            <p className="text-primary-container-on font-medium text-lg opacity-90 leading-relaxed">
              {currentLocale === 'en' 
                ? 'Join your Sunday School class, learn biblical history, and earn spiritual blessings along the way.'
                : 'انضم لفصل مدارس الأحد، وتعلم تاريخ الكتاب المقدس، واحصل على بركات روحية في مسارك.'}
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-16">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[36px] text-secondary">church</span>
                <div>
                  <h4 className="font-extrabold text-sm">{currentLocale === 'en' ? 'Coptic Orthodox Tradition' : 'التراث القبطي الأرثوذكسي'}</h4>
                  <p className="text-xs opacity-80 mt-1 font-medium">{currentLocale === 'en' ? 'Rooted in the ancient faith.' : 'متجذر في الإيمان المستقيم العريق.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          <div className="text-center mb-8 md:hidden">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-secondary/30 shadow-md">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary">
                  <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface mb-2">{tCommon('appName')}</h1>
            <p className="text-sm font-medium text-on-surface-variant">{t('welcomeBack')}</p>
          </div>

          <div className="hidden md:block mb-10">
            <h2 className="text-3xl font-extrabold text-on-surface">{tCommon('appName')}</h2>
            <p className="text-sm font-medium text-on-surface-variant mt-2">{t('welcomeBack')}</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
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
                <option value="instructor">{currentLocale === 'en' ? 'Instructor' : 'خادم'}</option>
                <option value="admin">{currentLocale === 'en' ? 'Admin' : 'أمين خدمة'}</option>
                <option value="priest">{currentLocale === 'en' ? 'Priest / Senior Admin' : 'كاهن'}</option>
              </select>
              <div className="absolute inset-y-0 end-0 flex items-center px-4 pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-5 animate-[fade-in_0.3s_ease-out]">
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
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" />
                {t('rememberMe')}
              </label>
              <Link href="/forgot-password" className="text-secondary hover:underline">
                {currentLocale === 'en' ? 'Forgot Password?' : 'نسيت كلمة المرور؟'}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-4 rounded-xl shadow-md"
            >
              {tCommon('submit')}
            </Button>
          </form>

          {/* Quick Demo Login Pills */}
          <div className="mt-8 pt-6 border-t border-outline-variant/60">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant mb-3 text-center">
              {currentLocale === 'en' ? '⚡ 1-Click Quick Demo Logins' : '⚡ تسجيل دخول تجريبي سريع بنقرة واحدة'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { roleName: 'student', label: currentLocale === 'en' ? '🎓 Student' : '🎓 مخدوم', user: 'test_student' },
                { roleName: 'parent', label: currentLocale === 'en' ? '👨‍👩‍👧 Parent' : '👨‍👩‍👧 ولي أمر', user: 'test_parent' },
                { roleName: 'instructor', label: currentLocale === 'en' ? '📖 Instructor' : '📖 خادم', user: 'test_instructor' },
                { roleName: 'admin', label: currentLocale === 'en' ? '⚙️ Admin' : '⚙️ أمين خدمة', user: 'test_admin' },
                { roleName: 'priest', label: currentLocale === 'en' ? '⛪ Priest' : '⛪ كاهن', user: 'test_priest' },
              ].map((acc) => (
                <button
                  key={acc.roleName}
                  type="button"
                  onClick={() => {
                    setRole(acc.roleName);
                    setUsername(acc.user);
                    setPassword('password123');
                  }}
                  className="px-2.5 py-2 rounded-xl text-xs font-extrabold border border-outline-variant hover:border-primary hover:bg-primary/5 active:scale-95 transition-all text-start flex flex-col justify-center"
                >
                  <span className="text-on-surface">{acc.label}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">{acc.user}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-center text-on-surface-variant mt-2 font-medium">
              {currentLocale === 'en' ? 'Password for all demo accounts: password123' : 'كلمة المرور لجميع الحسابات التجريبية: password123'}
            </p>
          </div>

        </div>
      </Card>
    </div>
  );
}
