# 🗄️ Waiting for Database — Migration Checklist

> **Purpose**: This document tracks every piece of mock/placeholder code that must be replaced with real Supabase database calls when a live Supabase project is connected.
>
> **When ready to migrate**, follow these steps:
> 1. Set your real Supabase credentials in `.env`:
>    ```env
>    NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
>    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
>    SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
>    ```
> 2. Run all SQL migrations in `supabase/migrations/` in order against your Supabase project.
> 3. Work through each section below and replace mock code with live code.

---

## 🔧 Core Mock Infrastructure (Remove Entirely When Ready)

### [`src/lib/supabase/mockClient.ts`](src/lib/supabase/mockClient.ts)
> **DELETE this entire file** once connected to a real database. It is only used in mock mode.
- Contains `isMockMode()`, `createMockSupabase()`, mock auth, mock table data, and cookie-based role simulation.

### [`src/lib/supabase/client.ts`](src/lib/supabase/client.ts)
```diff
- import { isMockMode, createMockSupabase } from './mockClient';
- export const createClient = () => {
-   if (isMockMode()) {
-     return createMockSupabase();
-   }
-   return createBrowserClient(...);
- };

+ export const createClient = () =>
+   createBrowserClient(
+     process.env.NEXT_PUBLIC_SUPABASE_URL!,
+     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
+   );
```

### [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts)
```diff
- import { isMockMode, createMockSupabase } from './mockClient';
- if (isMockMode()) {
-   const mockRole = cookieStore.get('MOCK_USER_ROLE')?.value;
-   return createMockSupabase(mockRole);
- }
```
Remove the mock mode check block entirely. Keep the rest unchanged.

### [`src/lib/supabase/admin.ts`](src/lib/supabase/admin.ts)
```diff
- import { isMockMode, createMockSupabase } from './mockClient';
- if (isMockMode()) {
-   return createMockSupabase();
- }
```
Remove the mock mode check block entirely. Keep the rest unchanged.

### [`src/middleware.ts`](src/middleware.ts)
```diff
- import { isMockMode, createMockSupabase } from './lib/supabase/mockClient';
- if (isMockMode()) {
-   const mockRole = request.cookies.get('MOCK_USER_ROLE')?.value;
-   supabase = createMockSupabase(mockRole);
-   if (mockRole) { user = { ... }; }
- } else {
-   supabase = createServerClient(...);
-   ...
- }
```
Replace the entire `if (isMockMode())` block with just the `else` block content. Remove mock import.

### [`.env`](.env)
```diff
- # Mock/Placeholder Supabase Credentials
- NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
- NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy"
- SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_service"

+ NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
+ NEXT_PUBLIC_SUPABASE_ANON_KEY="your-real-anon-key"
+ SUPABASE_SERVICE_ROLE_KEY="your-real-service-role-key"
```

---

## 📦 Phase 1–3: Foundation, Auth & Landing Page

> These phases are already implemented with real Supabase code. The only blocker is the live project credentials above. No additional mock code changes needed in these pages.

### Database Migrations to Run
Run in this exact order against your Supabase project:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_lessons_and_activities.sql`
3. `supabase/migrations/003_auth_trigger_and_rls.sql`
4. `supabase/migrations/004_seed_data.sql`
5. `supabase/migrations/005_storage_setup.sql`

### Auth Callback
- [`src/app/auth/callback/route.ts`](src/app/auth/callback/route.ts) — Already uses real Supabase server client. No mock code here.

### Supabase Auth
- Enable **Email/Password** provider in Supabase Dashboard > Authentication > Providers.
- Enable **Google OAuth** provider and add `http://localhost:3000/auth/callback` to Supabase Redirect URLs.

---

## 📦 Phase 4: Parent Role & Dashboard

> **Status**: ✅ Implemented with mock data

### What was built
- Parent login now correctly redirects to `/parent/dashboard`
- `/parent/*` routes are now protected in middleware (parents only)
- Parent dashboard shows two linked mock children with XP, streak, and points
- Attendance history page shows per-child attendance records (6 for child 1, 4 for child 2)
- Reports page shows per-child lesson progress and quiz attempt scores

### Mock data used (in `mockClient.ts`)

| Mock ID | Name | Role |
|---|---|---|
| `mock-parent-id` | Samuel Amir | Parent |
| `mock-student-id` | Jonathan Junior | Student (Child 1) |
| `mock-student2-id` | Mary Grace | Student (Child 2) |

**`parent_children` links:**
```ts
{ parent_id: 'mock-parent-id', student_id: 'mock-student-id'  }
{ parent_id: 'mock-parent-id', student_id: 'mock-student2-id' }
```

**`attendance` records:** 6 records for Child 1, 4 records for Child 2 — all filtered by `user_id`.

**`lesson_progress` records:** 3 lessons for Child 1 (100%/60%/0%), 2 for Child 2 (100%/30%).

**`quiz_attempts` records:** 2 attempts for Child 1 (90% pass, 50% fail), 1 for Child 2 (75% pass) — filtered by `student_id`.

### When connecting to real database
- The `.from('parent_children').select('student_id').eq('parent_id', ...)` query is **already written with real Supabase syntax** in `parent/dashboard/page.tsx`. It will work automatically.
- Same for attendance, lesson_progress, and quiz_attempts pages — they all use correct `.from().select().eq()` chain.
- **Action Required**: Seed the `parent_children` table to link a real parent account to real student accounts.
- **Action Required**: Seed `attendance`, `lesson_progress`, and `quiz_attempts` records for test students.


---

## 📦 Phase 5: QR Attendance System

> **Status**: ✅ Implemented with mock data

### What was built
- **Student QR Code page** (`/student/qr-code`) — generates a QR code encoding the student's `profile.id`. Shows name, ID copy button, and attendance tips.
- **QR Scanner component** (`src/components/ui/QRScanner.tsx`) — uses `html5-qrcode` for live camera scanning. Shows color-coded feedback (success / duplicate / error).
- **Instructor Attendance page** — now has two tabs: Roster (manual) and QR Check-in Scanner with a live check-in log.
- **Attendance Scan API** (`/api/attendance/scan`) — validates QR, prevents duplicate daily check-ins, returns XP award and streak update.

### Mock items used (in `/api/attendance/scan/route.ts`)

| Mock Item | Location | Real DB Replacement |
|---|---|---|
| `checkedInToday` Map | In-memory per process | `SELECT id FROM attendance WHERE user_id=? AND date=today` |
| `MOCK_STUDENTS` object | Hardcoded in API route | `SELECT * FROM user_profiles WHERE id=? AND role='student'` |
| XP insert (`+50 XP`) | Returns static value | `UPDATE user_profiles SET total_xp = total_xp + 50 WHERE id=?` |
| Streak increment | Returns `streak + 1` | `UPDATE user_profiles SET current_streak = current_streak + 1 WHERE id=?` |
| Attendance insert | No real DB write | `INSERT INTO attendance (user_id, date, status) VALUES (?, today, 'present')` |

### Student QR mock item
- **QR value encoded**: `profile.id` from `useUser()` hook — currently `mock-student-id` or `mock-student2-id`.
- **Real DB**: No change needed — `profile.id` will be the real Supabase UUID automatically.

### When connecting to real database
1. Delete the `MOCK_STUDENTS` dict from `route.ts` — replace with `supabase.from('user_profiles').select().eq('id', studentId).single()`
2. Replace `checkedInToday` Map with a Supabase query for duplicate check
3. Replace the static XP/streak return with Supabase `update` calls or a Supabase RPC function
4. Replace the "no-op" insert comment with `.from('attendance').insert({ user_id: studentId, date: today, status: 'present' })`


---

## 📦 Phase 6: Events Management

> **Status**: ✅ Implemented with mock data

### What was built
- **Events List page** (`/student/events`, `/instructor/events`, `/parent/events`) — filterable by event type, searchable, shows RSVP status, capacity bar, and Register/Cancel button
- **Admin Events page** (`/admin/events`) — full CRUD with create/edit modal, delete confirmation, stats summary, and capacity table
- **RSVP API** (`/api/events/rsvp`) — POST to toggle registration, GET to fetch registrations per user or event
- **Events added to all role sidebars** (student, parent, instructor, admin)

### Mock items used

| Mock Item | Location | Real DB Replacement |
|---|---|---|
| `MOCK_EVENTS` array | `mockClient.ts` | `supabase.from('events').select('*').order('date')` |
| `MOCK_EVENT_REGISTRATIONS` array | `mockClient.ts` | `supabase.from('event_registrations').select('*').eq('user_id', userId)` |
| `mockRsvps` in-memory Map | `/api/events/rsvp/route.ts` | `supabase.from('event_registrations').insert/delete(...)` |
| Local state for CRUD | `admin/events/page.tsx` | `supabase.from('events').insert/update/delete(...)` with server actions or API routes |
| `current_rsvp` counter | Static number in mock | Use SQL `COUNT(*)` from `event_registrations` grouped by `event_id` |

### When connecting to real database
1. Delete `MOCK_EVENTS` and `MOCK_EVENT_REGISTRATIONS` from `mockClient.ts` (and their `case` entries in `getTableData`)
2. In `student/events/page.tsx`: replace `MOCK_EVENTS` import with a server-side Supabase fetch via `useEffect`
3. In `admin/events/page.tsx`: replace `useState(MOCK_EVENTS)` with a real Supabase query and replace `handleSave/handleDelete` to call Supabase directly
4. Replace the `mockRsvps` Map in `rsvp/route.ts` with real Supabase insert/delete calls
5. Replace the `GET /api/events/rsvp?userId=...` with a Supabase query on `event_registrations`


---

## 📦 Phase 7: Lesson & Homework Enhancements
> *(To be filled in when Phase 7 is implemented)*

### Planned Mock Items
- **Lesson List**: Mock `lessons` table data. Real DB: `.from('lessons').select(*)`.
- **Lesson Attachments**: File uploads will be disabled/simulated in mock mode. Real DB: Use `supabase.storage.from('lesson-attachments').upload(...)`.
- **Homework Submissions**: File submit button will be UI-only in mock. Real DB: Upload to `task-submissions` bucket and insert record into `task_submissions` table.

---

## 📦 Phase 8: Push Notifications (Firebase)
> *(To be filled in when Phase 8 is implemented)*

### Planned Mock Items
- **Notification Bell**: Will use mock notifications array from `mockClient.ts`. Real DB: Query `.from('notifications').select(*)` and subscribe via Supabase Realtime.
- **Realtime Subscription**: Mock will have no live updates. Real DB: `supabase.channel('notifications').on('postgres_changes', ...).subscribe()`.
- **Firebase FCM**: Will require real Firebase credentials (`NEXT_PUBLIC_FIREBASE_*` env vars). Add to `.env` when ready.
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY="..."
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
  NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
  NEXT_PUBLIC_FIREBASE_APP_ID="..."
  ```

---

## 📦 Phase 9: Admin Analytics Dashboard
> *(To be filled in when Phase 9 is implemented)*

### Planned Mock Items
- **Attendance Trend Chart**: Mock data array with weekly attendance counts. Real DB: Custom Supabase RPC or aggregate query on `attendance` table.
- **Class Distribution Chart**: Mock class enrollment data. Real DB: Join `class_members` with `classes`.
- **XP/Level Stats**: Mock student XP distribution. Real DB: Aggregate query on `user_profiles.total_xp`.

---

## 📦 Phase 10: Dark Mode & Polish
> *(No database items — this phase is UI-only)*

No mock-to-database migration needed for Phase 10.

---

## ✅ Migration Checklist Summary

When you are ready to connect to a real Supabase project, do the following in order:

- [ ] Set real Supabase credentials in `.env`
- [ ] Run all 5 migrations in `supabase/migrations/` in order
- [ ] Enable Email/Password and Google OAuth in Supabase Dashboard
- [ ] Verify auth trigger creates `user_profiles` on signup
- [ ] Seed initial test data (branches, classes, users, parent-child links)
- [ ] Delete `src/lib/supabase/mockClient.ts`
- [ ] Remove mock mode checks in `client.ts`, `server.ts`, `admin.ts`, and `middleware.ts`
- [ ] Remove placeholder `.env` values
- [ ] Test each role login (admin, instructor, parent, student)
- [ ] Verify QR attendance scan inserts into real `attendance` table
- [ ] Verify RSVP endpoint inserts into real `event_registrations` table
- [ ] Verify file uploads save to Supabase Storage buckets
- [ ] Verify Realtime notifications work via Supabase channel subscriptions
- [ ] Verify Firebase FCM push notifications are received on device
