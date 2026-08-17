# JoyfulPath Phases 7-10: Architecture & Integration Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Browser)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      React 19 Components                            │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │   │
│  │  │ LessonForm     │  │ AdminAnalytics │  │ NotificationBell│        │   │
│  │  │ + LessonCard   │  │ Dashboard      │  │ + ThemeToggle  │        │   │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │   │
│  │                                                                      │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │   │
│  │  │ LoadingSpinner │  │ EmptyState     │  │ Skeleton       │        │   │
│  │  │ PageLoading    │  │ Variants       │  │ Loaders        │        │   │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │   │
│  │                                                                      │   │
│  │         🎨 Styling: TailwindCSS 4 + Dark Mode                       │   │
│  │         🌍 i18n: next-intl (en/ar)                                  │   │
│  │         📱 Responsive: 3 breakpoints                                │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                           │                                                  │
│                           │ API Calls (REST)                                │
│                           ↓                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │              State Management (Zustand)                             │   │
│  │  • User store                                                       │   │
│  │  • Notifications store                                             │   │
│  │  • App store                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                           │                                                  │
│                           │ Real-time Subscriptions                         │
│                           │ Background Messages (FCM)                       │
│                           ↓                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │         Service Worker (firebase-messaging-sw.js)                  │   │
│  │  • Background message handling                                      │   │
│  │  • Notification display                                             │   │
│  │  • Action routing                                                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
         ↑                         ↑                        ↑
         │ HTTP/REST API           │ Real-time Updates      │ FCM Messages
         │ (json-rpc)              │ (websocket)            │ (background)
         │                         │                        │
┌────────┴──────────┬──────────────┴────────┬──────────────┴─────────────────┐
│  NEXT.JS API LAYER                                                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │            src/app/api/* (Next.js App Router)                      │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │                                                                     │  │
│  │  📚 Lessons                                                         │  │
│  │  ├─ POST   /api/lessons            (Create)                        │  │
│  │  ├─ GET    /api/lessons            (List + filter)                │  │
│  │  ├─ PATCH  /api/lessons/:id        (Update)                       │  │
│  │  ├─ DELETE /api/lessons/:id        (Delete)                       │  │
│  │  ├─ POST   /api/lessons/:id/upload (Add attachment)               │  │
│  │  └─ DELETE /api/lessons/:id/upload (Remove attachment)            │  │
│  │                                                                     │  │
│  │  📝 Homework                                                        │  │
│  │  ├─ POST   /api/homework           (Submit)                       │  │
│  │  ├─ GET    /api/homework           (List submissions)             │  │
│  │  ├─ PATCH  /api/homework/:id       (Grade/Review)                │  │
│  │  └─ DELETE /api/homework/:id       (Delete)                       │  │
│  │                                                                     │  │
│  │  🔔 Notifications                                                   │  │
│  │  ├─ GET    /api/notifications      (List)                         │  │
│  │  ├─ POST   /api/notifications      (Create/Send)                 │  │
│  │  ├─ PATCH  /api/notifications/:id  (Mark read)                   │  │
│  │  └─ DELETE /api/notifications/:id  (Delete)                      │  │
│  │                                                                     │  │
│  │  📈 Analytics                                                       │  │
│  │  └─ GET    /api/analytics          (Metrics)                      │  │
│  │                                                                     │  │
│  │  🔐 Auth Middleware: Session required                              │  │
│  │  👥 RBAC: admin, instructor, student, parent roles                 │  │
│  │  ✅ Validation: Zod schemas                                        │  │
│  │  🛡️  Error handling: 400/401/403/404/500                          │  │
│  │                                                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│           │                    │                      │                     │
└───────────┼────────────────────┼──────────────────────┼─────────────────────┘
            │                    │                      │
            ↓                    ↓                      ↓
        ┌───────────┐    ┌──────────────┐    ┌─────────────────┐
        │ Prisma    │    │ Supabase     │    │ Firebase        │
        │ ORM       │    │ Realtime     │    │ Cloud           │
        └────┬──────┘    └──────┬───────┘    │ Messaging       │
             │                  │            └────────┬────────┘
             │                  │                     │
┌────────────┴──────────────────┴─────────────────────┴──────────────────────┐
│                         DATA & MESSAGING LAYER                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  📦 PostgreSQL Database (Supabase)                                        │
│  ├─ users (managed by Supabase Auth)                                     │
│  ├─ lessons (with attachments relation)                                  │
│  ├─ lesson_attachments (file metadata)                                   │
│  ├─ tasks                                                                 │
│  ├─ task_submissions (with file support)                                │
│  ├─ notifications (new - Phase 8)                                        │
│  ├─ fcm_tokens (new - Phase 8)                                          │
│  ├─ classes, instructor_classes                                          │
│  ├─ badges, user_badges                                                  │
│  ├─ quiz_results, quiz_answers                                           │
│  └─ ... (other existing tables)                                          │
│                                                                            │
│  🔐 Row Level Security (RLS)                                              │
│  ├─ Notifications: Users see only their own                              │
│  ├─ FCM Tokens: Isolated by user_id                                      │
│  └─ Lessons/Tasks: Access based on class enrollment                      │
│                                                                            │
│  💾 Supabase Storage Buckets                                              │
│  ├─ lessons/ (max 100MB files)                                           │
│  ├─ homework/ (max 10MB files)                                           │
│  ├─ profiles/ (max 5MB images)                                           │
│  └─ attachments/ (for other files)                                       │
│                                                                            │
│  🔔 Firebase Cloud Messaging                                              │
│  ├─ Send push notifications                                              │
│  ├─ Manage FCM tokens                                                    │
│  ├─ Handle background messages                                           │
│  └─ Track delivery                                                        │
│                                                                            │
│  🔄 Supabase Realtime                                                     │
│  ├─ Subscribe to notifications changes                                   │
│  ├─ Live updates on notification bell                                    │
│  ├─ Publish/subscribe pattern                                            │
│  └─ WebSocket connections                                                │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Lesson Creation & Upload Flow

```
User (Instructor)
       │
       │ 1. Open LessonForm component
       ↓
   ┌──────────────────────┐
   │ LessonForm           │
   │ ├─ Title input       │
   │ ├─ Description       │
   │ ├─ Content editor    │
   │ ├─ XP/Points input   │
   │ └─ File upload       │
   └──────┬───────────────┘
          │
          │ 2. Submit form (validated with Zod)
          ↓
   ┌──────────────────────────────────────┐
   │ POST /api/lessons                    │
   │ ├─ Validate auth & role              │
   │ ├─ Create lesson record in DB        │
   │ └─ Return lesson ID                  │
   └──────┬───────────────────────────────┘
          │
          │ 3. If file attached, upload
          ↓
   ┌──────────────────────────────────────┐
   │ POST /api/lessons/:id/upload         │
   │ ├─ Validate file (type, size)        │
   │ ├─ Upload to Supabase storage        │
   │ └─ Save metadata in DB               │
   └──────┬───────────────────────────────┘
          │
          │ 4. Update component state
          ↓
   ┌──────────────────────────────────────┐
   │ LessonForm                           │
   │ ├─ Show success toast                │
   │ ├─ Redirect to lessons list          │
   │ └─ Trigger parent refresh            │
   └──────────────────────────────────────┘
```

### 2. Homework Submission & Grading Flow

```
Student
  │
  │ 1. View task
  ↓
┌──────────────────────────┐
│ GET /api/homework        │
│ ├─ Fetch user's tasks    │
│ └─ Show submission form  │
└──────┬───────────────────┘
       │
       │ 2. Submit homework
       ↓
┌──────────────────────────────────────┐
│ POST /api/homework                   │
│ ├─ Upload file (if attached)         │
│ ├─ Create submission record          │
│ └─ Store in DB                       │
└──────┬───────────────────────────────┘
       │
       │ Student receives confirmation
       │
       X
       │
    Instructor
       │
       │ 1. View submissions
       ↓
┌──────────────────────────────────────┐
│ GET /api/homework?taskId=X           │
│ ├─ List all student submissions      │
│ └─ Show grading UI                   │
└──────┬───────────────────────────────┘
       │
       │ 2. Grade submission
       ↓
┌──────────────────────────────────────┐
│ PATCH /api/homework/:id              │
│ ├─ Set grade (approved/rejected)     │
│ ├─ Award XP/points                   │
│ ├─ Add feedback                      │
│ └─ Send notification to student      │
└──────┬───────────────────────────────┘
       │
       │ Student receives notification
       │ & sees grade
       ↓
    Student Views Result
```

### 3. Real-time Notification Flow

```
Admin/Instructor
       │
       │ 1. Send notification
       ↓
┌──────────────────────────────────────┐
│ POST /api/notifications              │
│ ├─ Validate auth (admin/instructor)  │
│ ├─ Create notification record        │
│ ├─ Queue FCM push messages           │
│ └─ Return notification ID            │
└──────┬───────────────────────────────┘
       │
       │ 2. Firebase queues messages
       ├─────────────────────────────────────┐
       │                                     │
       │ Foreground (App Open)               │ Background (App Closed)
       ↓                                     ↓
┌─────────────────────┐          ┌──────────────────────────┐
│ Firebase SDK        │          │ Service Worker           │
│ .onMessage()        │          │ onBackgroundMessage()    │
└──────┬──────────────┘          └──────┬───────────────────┘
       │                                 │
       │ 3. Handle in app                │ 3. Show notification
       ↓                                 ↓
┌─────────────────────────────────────┐ ┌──────────────────────┐
│ NotificationBell component          │ │ Native notification  │
│ ├─ Supabase realtime subscription   │ │ ├─ Title             │
│ ├─ Received new notification        │ │ ├─ Message           │
│ ├─ Update badge count (+1)          │ │ ├─ Icon              │
│ ├─ Play sound (optional)            │ │ └─ Action buttons    │
│ └─ Trigger toast                    │ └──────┬───────────────┘
└─────────────────────────────────────┘        │
                                               │ 4. User clicks
                                               ↓
                                        ┌──────────────────────┐
                                        │ Open app             │
                                        │ Navigate to page     │
                                        │ Show notification    │
                                        └──────────────────────┘
       │
       │ 5. User marks as read
       ↓
┌──────────────────────────────────────┐
│ PATCH /api/notifications/:id         │
│ ├─ Set is_read = true                │
│ ├─ Set read_at timestamp             │
│ └─ Update in DB                      │
└──────────────────────────────────────┘
       │
       │ NotificationBell updates in real-time
       │ Badge count updates
       ↓
    Notification Marked Read
```

### 4. Analytics Data Collection & Display

```
Student/Instructor Activity
       │
       │ Events (over time)
       ├─ Create lesson
       ├─ Submit homework
       ├─ Complete quiz
       ├─ Earn badge
       └─ Level up
       │
       ↓ All logged in Database
┌──────────────────────────────────────┐
│ PostgreSQL Tables                    │
│ ├─ lessons + timestamps              │
│ ├─ task_submissions + grades         │
│ ├─ quiz_results + scores             │
│ ├─ user_badges                       │
│ ├─ attendance records                │
│ └─ notification logs                 │
└──────┬───────────────────────────────┘
       │
    Admin Opens Analytics
       │
       ↓
┌──────────────────────────────────────┐
│ GET /api/analytics?classId=X        │
│ &startDate=YYYY-MM-DD               │
│ &endDate=YYYY-MM-DD                 │
│                                      │
│ Server calculates:                   │
│ ├─ Active students (count)           │
│ ├─ Average XP (aggregated)           │
│ ├─ Lesson completion % (per lesson)  │
│ ├─ Quiz pass rate (avg score)        │
│ ├─ Task submission status breakdown  │
│ └─ Top 10 leaderboard                │
└──────┬───────────────────────────────┘
       │ Returns metrics JSON
       ↓
┌──────────────────────────────────────┐
│ AdminAnalyticsDashboard              │
│ ├─ Summary cards (3)                 │
│ ├─ Bar chart (lesson completion)     │
│ ├─ Composite chart (quiz perf)       │
│ ├─ Bar chart (task submissions)      │
│ └─ Leaderboard table                 │
│                                      │
│ Uses Recharts for visualization      │
└──────────────────────────────────────┘
```

---

## Component Integration Points

### 1. App Layout (src/app/layout.tsx)

```tsx
// Add to <body>:
<NotificationBell />     // Real-time notifications
<ThemeToggle />          // Dark mode switcher
<FirebaseMessaging />    // FCM registration (separate component)
```

### 2. Admin Dashboard (src/app/(dashboard)/admin/page.tsx)

```tsx
// Add route:
import AdminAnalyticsDashboard from '@/components/features/analytics/AdminAnalyticsDashboard';

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminAnalyticsDashboard />
    </div>
  );
}
```

### 3. Instructor Lessons (src/app/(dashboard)/instructor/lessons/page.tsx)

```tsx
// Already includes:
- LessonForm component (create)
- LessonCard component (list)
- Loading skeletons
- Empty states
- Search & filter
```

### 4. Student Tasks (src/app/(dashboard)/student/tasks/page.tsx)

```tsx
// Add homework submission:
import HomeworkSubmissionForm from '@/components/features/homework/HomeworkSubmissionForm';

// Display:
- Task details
- HomeworkSubmissionForm
- Previous submissions history
- Grades & feedback
```

---

## API Request/Response Examples

### Create Lesson

**Request:**
```http
POST /api/lessons
Content-Type: application/json

{
  "title": "Noah's Ark Story",
  "description": "Learn about faith and obedience",
  "content": "<p>Noah built an ark...</p>",
  "xp": 50,
  "points": 100,
  "classId": "class-123"
}
```

**Response:**
```json
{
  "id": "lesson-456",
  "title": "Noah's Ark Story",
  "description": "Learn about faith and obedience",
  "createdAt": "2024-07-08T10:30:00Z",
  "createdBy": "user-123",
  "status": "draft",
  "attachmentCount": 0,
  "studentTracking": 0
}
```

### Upload Lesson Attachment

**Request:**
```http
POST /api/lessons/lesson-456/upload
Content-Type: multipart/form-data

file: [PDF file - 2.5MB]
name: "noah-ark-video.pdf"
type: "pdf"
```

**Response:**
```json
{
  "id": "attachment-789",
  "lessonId": "lesson-456",
  "fileName": "noah-ark-video.pdf",
  "fileSize": 2621440,
  "fileType": "pdf",
  "storageUrl": "https://..../noah-ark-video.pdf",
  "uploadedAt": "2024-07-08T10:35:00Z"
}
```

### Submit Homework

**Request:**
```http
POST /api/homework
Content-Type: multipart/form-data

taskId: "task-123"
studentId: "student-456"
submissionText: "My answer to the question..."
file: [Word document]
```

**Response:**
```json
{
  "id": "submission-789",
  "taskId": "task-123",
  "studentId": "student-456",
  "status": "pending",
  "attempt": 1,
  "submittedAt": "2024-07-08T14:20:00Z"
}
```

### Send Notification

**Request:**
```http
POST /api/notifications
Content-Type: application/json

{
  "title_en": "Assignment Graded",
  "message_en": "Your homework has been reviewed",
  "type": "homework_graded",
  "recipientIds": ["student-1", "student-2"],
  "data": {
    "taskId": "task-123",
    "submissionId": "submission-789"
  }
}
```

**Response:**
```json
{
  "id": "notif-123",
  "recipientCount": 2,
  "sentAt": "2024-07-08T14:25:00Z",
  "fcmQueueCount": 2,
  "status": "sent"
}
```

### Get Analytics

**Request:**
```http
GET /api/analytics?classId=class-123&startDate=2024-07-01&endDate=2024-07-08
```

**Response:**
```json
{
  "period": {
    "startDate": "2024-07-01",
    "endDate": "2024-07-08"
  },
  "engagementMetrics": {
    "activeStudents": 25,
    "averageXp": 850,
    "totalXp": 21250
  },
  "lessonCompletion": [
    { "lessonId": "1", "title": "Noah's Ark", "completionRate": 88 },
    ...
  ],
  "quizPerformance": {
    "averageScore": 82.5,
    "passRate": 92
  },
  "taskSubmissions": {
    "pending": 3,
    "approved": 18,
    "rejected": 1
  },
  "topStudents": [
    { "userId": "s1", "name": "Ahmed", "xp": 2450, "badges": 4 },
    ...
  ]
}
```

---

## Database Schema

### Notifications Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  message_en TEXT NOT NULL,
  message_ar TEXT,
  type VARCHAR(50) NOT NULL, -- 'homework_graded', 'badge_earned', etc.
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  data JSONB, -- Additional context
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at DESC
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users see only their notifications
CREATE POLICY user_notifications_policy 
  ON notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

### FCM Tokens Table

```sql
CREATE TABLE fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  device_info JSONB, -- Browser, OS, device info
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active)
);

-- Enable RLS
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users manage their own tokens
CREATE POLICY user_tokens_policy 
  ON fcm_tokens 
  FOR ALL 
  USING (auth.uid() = user_id);
```

---

## Environment Configuration

### Firebase (.env.local)

```env
# Firebase Web SDK Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=joyfulpath.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=joyfulpath
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=joyfulpath.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BKM...

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Testing the Integration

### Manual End-to-End Test

1. **Lesson Creation**
   - Log in as instructor
   - Navigate to Lessons
   - Create lesson with PDF attachment
   - Verify lesson appears in list
   - ✅ Success = lesson saved with attachment

2. **Homework Workflow**
   - Log in as student
   - Submit homework
   - Log in as instructor
   - Grade homework
   - Verify student receives notification
   - ✅ Success = XP awarded & notification sent

3. **Notifications**
   - Send test notification via API
   - Verify real-time update in bell
   - Mark as read
   - Verify badge updates
   - ✅ Success = all state synced

4. **Analytics**
   - Log in as admin
   - Open analytics dashboard
   - Select date range
   - Verify charts load
   - ✅ Success = metrics displayed

5. **Dark Mode**
   - Toggle dark mode
   - Verify all components respond
   - Check colors & contrast
   - ✅ Success = seamless transition

---

## Performance Optimization Tips

1. **Database**
   - Indexes on `user_id`, `is_read`, `is_active`
   - Pagination on notifications (limit 20)
   - Query analytics with date range

2. **API**
   - Cache analytics for 5 minutes
   - Use Supabase bulk operations
   - Batch notification sends

3. **Frontend**
   - Lazy load admin dashboard
   - Virtualize long lists
   - Code split by route

4. **Storage**
   - Set CDN cache headers
   - Compress PDFs on upload
   - Auto-delete old files

---

**Last Updated:** July 8, 2026  
**Version:** 1.0  
**Status:** Complete
