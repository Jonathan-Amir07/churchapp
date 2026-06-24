'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';

export default function StudentProfile() {
  const { data: session } = useSession();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');

  const user = session?.user;

  const [name, setName] = useState(user?.name || 'Mary Faith');
  const [username, setUsername] = useState(user?.username || 'mary_faith');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Success! Profile updated successfully.');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPin || !newPin || !confirmPin) {
      alert('Error: Please fill all PIN fields!');
      return;
    }
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      alert('Error: PIN must be a 4-digit number!');
      return;
    }
    if (newPin !== confirmPin) {
      alert('Error: New PIN and confirm PIN do not match!');
      return;
    }
    alert('Success! Your PIN has been changed successfully.');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out] max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {tNav('profile')}
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          Manage your personal account details, change your PIN, and check your overall platform stats.
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
              Level {user?.currentLevel?.number || 2} ({user?.currentLevel?.title || 'Seedling'})
            </p>
          </div>
          
          <div className="w-full border-t border-outline-variant/60 mt-6 pt-4 flex justify-around text-center">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-on-surface-variant">XP</p>
              <p className="text-sm font-black text-primary">{user?.totalXp || 380}</p>
            </div>
            <div className="w-[1px] h-6 bg-outline-variant/60" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-on-surface-variant">Points</p>
              <p className="text-sm font-black text-secondary">{user?.totalPoints || 75}</p>
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
                    <label className="text-xs font-bold text-on-surface-variant">{tCommon('appName') === 'JoyfulPath' ? 'Display Name' : 'اسم العرض'}</label>
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
              <CardTitle className="text-lg font-black">Change Security PIN</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant">Current PIN</label>
                    <Input
                      type="password"
                      maxLength={4}
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      placeholder="••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant">New PIN</label>
                    <Input
                      type="password"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant">Confirm New PIN</label>
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
                    Change PIN
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
