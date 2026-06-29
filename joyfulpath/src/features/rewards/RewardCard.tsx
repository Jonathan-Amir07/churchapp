import React from 'react';

export default function RewardCard({ reward }: { reward: any }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h3>{reward.title}</h3>
      <p>{reward.description}</p>
      <div>Cost: {reward.costXp} XP</div>
      <button>Redeem</button>
    </div>
  );
}
