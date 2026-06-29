import React from 'react';
import RewardCard from './RewardCard';

export default function RewardStore({ rewards }: { rewards?: any[] }) {
  return (
    <div>
      <h2>Reward Store</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {(rewards || []).map((r) => (
          <RewardCard key={r.id} reward={r} />
        ))}
      </div>
    </div>
  );
}
