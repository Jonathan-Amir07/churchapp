'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, Button } from '@/components/ui';

export default function InstructorCRMPage() {
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-10 bg-gradient-to-br from-secondary via-primary-container to-primary text-on-primary shadow-2xl select-none border border-secondary/30">
        <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-white">hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Instructor CRM & Communication
            </h1>
          </div>
          <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
            Manage your class communications, schedule home visits, and track student behavioral notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-blue-600">message</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Direct Messaging</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Send messages directly to parents and students.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md">
              Open Messages
            </Button>
          </div>
        </Card>

        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-orange-600">contact_phone</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Call & Follow-Up Log</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Record and schedule follow-up phone calls with parents.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md">
              Log Phone Call
            </Button>
          </div>
        </Card>

        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-teal-600">home_pin</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Home Visits</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Schedule and log in-person home visits for your students.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md">
              Schedule Visit
            </Button>
          </div>
        </Card>

        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-purple-600">campaign</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Class Announcements</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Broadcast announcements to your specific class or grades.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md">
              New Announcement
            </Button>
          </div>
        </Card>

        <Card variant="interactive" className="border-2 border-secondary/20 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-pink-600">psychology</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Behavioral Notes</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                Keep private notes on student behavior and spiritual growth.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" fullWidth size="md">
              Add Note
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
