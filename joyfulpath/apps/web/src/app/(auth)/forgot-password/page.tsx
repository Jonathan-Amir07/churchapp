'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const tCommon = useTranslations('common');
  const currentLocale = useLocale();
  const addToast = useNotificationStore((state) => state.addToast);
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        addToast(error.message, 'error');
      } else {
        addToast('Password reset link sent! Check your inbox.', 'success');
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
            {currentLocale === 'en' ? 'Forgot Password' : 'نسيت كلمة المرور'}
          </CardTitle>
          <CardDescription className="text-sm font-medium text-on-surface-variant/80 mt-1.5">
            {currentLocale === 'en' ? 'Enter your email to receive a password reset link' : 'أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين'}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={currentLocale === 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'}
              type="email"
              placeholder="explorer@path.com"
              icon="mail"
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {currentLocale === 'en' ? 'Send Link' : 'إرسال الرابط'}
            </Button>

            <p className="text-center text-xs font-semibold text-on-surface-variant/80 mt-4">
              <Link href="/login" className="text-primary hover:underline">
                {currentLocale === 'en' ? 'Back to Sign In' : 'العودة لتسجيل الدخول'}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
