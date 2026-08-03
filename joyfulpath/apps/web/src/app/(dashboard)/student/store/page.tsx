'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';
import { useNotificationStore } from '@/stores/notifications.store';

export default function StudentStore() {
  const tNav = useTranslations('nav');
  const tRewards = useTranslations('rewards');
  const tCommon = useTranslations('common');
  const tGamification = useTranslations('gamification');
  const tExtra = useTranslations('storeExtra');
  const addToast = useNotificationStore(s => s.addToast);
  
  const { points, monthlyRedemptionsCount, lastRedemptionMonth } = useAppStore();
  
  const [rewards, setRewards] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [resRewards, resReds] = await Promise.all([
        fetch('/api/rewards'),
        fetch('/api/rewards/redemptions')
      ]);
      
      if (resRewards.ok) {
        setRewards(await resRewards.json());
      }
      if (resReds.ok) {
        setRedemptions(await resReds.json());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);


  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const isDifferentMonth = lastRedemptionMonth !== currentMonth;
  const currentCount = isDifferentMonth ? 0 : monthlyRedemptionsCount;
  const maxLimit = 2;
  const isLimitReached = currentCount >= maxLimit;

  const handleRedeem = async (itemId: string, itemTitle: string) => {
    try {
      const res = await fetch('/api/rewards/redemptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: itemId })
      });
      
      if (res.ok) {
        addToast(`Redemption request submitted successfully for ${itemTitle}!`, 'success');
        fetchData();
        // Here we'd ideally fetch updated user points, but we rely on Next.js/Zustand reload
      } else {
        const errorData = await res.json();
        addToast(errorData.error || 'Failed to redeem item.', 'error');
      }
    } catch (e) {
      addToast('An error occurred while redeeming the item.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Header & Balance */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-2xl border border-outline-variant/60">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('store')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {tRewards('description')}
          </p>
        </div>
        
        <div className="flex flex-col gap-3 self-start md:self-auto">
          <div className="flex items-center gap-3 bg-surface-container-lowest py-3 px-5 rounded-2xl border border-outline-variant/80 shadow-sm">
            <span className="material-symbols-outlined text-[28px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{tExtra('yourBalance')}</p>
              <p className="text-xl font-extrabold text-on-surface">{points} {tGamification('points')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-surface-container-lowest py-2 px-4 rounded-xl border border-outline-variant/80 shadow-sm">
            <span className={`material-symbols-outlined text-[20px] ${isLimitReached ? 'text-error' : 'text-primary'}`}>
              shopping_bag
            </span>
            <div>
              <p className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">{tRewards('monthlyLimitReached')}</p>
              <p className={`text-sm font-extrabold ${isLimitReached ? 'text-error' : 'text-on-surface'}`}>
                {tRewards('giftsRedeemed', { count: currentCount, limit: maxLimit })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Catalog Items (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">storefront</span>
            {tExtra('availablePrizes')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.filter((r) => r.stock > 0 || r.type === 'digital').map((item) => {
              const hasEnoughPoints = points >= item.pointsCost;
              const isOutOfStock = item.type === 'physical' && item.stock <= 0;
              
              return (
                <Card key={item.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <CardContent className="p-5 space-y-4 flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                      </div>
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-outline-variant/40 text-outline border border-outline-variant/60">
                        {item.type === 'digital' ? tExtra('digitalAsset') : tRewards('stockLabel', { stock: item.stock })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <CardTitle className="text-sm font-extrabold text-on-surface leading-snug">
                        {item.title}
                      </CardTitle>
                      <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                  
                  <div className="p-5 pt-0 flex justify-between items-center border-t border-outline-variant/40 mt-auto">
                    <span className="text-sm font-black text-secondary">
                      {item.pointsCost} Points
                    </span>
                    <Button
                      variant={hasEnoughPoints ? 'primary' : 'outline'}
                      size="sm"
                      disabled={!hasEnoughPoints || isOutOfStock || isLimitReached}
                      onClick={() => handleRedeem(item.id, item.title)}
                      className="text-xs h-8 px-4"
                    >
                      {isOutOfStock 
                        ? tRewards('outOfStock') 
                        : isLimitReached
                          ? tExtra('limitReached')
                          : hasEnoughPoints 
                            ? tRewards('redeem') 
                            : tExtra('locked')
                      }
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Redemptions History (Right 1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            {tExtra('claimHistory')}
          </h2>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {redemptions.length === 0 ? (
              <div className="p-6 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">
                <p className="text-xs font-bold text-on-surface-variant">{tExtra('noRedemptions')}</p>
              </div>
            ) : (
              redemptions.map((red) => (
                <Card key={red.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-on-surface truncate max-w-[130px]">
                        {red.itemTitle}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        red.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : red.status === 'rejected'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                      }`}>
                        {red.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold">
                      <span>{new Date(red.createdAt).toLocaleDateString()}</span>
                      <span>{red.pointsCost} pts</span>
                    </div>

                    {red.feedback && (
                      <div className="p-2 rounded bg-surface-container-low border border-outline-variant/60 text-[10px] font-medium text-on-surface-variant">
                        <strong>{tExtra('note')}</strong> {red.feedback}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
