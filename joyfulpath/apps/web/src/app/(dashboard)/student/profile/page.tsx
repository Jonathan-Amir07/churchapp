'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { useUser } from '@/hooks/useUser';
import { useNotificationStore } from '@/stores/notifications.store';

export default function StudentProfile() {
  const { profile } = useUser();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tProfile = useTranslations('profile');
  const tGamification = useTranslations('gamification');
  const addToast = useNotificationStore(s => s.addToast);

  const user = profile;

  const [name, setName] = useState('Mary Faith');
  const [username, setUsername] = useState('mary_faith');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.display_name);
      setUsername(profile.username);
    }
  }, [profile]);

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

  const levelNum = Math.floor((user?.total_xp || 0) / 300) + 1;

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out] max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('profile')}
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          {tProfile('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Left Card */}
        <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm md:col-span-1 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-outline-variant mb-4">
            <span className="material-symbols-outlined text-[48px] text-primary">person</span>
          </div>
          <div className="space-y-1 w-full">
            <h3 className="text-lg font-black text-on-surface truncate">{name}</h3>
            <p className="text-xs font-bold text-outline">@{username}</p>
            <p className="text-xs font-black uppercase text-secondary mt-1">
              Level {levelNum}
            </p>
          </div>
          
          <div className="w-full border-t border-outline-variant/60 mt-6 pt-4 flex justify-around text-center">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-on-surface-variant">{tGamification('xp')}</p>
              <p className="text-sm font-black text-primary">{user?.total_xp ?? 0}</p>
            </div>
            <div className="w-[1px] h-6 bg-outline-variant/60" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-on-surface-variant">{tGamification('points')}</p>
              <p className="text-sm font-black text-secondary">{user?.total_points ?? 0}</p>
            </div>
          </div>
        </Card>


        {/* Profile Settings Center */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Info Form */}
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black">{tNav('profile')} Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant">{tAuth('username')}</label>
                    <Input
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant">{tProfile('displayName')}</label>
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button variant="primary" size="sm" type="submit">
                    {tCommon('save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change PIN Form */}
          <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black">{tProfile('changePin')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant">{tProfile('currentPin')}</label>
                    <Input
                      type="password"
                      maxLength={4}
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      placeholder="••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant">{tProfile('newPin')}</label>
                    <Input
                      type="password"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant">{tProfile('confirmNewPin')}</label>
                    <Input
                      type="password"
                      maxLength={4}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="••••"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button variant="secondary" size="sm" type="submit">
                    {tProfile('changePinBtn')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
