'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Avatar } from '@/components/ui';
import { useUser } from '@/hooks/useUser';
import { useNotificationStore } from '@/stores/notifications.store';

export default function ParentProfile() {
  const { profile } = useUser();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tProfile = useTranslations('profile');
  const addToast = useNotificationStore(s => s.addToast);

  const isAr = tCommon('appName') !== 'JoyfulPath';
  const user = profile;

  const [name, setName] = useState(user?.display_name || 'Samuel Amir');
  const [email, setEmail] = useState(user?.email || 'samuel.amir@example.com');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(tProfile('profileUpdateSuccess'), 'success');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPin || !newPin || !confirmPin) {
      addToast(tProfile('fillAllPin'), 'error');
      return;
    }
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      addToast(tProfile('pinMustBeFour'), 'error');
      return;
    }
    if (newPin !== confirmPin) {
      addToast(tProfile('pinNotMatch'), 'error');
      return;
    }
    addToast(tProfile('pinChangeSuccess'), 'success');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  // Mock children data
  const children = [
    { name: 'Jonathan Junior', level: 3, xp: 450, streak: 5 },
    { name: 'Mary Grace', level: 2, xp: 280, streak: 3 },
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out] max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('profile')}
        </h1>
        <p className="text-on-surface-variant text-sm">
          {tProfile('description')}
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={name} size="lg" className="border-2 border-primary" />
            <div>
              <h2 className="text-xl font-extrabold text-on-surface">{name}</h2>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {isAr ? 'ولي أمر' : 'Parent'}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tProfile('displayName')}</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" size="sm" type="submit">{tCommon('save')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Linked Children */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
            {isAr ? 'الأبناء المرتبطين' : 'Linked Children'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-outline-variant/60">
            {children.map((child, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={child.name} size="sm" className="border border-outline-variant" />
                  <div>
                    <p className="text-sm font-bold text-on-surface">{child.name}</p>
                    <p className="text-[10px] font-bold text-on-surface-variant">
                      {isAr ? `المستوى ${child.level}` : `Level ${child.level}`} • {child.xp} XP • 🔥 {child.streak} {isAr ? 'أيام' : 'days'}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Change PIN */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black">{tProfile('changePin')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleChangePin} className="space-y-4 max-w-sm">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tProfile('currentPin')}</label>
              <Input type="password" maxLength={4} value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} placeholder="••••" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tProfile('newPin')}</label>
              <Input type="password" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="••••" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tProfile('confirmNewPin')}</label>
              <Input type="password" maxLength={4} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} placeholder="••••" />
            </div>
            <Button variant="secondary" size="sm" type="submit">{tProfile('changePinBtn')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
