'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardTitle, CardHeader, Button, Input } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

export default function AdminSettings() {
  const tNav = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);

  const locale = useLocale();
  const isAr = locale === 'ar';
  const [maintenance, setMaintenance] = useState(false);
  const [allowRegister, setAllowRegister] = useState(true);
  const [xpMultiplier, setXpMultiplier] = useState(1);
  const [backupLoading, setBackupLoading] = useState(false);
  const [themePref, setThemePref] = useState<'light' | 'dark' | 'system'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('joyfulpath-theme');
    if (saved === 'dark') setThemePref('dark');
    else if (saved === 'light') setThemePref('light');
    else setThemePref('system');
  }, []);

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setThemePref(value);
    if (value === 'dark') {
      localStorage.setItem('joyfulpath-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else if (value === 'light') {
      localStorage.setItem('joyfulpath-theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.removeItem('joyfulpath-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(tSettings('settingsSaved'), 'success');
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    // Simulate database backup operation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBackupLoading(false);
    addToast(tSettings('backupSuccess'), 'success');
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
        {/* Theme Preference Card */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
              {isAr ? 'المظهر والسمة' : 'Theme & Appearance'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light' as const, icon: 'light_mode', label: isAr ? 'فاتح' : 'Light', color: 'text-yellow-500' },
                { value: 'dark' as const, icon: 'dark_mode', label: isAr ? 'داكن' : 'Dark', color: 'text-indigo-400' },
                { value: 'system' as const, icon: 'desktop_windows', label: isAr ? 'النظام' : 'System', color: 'text-on-surface-variant' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleThemeChange(opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    themePref === opt.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[28px] ${themePref === opt.value ? 'text-primary' : opt.color}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {opt.icon}
                  </span>
                  <span className={`text-xs font-bold ${themePref === opt.value ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {opt.label}
                  </span>
                  {themePref === opt.value && (
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Toggle Preferences Card */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">{tSettings('featurePreferences')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant/60">
              <div className="space-y-0.5">
                <p className="text-sm font-extrabold text-on-surface">{tSettings('maintenanceMode')}</p>
                <p className="text-xs text-on-surface-variant">{tSettings('maintenanceSub')}</p>
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
                <p className="text-xs text-on-surface-variant">{tSettings('allowRegistrationsSub')}</p>
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
            <CardTitle className="text-lg font-black">{tSettings('gamificationMultipliers')}</CardTitle>
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
            <CardTitle className="text-lg font-black">{tSettings('maintenanceActions')}</CardTitle>
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

