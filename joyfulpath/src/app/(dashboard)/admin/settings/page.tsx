'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardHeader, Button, Input } from '@/components/ui';

export default function AdminSettings() {
  const tNav = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const tCommon = useTranslations('common');

  const [maintenance, setMaintenance] = useState(false);
  const [allowRegister, setAllowRegister] = useState(true);
  const [xpMultiplier, setXpMultiplier] = useState(1);
  const [backupLoading, setBackupLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(tSettings('settingsSaved'));
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    // Simulate database backup operation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBackupLoading(false);
    alert(tSettings('backupSuccess'));
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out] max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('settings')}
        </h1>
        <p className="text-on-surface-variant text-sm">
          {tSettings('description')}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Toggle Preferences Card */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">Feature Preferences</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant/60">
              <div className="space-y-0.5">
                <p className="text-sm font-extrabold text-on-surface">{tSettings('maintenanceMode')}</p>
                <p className="text-xs text-on-surface-variant">Temporarily disable platform access for students.</p>
              </div>
              <input
                type="checkbox"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
                className="w-10 h-6 bg-surface-container-high rounded-full appearance-none relative checked:bg-primary before:w-4 before:h-4 before:rounded-full before:bg-outline before:absolute before:top-1 before:left-1 checked:before:left-5 before:transition-all before:duration-200 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant/60">
              <div className="space-y-0.5">
                <p className="text-sm font-extrabold text-on-surface">{tSettings('allowRegistrations')}</p>
                <p className="text-xs text-on-surface-variant">Allow new students to sign up from the login page.</p>
              </div>
              <input
                type="checkbox"
                checked={allowRegister}
                onChange={(e) => setAllowRegister(e.target.checked)}
                className="w-10 h-6 bg-surface-container-high rounded-full appearance-none relative checked:bg-primary before:w-4 before:h-4 before:rounded-full before:bg-outline before:absolute before:top-1 before:left-1 checked:before:left-5 before:transition-all before:duration-200 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Global Multipliers Card */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">Gamification Multipliers</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="max-w-xs space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tSettings('xpMultiplier')}</label>
              <Input
                type="number"
                min={1}
                max={5}
                required
                value={xpMultiplier}
                onChange={(e) => setXpMultiplier(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions panel */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">System Maintenance Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex gap-4 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              loading={backupLoading}
              onClick={handleBackup}
              icon="backup"
              iconPosition="start"
            >
              {tSettings('backupDb')}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="primary" size="md" type="submit">
            {tSettings('saveSettings')}
          </Button>
        </div>
      </form>
    </div>
  );
}
