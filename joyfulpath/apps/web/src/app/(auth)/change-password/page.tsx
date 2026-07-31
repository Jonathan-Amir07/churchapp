'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

export default function ChangePasswordPage() {
  const tCommon = useTranslations('common');
  const currentLocale = useLocale();
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      addToast(currentLocale === 'en' ? 'Password must be at least 8 characters' : 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast(currentLocale === 'en' ? "Passwords don't match" : 'كلمات المرور غير متطابقة', 'error');
      return;
    }

    setLoading(true);
    try {
      // In a real supabase app:
      await supabase.auth.updateUser({ password });
      
      // Set our cookie to bypass the first-login check
      document.cookie = 'HAS_CHANGED_PASSWORD=true; path=/; max-age=31536000';

      addToast(currentLocale === 'en' ? 'Password successfully updated!' : 'تم تحديث كلمة المرور بنجاح!', 'success');
      
      // Redirect to root, middleware will route to correct dashboard
      router.refresh();
      router.push('/');
    } catch (err: any) {
      addToast(err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative py-12">
      <Card variant="elevated" className="overflow-hidden border border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md shadow-elevated">
        <div className="h-2 bg-gradient-to-r from-primary via-primary-container to-secondary-container" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <CardTitle className="text-2xl font-extrabold tracking-tight text-on-surface">
            {currentLocale === 'en' ? 'Welcome!' : 'مرحباً!'}
          </CardTitle>
          <CardDescription className="text-sm font-medium text-on-surface-variant/80 mt-1.5 px-4 text-error font-bold">
            {currentLocale === 'en' 
              ? 'For your security, you must change your temporary password to continue.' 
              : 'لسلامتك، يجب عليك تغيير كلمة المرور المؤقتة الخاصة بك للمتابعة.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={currentLocale === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}
              type="password"
              placeholder="••••••••"
              icon="lock"
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              required
            />

            <Input
              label={currentLocale === 'en' ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}
              type="password"
              placeholder="••••••••"
              icon="lock"
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPasswordToggle
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6"
            >
              {currentLocale === 'en' ? 'Update & Continue' : 'تحديث والمتابعة'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
