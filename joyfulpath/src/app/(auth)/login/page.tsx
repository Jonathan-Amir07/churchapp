'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
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
          addToast('Please enter both username and PIN', 'error');
          setLoading(false);
          return;
        }

        // Student Username mapping:
        // Try mapping student1 -> student1@joyfulpath.org (standard seeded template)
        authEmail = username.includes('@') ? username : `${username.trim().toLowerCase()}@joyfulpath.org`;
        authPassword = pin;
      } else {
        if (!email || !password) {
          addToast('Please enter both email and password', 'error');
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
        const userRole = user?.app_metadata?.role || user?.user_metadata?.role || 'student';
        
        const redirectPath =
          userRole === 'admin'
            ? `/admin/dashboard`
            : userRole === 'instructor'
            ? `/instructor/dashboard`
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
    <div className="w-full relative py-12 max-w-md mx-auto">
      {/* Floating Language Switcher */}
      <div className="absolute -top-4 end-0 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocaleSwitch}
          className="flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant hover:bg-surface-container-low transition-all shadow-sm rounded-full py-1.5 px-3.5 text-sm"
          icon="language"
          iconPosition="start"
        >
          {currentLocale === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <Card variant="elevated" className="overflow-hidden border border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md shadow-elevated">
        <div className="h-2 bg-gradient-to-r from-primary via-primary-container to-secondary-container" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
              <span className="material-symbols-outlined text-[36px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_stories
              </span>
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tCommon('appName')}
          </CardTitle>
          <CardDescription className="text-sm font-medium text-on-surface-variant/80 mt-1.5">
            {t('welcomeBack')}
          </CardDescription>
        </CardHeader>

        {/* Tab Controls */}
        <div className="px-6 pb-2">
          <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant/30">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-3 text-center text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">sentiment_satisfied</span>
              {t('studentLogin')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('servant')}
              className={`flex-1 py-3 text-center text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'servant'
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">school</span>
              {t('instructorLogin')}
            </button>
          </div>
        </div>

        <CardContent className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'student' ? (
              // Student Inputs
              <div className="space-y-4">
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
                  icon="lock"
                  maxLength={6}
                  disabled={loading}
                  required
                  showPasswordToggle
                />
              </div>
            ) : (
              // Servant Inputs
              <div className="space-y-4">
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

            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" />
                {t('rememberMe')}
              </label>
              <Link href="/forgot-password" className="text-primary hover:underline">
                {currentLocale === 'en' ? 'Forgot Password?' : 'نسيت كلمة المرور؟'}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6"
            >
              {tCommon('submit')}
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-outline-variant/60"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-on-surface-variant/80">OR</span>
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
              className="border-outline-variant text-on-surface hover:bg-surface-container"
            >
              {currentLocale === 'en' ? 'Continue with Google' : 'الاستمرار باستخدام جوجل'}
            </Button>

            <p className="text-center text-xs font-semibold text-on-surface-variant/80 mt-4">
              {currentLocale === 'en' ? "Don't have an account?" : 'ليس لديك حساب؟'}{' '}
              <Link href="/register" className="text-primary hover:underline font-bold">
                {currentLocale === 'en' ? 'Register Now' : 'سجل الآن'}
              </Link>
            </p>
          </form>
        </CardContent>

        <div className="bg-surface-container-low/50 py-4 px-6 border-t border-outline-variant text-center flex items-center justify-between text-xs text-on-surface-variant/70 font-semibold">
          <a href="#" className="hover:text-primary transition-colors">{t('needHelp')}</a>
          <a href="#" className="hover:text-primary transition-colors">{t('privacyPolicy')}</a>
        </div>
      </Card>
    </div>
  );
}
