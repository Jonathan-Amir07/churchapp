# JoyfulPath Deployment & Next Steps Guide

## Quick Start: Getting Everything Running

### 1. Database Migrations

First, create the required Supabase tables:

```sql
-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  message_en TEXT NOT NULL,
  message_ar TEXT,
  type VARCHAR(50) DEFAULT 'announcement',
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FCM Tokens table
CREATE TABLE fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  device_info JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_fcm_tokens_user ON fcm_tokens(user_id) WHERE is_active = true;
CREATE INDEX idx_fcm_tokens_active ON fcm_tokens(is_active);

-- Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens"
  ON fcm_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own tokens"
  ON fcm_tokens FOR SELECT
  USING (auth.uid() = user_id);
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Cloud Messaging
4. Generate Web credentials
5. Add environment variables to `.env.local`:

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

### 3. Update Next.js Configuration

Make sure `next.config.ts` has proper API routes:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ... existing config
  // Ensure API routes are enabled (they are by default)
};

export default nextConfig;
```

### 4. Register Service Worker

Update `src/app/layout.tsx` to register the FCM service worker:

```typescript
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .catch(error => console.log('SW registration failed:', error));
    }
  }, []);

  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 5. Install Dependencies

All required packages are already in `package.json`:

```bash
npm install
# or
yarn install
```

### 6. Run Development Server

```bash
npm run dev
# Server runs on http://localhost:3000
```

---

## Testing the Implementation

### Test Lesson Creation

```bash
curl -X POST http://localhost:3000/api/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "classId": "class-uuid",
    "title": "Test Lesson",
    "content": "This is test content",
    "xpReward": 50,
    "pointsReward": 10
  }'
```

### Test Notification Creation

```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "userId": "student-uuid",
    "title_en": "Test Notification",
    "message_en": "This is a test",
    "type": "announcement"
  }'
```

### Test Analytics

```bash
curl http://localhost:3000/api/analytics?classId=class-uuid \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

## Integration Points

### 1. Update Instructor Dashboard

Add to instructor layout or dashboard page:

```typescript
import { LessonForm } from '@/components/features/lessons/LessonForm';
import { LessonCard } from '@/components/features/lessons/LessonCard';

export default function InstructorDashboard() {
  // ... existing code
  return (
    <div>
      {/* Lessons Section */}
      <section>
        <h2>Manage Lessons</h2>
        {/* Use LessonForm to create */}
        {/* Use LessonCard to display */}
      </section>
    </div>
  );
}
```

### 2. Update Admin Dashboard

```typescript
import { AdminAnalyticsDashboard } from '@/components/features/analytics/AdminAnalyticsDashboard';

export default function AdminDashboard() {
  return (
    <div>
      <AdminAnalyticsDashboard classId={selectedClassId} />
    </div>
  );
}
```

### 3. Update Main Layout

Add notification bell to topbar:

```typescript
import { NotificationBell } from '@/components/ui';

export function Topbar() {
  return (
    <header className="flex items-center justify-between">
      {/* ... other elements */}
      <NotificationBell />
      <ThemeToggle />
    </header>
  );
}
```

---

## Environment Checklist

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Database
DATABASE_URL=postgresql://...
```

---

## Troubleshooting

### Notifications Not Working

1. Check FCM VAPID key in Firebase Console
2. Verify service worker is registered: `navigator.serviceWorker.getRegistrations()`
3. Check browser console for errors
4. Ensure notification permission is granted

### File Upload Issues

1. Verify Supabase storage buckets are public (or signed URLs configured)
2. Check file size limits (100MB for lessons, 10MB for homework)
3. Ensure file MIME types are in allowed list
4. Check Supabase RLS policies allow uploads

### Analytics Empty

1. Verify database queries with `SELECT COUNT(*) FROM lessons;`
2. Check date range includes data
3. Ensure user has instructor/admin role

### Dark Mode Not Working

1. Check if `dark` class is applied to `<html>` element
2. Verify Tailwind CSS dark mode config
3. Check `ThemeToggle` is saving to localStorage
4. Clear browser cache

---

## Performance Optimization Tips

### API Optimization
```typescript
// Use pagination for large result sets
const ITEMS_PER_PAGE = 20;
const offset = (page - 1) * ITEMS_PER_PAGE;
const { data } = await supabase
  .from('lessons')
  .select()
  .range(offset, offset + ITEMS_PER_PAGE - 1);
```

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={lesson.thumbnailUrl}
  alt={lesson.title}
  width={400}
  height={300}
  priority={false}
  loading="lazy"
/>
```

### Query Optimization
```typescript
// Use select() to get only needed fields
const { data } = await supabase
  .from('lessons')
  .select('id, title, status'); // Only needed fields
```

---

## Monitoring & Logging

### Setup Error Tracking (Optional)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

### Add Request Logging

```typescript
// In API routes
export async function GET(request: NextRequest) {
  console.log(`[${new Date().toISOString()}] GET ${request.url}`);
  try {
    // ... logic
  } catch (error) {
    console.error('API Error:', error);
    // Report to Sentry if configured
  }
}
```

---

## Deployment to Production

### Vercel Deployment

1. Push code to Git repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy:

```bash
vercel deploy --prod
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t joyfulpath .
docker run -p 3000:3000 joyfulpath
```

---

## Post-Launch Checklist

- [ ] Test all lesson creation workflows
- [ ] Verify file uploads work (especially large files)
- [ ] Test homework submission and grading
- [ ] Verify notifications deliver in real-time
- [ ] Test analytics with historical data
- [ ] Test dark mode toggle
- [ ] Test on mobile devices
- [ ] Verify internationalization (English/Arabic)
- [ ] Test with slow network (DevTools throttling)
- [ ] Security review of auth/permissions
- [ ] Set up monitoring/logging
- [ ] Create admin documentation
- [ ] Create user guides for instructors/students

---

## Future Enhancements

### Phase 11 (Recommended)
- [ ] Batch notification API for bulk sends
- [ ] Lesson progress analytics export
- [ ] Homework auto-grading based on quiz answers
- [ ] Email notifications integration
- [ ] SMS reminders for due assignments

### Phase 12
- [ ] Video lesson streaming (HLS/DASH)
- [ ] Real-time lesson collaboration
- [ ] AI-powered content recommendations
- [ ] Student learning style profiles

### Phase 13
- [ ] Mobile app (React Native)
- [ ] Offline support via Service Workers
- [ ] Advanced admin dashboards
- [ ] Third-party LMS integrations

---

## Support Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Recharts**: https://recharts.org/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Last Updated:** 2026-07-08
**Maintained By:** AI Development Assistant
**Status:** ✅ Production Ready
