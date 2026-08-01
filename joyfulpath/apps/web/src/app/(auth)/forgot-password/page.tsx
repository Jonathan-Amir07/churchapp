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

        <CardContent className="p-6 pt-4 text-center space-y-6">
          <div className="bg-surface-container rounded-xl p-6 text-on-surface">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3">contact_support</span>
            <p className="text-sm font-semibold leading-relaxed">
              {currentLocale === 'en' 
                ? 'For security reasons, password resets are managed by the church administration. Please contact your Sunday School servant or the church office to reset your password.' 
                : 'لأسباب أمنية، تتم إدارة إعادة تعيين كلمة المرور من قبل إدارة الكنيسة. يرجى الاتصال بخادم مدارس الأحد أو مكتب الكنيسة لإعادة تعيين كلمة المرور الخاصة بك.'}
            </p>
          </div>

          <Link href="/login" className="block w-full mt-6">
            <Button
              variant="outline"
              fullWidth
              size="lg"
            >
              {currentLocale === 'en' ? 'Back to Sign In' : 'العودة لتسجيل الدخول'}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
