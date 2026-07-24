'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';
import { useNotificationStore } from '@/stores/notifications.store';

export default function StudentStore() {
  const tNav = useTranslations('nav');
  const tRewards = useTranslations('rewards');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);
  
  const { points, rewards, redemptions, redeemReward } = useAppStore();

  const handleRedeem = (itemId: string, itemTitle: string) => {
    const success = redeemReward(itemId, 'Jonathan'); // Jonathan is the mock student user
    if (success) {
      addToast(`Redemption request submitted successfully for ${itemTitle}!`, 'success');
    } else {
      addToast('Failed to redeem item. Please check your points balance.', 'error');
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
        
        <div className="flex items-center gap-3 bg-surface-container-lowest py-3 px-5 rounded-2xl border border-outline-variant/80 shadow-sm self-start md:self-auto">
          <span className="material-symbols-outlined text-[28px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
            stars
          </span>
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Your Balance</p>
            <p className="text-xl font-extrabold text-on-surface">{points} Points</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Catalog Items (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">storefront</span>
            Available Prizes
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
                        {item.type === 'digital' ? 'Digital Asset' : `Stock: ${item.stock}`}
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
                      disabled={!hasEnoughPoints || isOutOfStock}
                      onClick={() => handleRedeem(item.id, item.title)}
                      className="text-xs h-8 px-4"
                    >
                      {isOutOfStock 
                        ? tRewards('outOfStock') 
                        : hasEnoughPoints 
                          ? tRewards('redeem') 
                          : 'Locked'
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
            Claim History
          </h2>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {redemptions.length === 0 ? (
              <div className="p-6 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">
                <p className="text-xs font-bold text-on-surface-variant">No redemptions claimed yet.</p>
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
                        <strong>Note:</strong> {red.feedback}
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
