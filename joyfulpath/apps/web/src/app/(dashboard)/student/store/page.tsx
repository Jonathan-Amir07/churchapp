'use client';

import { Card, CardContent, Button, PageTransition, HeroBanner, StaggerContainer, StaggerItem } from '@/components/ui';

export default function StudentStorePage() {
  const rewards = [
    { id: '1', title: 'Christian Stickers Pack', type: 'physical', points: 150, icon: 'label' },
    { id: '2', title: 'Skip One Homework', type: 'digital', points: 300, icon: 'assignment_turned_in' },
    { id: '3', title: '$5 Ice Cream Gift Card', type: 'physical', points: 500, icon: 'icecream' }
  ];

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
          <span className="text-sm font-bold opacity-80">Your Points</span>
          <span className="text-2xl font-black ms-2">1,250</span>
        </div>
      </HeroBanner>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards.map(reward => (
          <StaggerItem key={reward.id}>
            <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest h-full">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-24 h-24 bg-surface-container rounded-full mx-auto flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[48px]">{reward.icon}</span>
                </div>
                
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container px-2 py-1 rounded text-on-surface-variant">{reward.type}</span>
                  <h3 className="font-bold text-lg mt-2 text-on-surface">{reward.title}</h3>
                </div>
                
                <div className="flex justify-center items-center gap-1 text-2xl font-black text-secondary py-2 border-y border-outline-variant/50 glow-gold">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                  {reward.points}
                </div>

                <Button fullWidth variant="primary">Redeem Reward</Button>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}
