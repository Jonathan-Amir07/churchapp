'use client';

import { useLocale } from 'next-intl';
import { Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';

export default function PendingApprovalPage() {
  const currentLocale = useLocale();

  return (
    <div className="w-full relative py-6 md:py-12 max-w-lg mx-auto flex items-center justify-center">
      <Card variant="elevated" className="w-full overflow-hidden border border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md shadow-2xl rounded-3xl">
        <CardContent className="p-8 md:p-12 text-center space-y-6 relative">
          <div className="absolute inset-0 bg-coptic-pattern opacity-5 mix-blend-overlay pointer-events-none" />
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-inner relative">
              <span className="material-symbols-outlined text-[40px] text-secondary">hourglass_empty</span>
              {/* Optional animated pulse */}
              <div className="absolute inset-0 rounded-full bg-secondary/20 animate-pulse-soft" style={{ animationDuration: '2s' }}></div>
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-on-surface relative z-10">
            {currentLocale === 'en' ? 'Account Pending Approval' : 'الحساب قيد المراجعة'}
          </h1>
          
          <p className="text-on-surface-variant font-medium text-base md:text-lg leading-relaxed relative z-10">
            {currentLocale === 'en' 
              ? 'Thank you for registering! Your account is currently pending approval from the church administration. You will be notified once your account is activated.' 
              : 'شكراً لتسجيلك! حسابك حالياً قيد المراجعة من قبل إدارة الكنيسة. سيتم إشعارك فور تفعيل الحساب.'}
          </p>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant mt-4 relative z-10">
            <p className="text-sm text-on-surface font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">admin_panel_settings</span>
              {currentLocale === 'en' ? 'Approval usually takes 24-48 hours.' : 'تستغرق المراجعة عادة بين 24-48 ساعة.'}
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <Link href="/" className="block w-full">
              <Button variant="outline" fullWidth size="lg" className="rounded-xl shadow-md font-extrabold border-outline-variant">
                {currentLocale === 'en' ? 'Return to Home' : 'العودة للصفحة الرئيسية'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
