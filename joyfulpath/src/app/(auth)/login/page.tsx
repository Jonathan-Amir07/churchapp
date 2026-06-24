'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const currentLocale = useLocale();
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);

  const [activeTab, setActiveTab] = useState<'student' | 'servant'>('student');
  const [loading, setLoading] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Switch locale helper
  const handleLocaleSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=31536000;path=/`;
    window.location.reload();
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (activeTab === 'student') {
        if (!username || !pin) {
          addToast('Please enter both username and PIN', 'error');
          setLoading(false);
          return;
        }
        result = await signIn('credentials', {
          username,
          pin,
          redirect: false,
        });
      } else {
        if (!email || !password) {
          addToast('Please enter both email and password', 'error');
          setLoading(false);
          return;
        }
        result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
      }

      if (result?.error) {
        addToast(t('invalidCredentials'), 'error');
      } else {
        addToast(tCommon('success'), 'success');
        // Let middleware route us, or force route based on credentials
        router.refresh();
        router.push('/');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      addToast(tCommon('error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Floating Language Switcher */}
      <div className="absolute -top-14 end-0 z-20">
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
          <form onSubmit={handleSubmit} className="space-y-5">
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
