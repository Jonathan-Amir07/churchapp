import React, { useState } from 'react';

export default function PrayerSubmit({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.({ title, body });
        setTitle('');
        setBody('');
      }}
    >
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" />
      </div>
      <div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your request" />
      </div>
      <button type="submit">Submit Prayer</button>
    </form>
  );
}
