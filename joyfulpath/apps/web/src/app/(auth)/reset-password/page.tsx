'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

export default function ResetPasswordPage() {
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
      addToast('Password must be at least 8 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast("Passwords don't match", 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        addToast(error.message, 'error');
      } else {
        addToast('Password successfully updated!', 'success');
        router.push('/login');
      }
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
            {currentLocale === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور'}
          </CardTitle>
          <CardDescription className="text-sm font-medium text-on-surface-variant/80 mt-1.5">
            {currentLocale === 'en' ? 'Enter your new password below' : 'أدخل كلمة المرور الجديدة أدناه'}
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
              {currentLocale === 'en' ? 'Update Password' : 'تحديث كلمة المرور'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
