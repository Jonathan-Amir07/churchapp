'use client';

import { Card, CardContent, Button, PageTransition, HeroBanner, StaggerContainer, StaggerItem } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function StudentStorePage() {
  const t = useTranslations('store');
  const locale = useLocale();
  const [rewards, setRewards] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const addToast = useNotificationStore(s => s.addToast);

  useEffect(() => {
    async function loadData() {
      try {
        const [rewRes, userRes] = await Promise.all([
          fetch('/api/store/rewards'),
          fetch('/api/users/me')
        ]);
        if (rewRes.ok) {
          const data = await rewRes.json();
          setRewards(Array.isArray(data) ? data : data.data || []);
        }
        if (userRes.ok) {
          const u = await userRes.json();
          setPoints(u.totalPoints || 0);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const handleRedeem = async (rewardId: string) => {
    try {
      const res = await fetch(`/api/store/redeem/${rewardId}`, { method: 'POST' });
      if (res.ok) {
        addToast('Reward redeemed successfully! It will be reviewed by an instructor.', 'success');
        // Refresh points
        const userRes = await fetch('/api/users/me');
        if (userRes.ok) {
          const u = await userRes.json();
          setPoints(u.totalPoints || 0);
        }
      } else {
        const data = await res.json();
        addToast(data.message || 'Failed to redeem reward', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Error occurred', 'error');
    }
  };

  return (
    <PageTransition className="space-y-6 max-w-5xl mx-auto">
      <HeroBanner
        title="Blessing Store"
        subtitle="Redeem your hard-earned points for awesome rewards!"
        icon={
          <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shopping_bag
          </span>
        }
      >
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
          <span className="text-sm font-bold opacity-80">{t('points')}</span>
          <span className="text-2xl font-black ms-2">{points}</span>
        </div>
      </HeroBanner>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards?.map(reward => (
          <StaggerItem key={reward.id}>
            <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest h-full">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-24 h-24 bg-surface-container rounded-full mx-auto flex items-center justify-center text-primary overflow-hidden">
                  {reward.imageUrl ? (
                    <img src={reward.imageUrl} alt={locale === 'ar' ? reward.titleAr : reward.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[48px]">{reward.icon}</span>
                  )}
                </div>
                
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container px-2 py-1 rounded text-on-surface-variant">{reward.type}</span>
                  <h3 className="font-bold text-lg mt-2 text-on-surface">{locale === 'ar' ? reward.titleAr : reward.title}</h3>
                </div>
                
                <div className="flex justify-center items-center gap-1 text-2xl font-black text-secondary py-2 border-y border-outline-variant/50 glow-gold">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                  {reward.pointsCost || reward.points}
                </div>

                <Button 
                  fullWidth 
                  variant="primary" 
                  disabled={points < (reward.pointsCost || reward.points)}
                  onClick={() => handleRedeem(reward.id)}
                >
                  {t('redeemBtn')}
                </Button>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}
