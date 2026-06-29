"use client";
import React, { useEffect, useState } from 'react';

export default function AdminRedemptions() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const res = await fetch('/api/rewards/redemptions');
    const data = await res.json();
    setItems(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    await fetch(`/api/rewards/redemptions/${id}/approve`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reviewerId: 'system' }) });
    load();
  }

  async function reject(id: string) {
    await fetch(`/api/rewards/redemptions/${id}/reject`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reviewerId: 'system', notes: 'Rejected by admin' }) });
    load();
  }

  async function fulfill(id: string) {
    await fetch(`/api/rewards/redemptions/${id}/fulfill`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ fulfillerId: 'system' }) });
    load();
  }

  return (
    <div>
      <h2>Redemptions</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map((r) => (
          <div key={r.id} style={{ border: '1px solid #ddd', padding: 8 }}>
            <div><strong>{r.rewardId}</strong> — {r.status}</div>
            <div>User: {r.userId}</div>
            <div>Requested: {new Date(r.requestedAt).toLocaleString()}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => approve(r.id)}>Approve</button>
              <button onClick={() => reject(r.id)} style={{ marginLeft: 8 }}>Reject</button>
              <button onClick={() => fulfill(r.id)} style={{ marginLeft: 8 }}>Fulfill</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <a href="/api/rewards/redemptions/export">Export Pending CSV</a>
      </div>
    </div>
  );
}
