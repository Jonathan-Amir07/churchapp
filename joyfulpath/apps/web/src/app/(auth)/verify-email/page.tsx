'use client';

import { useLocale } from 'next-intl';
import { Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const currentLocale = useLocale();

  return (
    <div className="w-full relative py-6 md:py-12 max-w-lg mx-auto flex items-center justify-center">
      <Card variant="elevated" className="w-full overflow-hidden border border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md shadow-2xl rounded-3xl">
        <CardContent className="p-8 md:p-12 text-center space-y-6 relative">
          <div className="absolute inset-0 bg-coptic-pattern opacity-5 mix-blend-overlay pointer-events-none" />
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner relative">
              <span className="material-symbols-outlined text-[40px] text-primary">mark_email_read</span>
              {/* Optional animated ping */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-on-surface relative z-10">
            {currentLocale === 'en' ? 'Check Your Email' : 'تحقق من بريدك الإلكتروني'}
          </h1>
          
          <p className="text-on-surface-variant font-medium text-base md:text-lg leading-relaxed relative z-10">
            {currentLocale === 'en' 
              ? 'We have sent a verification link to your email address. Please click the link to verify your account and continue.' 
              : 'لقد أرسلنا رابط تفعيل إلى عنوان بريدك الإلكتروني. يرجى النقر على الرابط لتفعيل حسابك والمتابعة.'}
          </p>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant mt-4 relative z-10">
            <p className="text-sm text-on-surface font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">info</span>
              {currentLocale === 'en' ? 'Didn\'t receive the email? Check your spam folder.' : 'لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها.'}
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <Link href="/login" className="block w-full">
              <Button variant="primary" fullWidth size="lg" className="rounded-xl shadow-md font-extrabold">
                {currentLocale === 'en' ? 'Back to Login' : 'العودة لتسجيل الدخول'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
