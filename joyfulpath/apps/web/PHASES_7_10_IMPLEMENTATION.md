# Phases 7-10 Implementation Guide

## Overview
This document outlines the implementation of Phases 7-10 for the JoyfulPath Sunday School Gamified Learning Platform.

---

## Phase 7: Lesson & Homework Enhancements

### Completed Components

#### 1. **Supabase Storage Management** (`src/lib/supabase/storage.ts`)
- File upload/download with validation
- Support for lessons (100MB max), homework (10MB max), profiles (5MB max)
- Public URL generation for media access
- File type validation (PDFs, videos, images, documents)

#### 2. **Lesson APIs**

**GET /api/lessons**
- List lessons for a class with optional status filter
- Returns lesson metadata with attachment info
- Includes student progress data

**POST /api/lessons**
- Create new lesson (instructor/admin only)
- Validates class membership
- Accepts: title, description, content, bible references, rewards

**GET/PATCH/DELETE /api/lessons/[id]**
- Retrieve lesson details with attachments
- Update lesson (only by creator or admin)
- Delete lesson with cascading cleanup

**POST/DELETE /api/lessons/[id]/upload**
- Upload lesson attachments (PDFs, videos, images)
- Delete specific attachments by ID
- Auto-generates public URLs

#### 3. **Homework APIs**

**GET/POST /api/homework**
- Fetch submissions (filtered by student/task/status)
- Submit homework with optional file attachment
- Auto-increments attempt number, validates max submissions

**GET/PATCH/DELETE /api/homework/[id]**
- Get submission details
- Review submission: approve/reject/request revision
- Auto-awards XP/points when approved
- Student can only view their own; instructors can review

### Database Schema Requirements

```sql
-- Lesson attachments table (already in schema)
CREATE TABLE lesson_attachments (
  id UUID PRIMARY KEY,
  lesson_id UUID REFERENCES lessons,
  file_name VARCHAR(255),
  file_url TEXT,
  file_type VARCHAR(50),
  file_size INT,
  uploaded_at TIMESTAMP
);

-- Task submissions table (already in schema - uses existing TaskSubmission model)
-- Ensure columns: attachmentUrl, feedback, xpAwarded, pointsAwarded, status
```

### Usage Example

**Instructor Creating a Lesson:**
```typescript
const response = await fetch('/api/lessons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    classId: 'class-123',
    title: 'Moses and the Red Sea',
    description: 'Learn about God\'s parting of the Red Sea',
    content: 'Detailed lesson content...',
    xpReward: 100,
    pointsReward: 25,
  }),
});

// Upload attachment
const formData = new FormData();
formData.append('file', pdfFile);
await fetch(`/api/lessons/${lessonId}/upload`, {
  method: 'POST',
  body: formData,
});
```

**Student Submitting Homework:**
```typescript
const formData = new FormData();
formData.append('taskId', 'task-123');
formData.append('content', 'My answer to the homework');
formData.append('file', submissionFile);

await fetch('/api/homework', {
  method: 'POST',
  body: formData,
});
```

---

## Phase 8: Push Notifications (Firebase)

### Completed Components

#### 1. **Firebase Service Worker** (`public/firebase-messaging-sw.js`)
- Handles background notifications
- Notification click routing to app
- Action buttons support
- Device-aware messaging

#### 2. **FCM Token Management** (`src/lib/firebase/token-manager.ts`)
- Register/unregister FCM tokens
- Store tokens in Supabase for server-side targeting
- Clean up expired tokens
- Query active tokens by user

#### 3. **Notification APIs**

**GET /api/notifications**
- Fetch user notifications with pagination
- Filter by read status
- Returns up to 20 notifications by default

**POST /api/notifications**
- Create and send notifications (admin/instructor)
- Support bulk notifications to user group
- Queue push notifications via Firebase
- Returns created notification records

**PATCH /api/notifications/[id]**
- Mark notification as read
- Auto-sets read_at timestamp

**DELETE /api/notifications/[id]**
- Delete individual notification

#### 4. **Enhanced NotificationBell Component** (`src/components/ui/NotificationBell.tsx`)
- Real-time updates via Supabase realtime subscriptions
- FCM foreground message handling
- Mark as read / delete actions
- Unread badge with animated pulse
- Dark mode support
- Empty state and animations

### Database Setup

Create notifications table in Supabase:
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  message_en TEXT NOT NULL,
  message_ar TEXT,
  type VARCHAR(50) DEFAULT 'announcement',
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  token TEXT UNIQUE NOT NULL,
  device_info JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_fcm_tokens_user ON fcm_tokens(user_id) WHERE is_active = true;
```

### Environment Variables Required

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

### Usage Example

**Admin Sending Notifications:**
```typescript
await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    targetIds: ['student-1', 'student-2'], // or userId for single
    title_en: 'New Badge Unlocked!',
    title_ar: 'شارة جديدة تم فتحها!',
    message_en: 'Great job! You earned the Bible Scholar badge.',
    message_ar: 'عمل رائع! لقد حصلت على شارة الباحث في الكتاب المقدس.',
    type: 'badge',
    actionUrl: '/badges',
    sendPush: true, // Triggers FCM push
  }),
});
```

---

## Phase 9: Analytics Dashboard (Admin)

### Completed Components

#### 1. **Analytics API** (`src/app/api/analytics/route.ts`)

**GET /api/analytics**
- Query params: `classId` (optional), `startDate`, `endDate`
- Returns comprehensive metrics:
  - **Engagement Metrics**: active students, average XP, total XP
  - **Lesson Completion**: completion rates per lesson
  - **Quiz Performance**: average scores and pass rates
  - **Attendance Data**: attendance trends
  - **Top Students**: leaderboard top 10
  - **Badge Distribution**: badge unlock statistics
  - **Task Submissions**: submission status breakdown

#### 2. **Admin Analytics Dashboard** (`src/components/features/analytics/AdminAnalyticsDashboard.tsx`)

Features:
- Date range filtering
- Summary cards with key metrics
- Lesson completion bar chart
- Quiz performance composite chart
- Task submission status chart
- Top students leaderboard
- Recharts integration for visualizations
- Dark mode support
- Loading and error states

### Usage Example

**Fetching Analytics:**
```typescript
const response = await fetch('/api/analytics?classId=class-123&startDate=2024-01-01&endDate=2024-01-31');
const analytics = await response.json();

// Returns:
{
  period: { startDate, endDate },
  engagementMetrics: { averageXp, totalXp, activeStudents },
  lessonCompletion: [{ lessonId, title, completionRate, ... }],
  quizPerformance: [{ quizId, title, attempts, averageScore, passRate }],
  topStudents: [{ id, name, xp, points, streak, badges }],
  taskSubmissions: [{ taskId, title, total, pending, approved, rejected }],
  ...
}
```

### Component Integration

```typescript
import { AdminAnalyticsDashboard } from '@/components/features/analytics/AdminAnalyticsDashboard';

export default function AdminPage() {
  return (
    <AdminAnalyticsDashboard classId="class-123" />
  );
}
```

---

## Phase 10: Dark Mode & Polish

### Completed Components

#### 1. **Enhanced ThemeToggle** (`src/components/ui/ThemeToggle.tsx`)
- Light/dark mode switching
- Persists selection to localStorage
- System preference detection
- Material Design icons

#### 2. **Loading States** (`src/components/ui/LoadingSpinner.tsx`)
- Animated spinner component (sm/md/lg sizes)
- Page loading state
- Inline loading indicator
- Dark mode support

#### 3. **Empty States** (`src/components/ui/EmptyState.tsx`)
- Generic empty state component
- Pre-built states:
  - NoLessonsState
  - NoHomeworkState
  - NoNotificationsState
  - NoStudentsState
  - ErrorState with retry button
- Material Design icons
- Dark mode support

#### 4. **Skeleton Loaders** (Enhanced `src/components/ui/Skeleton.tsx`)
- Animated placeholder skeletons
- Variants: text, circular, rectangular, card
- Composable: CardSkeleton, TableSkeleton, ListSkeleton
- Dark mode support

### Dark Mode Implementation

CSS classes for dark mode (add to your Tailwind config):
```css
/* Define color token mappings */
:root {
  --color-surface: #fffbfe;
  --color-surface-dim: #f3eff4;
  --color-surface-bright: #fffbfe;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f8f3f8;
  --color-surface-container: #f3eff4;
  --color-surface-container-high: #ede7f0;
  --color-surface-container-highest: #e8e1eb;
}

html.dark {
  --color-surface: #1a1625;
  --color-surface-dim: #140f1b;
  --color-surface-bright: #2c2633;
  --color-surface-container-lowest: #0f0a12;
  --color-surface-container-low: #1a1625;
  --color-surface-container: #241f2b;
  --color-surface-container-high: #2f2936;
  --color-surface-container-highest: #3a3341;
}
```

Update component classNames:
```tsx
<div className="bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface">
  Dark mode ready component
</div>
```

### Polish Features

#### Loading States
- Show skeletons while fetching data
- Smooth transitions between states
- Graceful error handling

#### Animations
- Entrance animations for modals/dropdowns
- Hover effects on interactive elements
- Smooth transitions (duration-200)
- Pulse animations for unread indicators

#### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Flexible grid layouts
- Touch-friendly button sizes

#### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast text
- Icon + text combinations

---

## Integration Checklist

### Database Setup
- [ ] Run Supabase migrations for new tables
- [ ] Create notifications & fcm_tokens tables
- [ ] Verify LessonAttachment & TaskSubmission schema
- [ ] Enable RLS policies for real-time subscriptions

### Environment Configuration
- [ ] Add Firebase credentials to `.env.local`
- [ ] Configure Supabase API key
- [ ] Test notification endpoints

### Frontend Features
- [ ] Integrate LessonForm component in instructor dashboard
- [ ] Add analytics page to admin routes
- [ ] Connect notification bell to layout
- [ ] Enable dark mode toggle in topbar
- [ ] Update navigation to include analytics page

### Testing
- [ ] Test lesson creation with file upload
- [ ] Test homework submission
- [ ] Test notification creation and delivery
- [ ] Test analytics API with date ranges
- [ ] Test dark mode toggle persistence
- [ ] Test responsive layouts on mobile

### Localization
- [ ] Add translation keys for new features
- [ ] Test Arabic/English text rendering
- [ ] Verify RTL layout compatibility

---

## File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── lessons/
│   │   │   ├── route.ts          # Create & list
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts      # Get, update, delete
│   │   │   │   └── upload/
│   │   │   │       └── route.ts  # Upload attachments
│   │   ├── homework/
│   │   │   ├── route.ts          # Submit & list
│   │   │   └── [id]/
│   │   │       └── route.ts      # Review submissions
│   │   ├── notifications/
│   │   │   ├── route.ts          # List & create
│   │   │   └── [id]/
│   │   │       └── route.ts      # Update & delete
│   │   └── analytics/
│   │       └── route.ts          # Dashboard metrics
│   └── (dashboard)/
│       └── instructor/
│           └── lessons/
│               └── page.tsx      # Lesson management
├── components/
│   ├── ui/
│   │   ├── NotificationBell.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Skeleton.tsx
│   └── features/
│       ├── lessons/
│       │   ├── LessonForm.tsx
│       │   └── LessonCard.tsx
│       └── analytics/
│           └── AdminAnalyticsDashboard.tsx
└── lib/
    ├── firebase/
    │   └── token-manager.ts
    └── supabase/
        └── storage.ts
```

---

## Next Steps

1. **Phase 11: Gamification Polish**
   - Enhanced badge animations
   - XP notification toasts
   - Streak celebrations
   - Level-up confetti

2. **Phase 12: Performance & Optimization**
   - API response caching
   - Image optimization
   - Bundle size reduction
   - Database query optimization

3. **Phase 13: Testing & QA**
   - Unit tests for APIs
   - Integration tests for workflows
   - E2E tests with Playwright
   - Performance testing

4. **Phase 14: Deployment & Monitoring**
   - CI/CD pipeline setup
   - Error tracking (Sentry)
   - Performance monitoring
   - Log aggregation

---

## Support & Documentation

- Firebase Docs: https://firebase.google.com/docs/messaging
- Supabase Docs: https://supabase.com/docs
- Recharts: https://recharts.org/
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

**Last Updated:** 2026-07-08
