import React from 'react';

export default function PrayerList({ prayers }: { prayers?: any[] }) {
  return (
    <div>
      <h2>Prayer Requests</h2>
      <ul>
        {(prayers || []).map((p) => (
          <li key={p.id}>
            <strong>{p.title || 'Prayer'}</strong> — {p.body.slice(0, 120)}
          </li>
        ))}
      </ul>
    </div>
  );
}
