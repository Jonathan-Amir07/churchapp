'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const currentLocale = useLocale();
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'student' | 'servant'>('student');
  const [loading, setLoading] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLocaleSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=31536000;path=/`;
    window.location.reload();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });
      if (error) addToast(error.message, 'error');
    } catch (err: any) {
      addToast(err.message || 'OAuth error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let authEmail = '';
      let authPassword = '';

      if (activeTab === 'student') {
        if (!username || !pin) {
          addToast(currentLocale === 'en' ? 'Please enter both username and PIN' : 'يرجى إدخال اسم المستخدم ورمز PIN', 'error');
          setLoading(false);
          return;
        }

        // Student Username mapping:
        // Try mapping student1 -> student1@joyfulpath.org (standard seeded template)
        authEmail = username.includes('@') ? username : `${username.trim().toLowerCase()}@joyfulpath.org`;
        authPassword = pin;
      } else {
        if (!email || !password) {
          addToast(currentLocale === 'en' ? 'Please enter both email and password' : 'يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
          setLoading(false);
          return;
        }
        authEmail = email;
        authPassword = password;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });

      if (error) {
        addToast(error.message || t('invalidCredentials'), 'error');
      } else {
        addToast(tCommon('success'), 'success');
        
        // Get user role from app metadata
        const user = data.user;
        const rawRole = user?.app_metadata?.role || user?.user_metadata?.role || 'student';
        const userRole = rawRole;
        
        const redirectPath =
          (userRole === 'admin' || userRole === 'instructor')
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
            <span className="text-2xl font-black tracking-tight">{currentLocale === 'en' ? 'JoyfulPath' : 'مسار الفرح'}</span>
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

          {/* Tab Controls */}
          <div className="flex bg-surface-container rounded-xl p-1.5 border border-outline-variant/30 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-3 text-center text-sm font-black rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
              {currentLocale === 'en' ? 'Student' : 'مخدوم'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('servant')}
              className={`flex-1 py-3 text-center text-sm font-black rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'servant'
                  ? 'bg-surface-container-lowest text-secondary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">school</span>
              {currentLocale === 'en' ? 'Servant / Parent' : 'خادم / ولي أمر'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'student' ? (
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
                  label={t('pin')}
                  type="password"
                  placeholder={t('enterPin')}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  icon="dialpad"
                  maxLength={6}
                  disabled={loading}
                  required
                  showPasswordToggle
                />
              </div>
            ) : (
              <div className="space-y-5 animate-[fade-in_0.3s_ease-out]">
                <Input
                  label={t('email')}
                  type="email"
                  placeholder={t('enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon="mail"
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
            )}

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
              variant={activeTab === 'student' ? 'primary' : 'outline'}
              fullWidth
              size="lg"
              loading={loading}
              className={`mt-4 rounded-xl ${activeTab === 'servant' ? 'border-secondary text-secondary hover:bg-secondary/10' : ''}`}
            >
              {tCommon('submit')}
            </Button>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-outline-variant/60"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-on-surface-variant/80 uppercase">
                {currentLocale === 'en' ? 'Or' : 'أو'}
              </span>
              <div className="flex-grow border-t border-outline-variant/60"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              fullWidth
              size="md"
              disabled={loading}
              onClick={handleGoogleLogin}
              icon="google"
              iconPosition="start"
              className="border-outline-variant rounded-xl text-on-surface font-bold hover:bg-surface-container"
            >
              {currentLocale === 'en' ? 'Continue with Google' : 'الاستمرار باستخدام جوجل'}
            </Button>

            <p className="text-center text-xs font-bold text-on-surface-variant/80 pt-6">
              {currentLocale === 'en' ? "Don't have an account?" : 'ليس لديك حساب؟'}{' '}
              <Link href="/register" className="text-primary hover:underline font-black">
                {currentLocale === 'en' ? 'Register Now' : 'سجل الآن'}
              </Link>
            </p>
          </form>

        </div>
      </Card>
    </div>
  );
}
