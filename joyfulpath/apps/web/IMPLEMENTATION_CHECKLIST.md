# Implementation Checklist - Phases 7-10

## Pre-Implementation

- [ ] Review PHASES_7_10_IMPLEMENTATION.md for detailed documentation
- [ ] Review DEPLOYMENT_GUIDE.md for setup instructions
- [ ] Ensure Node.js 18+ installed (`node --version`)
- [ ] Ensure npm/yarn available
- [ ] Git repository configured

---

## Phase 1: Database Setup

### Supabase Migrations

- [ ] Log into Supabase dashboard
- [ ] Create `notifications` table with schema from DEPLOYMENT_GUIDE.md
- [ ] Create `fcm_tokens` table with schema from DEPLOYMENT_GUIDE.md
- [ ] Create indexes on `user_id` and `is_active` columns
- [ ] Enable Row Level Security (RLS) on both tables
- [ ] Create RLS policies for user isolation
- [ ] Test table creation: `SELECT COUNT(*) FROM notifications;`
- [ ] Verify Supabase storage buckets exist: `lessons`, `homework`, `profiles`

### Local Testing

- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Initialize local Supabase: `supabase init`
- [ ] Start local Supabase: `supabase start`
- [ ] Run migrations against local DB
- [ ] Verify tables created: `psql postgresql://... -c "\dt"`

---

## Phase 2: Firebase Setup

### Firebase Console

- [ ] Create Firebase project (or use existing)
- [ ] Enable Cloud Messaging
- [ ] Generate Web credentials
- [ ] Copy API key, Auth domain, Project ID, etc.
- [ ] Generate VAPID key (Cloud Messaging → Web configuration)
- [ ] Enable Realtime Database (optional for advanced features)

### Local Environment

- [ ] Create `.env.local` file in project root
- [ ] Add Firebase credentials:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
  ```
- [ ] Verify variables are not committed to git (check .gitignore)

---

## Phase 3: Code Integration

### Install Dependencies

- [ ] Run `npm install` (verify no errors)
- [ ] Verify `recharts` in node_modules: `ls node_modules | grep recharts`
- [ ] Verify `firebase` in node_modules: `ls node_modules | grep firebase`
- [ ] Check package.json for all required dependencies

### File Verification

- [ ] Verify all new API files created:
  - [ ] `src/app/api/lessons/route.ts`
  - [ ] `src/app/api/lessons/[id]/route.ts`
  - [ ] `src/app/api/lessons/[id]/upload/route.ts`
  - [ ] `src/app/api/homework/route.ts`
  - [ ] `src/app/api/homework/[id]/route.ts`
  - [ ] `src/app/api/notifications/route.ts`
  - [ ] `src/app/api/notifications/[id]/route.ts`
  - [ ] `src/app/api/analytics/route.ts`

- [ ] Verify all new components created:
  - [ ] `src/components/features/lessons/LessonForm.tsx`
  - [ ] `src/components/features/lessons/LessonCard.tsx`
  - [ ] `src/components/features/analytics/AdminAnalyticsDashboard.tsx`
  - [ ] `src/components/ui/EmptyState.tsx`
  - [ ] `src/components/ui/LoadingSpinner.tsx`

- [ ] Verify utility files created:
  - [ ] `src/lib/supabase/storage.ts`
  - [ ] `src/lib/firebase/token-manager.ts`

### Lint & Type Check

- [ ] Run `npm run lint` (fix any errors)
- [ ] Check TypeScript: `npx tsc --noEmit`
- [ ] Verify no type errors in console

---

## Phase 4: Local Development

### Start Dev Server

- [ ] Clear `.next` cache: `rm -rf .next`
- [ ] Start server: `npm run dev`
- [ ] Verify on http://localhost:3000
- [ ] Check server logs for errors
- [ ] Open browser DevTools → Console (no red errors)

### Test Lesson APIs

- [ ] [ ] Create lesson via API (curl or Postman)
- [ ] [ ] Upload lesson attachment
- [ ] [ ] List lessons with filters
- [ ] [ ] Update lesson details
- [ ] [ ] Delete lesson

### Test Homework APIs

- [ ] [ ] Submit homework as student
- [ ] [ ] List submissions as instructor
- [ ] [ ] Grade submission
- [ ] [ ] Verify XP awarded to student

### Test Notification APIs

- [ ] [ ] Create notification via API
- [ ] [ ] Fetch user notifications
- [ ] [ ] Mark notification as read
- [ ] [ ] Delete notification

### Test Analytics API

- [ ] [ ] Fetch analytics for class
- [ ] [ ] Apply date range filter
- [ ] [ ] Verify all chart data loads
- [ ] [ ] Check performance (should be < 2 seconds)

### Test UI Components

- [ ] [ ] NotificationBell renders
- [ ] [ ] Can toggle dark mode
- [ ] [ ] LoadingSpinner displays correctly
- [ ] [ ] EmptyState shows proper message
- [ ] [ ] LessonForm works end-to-end
- [ ] [ ] AdminAnalyticsDashboard loads charts

---

## Phase 5: Integration Testing

### User Workflows

**Instructor Lesson Creation:**
- [ ] Log in as instructor
- [ ] Navigate to Lessons page
- [ ] Click Create Lesson
- [ ] Fill in lesson form
- [ ] Upload PDF/video
- [ ] Save lesson
- [ ] Verify lesson appears in list
- [ ] Edit and republish
- [ ] Delete lesson

**Student Homework Submission:**
- [ ] Log in as student
- [ ] View assigned task
- [ ] Submit homework with file
- [ ] View submission status
- [ ] See instructor feedback after grading

**Admin Analytics:**
- [ ] Log in as admin
- [ ] Navigate to Analytics
- [ ] Select class and date range
- [ ] Verify all charts load
- [ ] See top students list
- [ ] Check lesson completion rates

**Notifications:**
- [ ] Send notification as admin
- [ ] Receive in real-time
- [ ] Mark as read
- [ ] Delete notification
- [ ] Test dark mode (notification bell)

---

## Phase 6: Mobile Testing

- [ ] [ ] Test on iPhone Safari
- [ ] [ ] Test on Android Chrome
- [ ] [ ] Test responsive breakpoints
- [ ] [ ] Verify touch interactions work
- [ ] [ ] Check notification bell on mobile
- [ ] [ ] Test file upload on mobile
- [ ] [ ] Verify forms are usable on mobile

---

## Phase 7: Accessibility Testing

- [ ] [ ] Test keyboard navigation
- [ ] [ ] Check ARIA labels with screen reader
- [ ] [ ] Verify color contrast ratios
- [ ] [ ] Test with browser zoom (200%)
- [ ] [ ] Verify no `console.log` accessibility errors
- [ ] [ ] Check focus visible styles

---

## Phase 8: Performance Testing

- [ ] [ ] Run Lighthouse audit (target > 90)
- [ ] [ ] Check API response times (< 200ms)
- [ ] [ ] Load analytics with large datasets
- [ ] [ ] Test with slow network (DevTools throttle)
- [ ] [ ] Verify images lazy load
- [ ] [ ] Check bundle size: `npm run build`

---

## Phase 9: Security Review

- [ ] [ ] Verify auth middleware on all endpoints
- [ ] [ ] Check role-based access control
- [ ] [ ] Test file upload validation
- [ ] [ ] Verify SQL injection prevention (Prisma)
- [ ] [ ] Check RLS policies on DB tables
- [ ] [ ] Verify no sensitive data in console logs
- [ ] [ ] Review error messages (don't leak info)
- [ ] [ ] Check CORS configuration

---

## Phase 10: Browser Support Testing

- [ ] [ ] Chrome (latest)
- [ ] [ ] Firefox (latest)
- [ ] [ ] Safari (latest)
- [ ] [ ] Edge (latest)
- [ ] [ ] Mobile Safari
- [ ] [ ] Mobile Chrome

---

## Phase 11: Documentation Review

- [ ] [ ] Read PHASES_7_10_IMPLEMENTATION.md
- [ ] [ ] Read DEPLOYMENT_GUIDE.md
- [ ] [ ] Review API endpoint documentation
- [ ] [ ] Check component JSDoc comments
- [ ] [ ] Verify all ENV vars documented
- [ ] [ ] Update project README

---

## Phase 12: Pre-Production

### Code Quality

- [ ] [ ] Remove console.log debug statements
- [ ] [ ] Remove commented-out code
- [ ] [ ] Run linter: `npm run lint`
- [ ] [ ] Format code: `npx prettier --write .`
- [ ] [ ] Update version in package.json

### Build & Deploy

- [ ] [ ] Build production: `npm run build`
- [ ] [ ] Fix any build errors
- [ ] [ ] Test production build locally: `npm run start`
- [ ] [ ] Deploy to staging environment
- [ ] [ ] Verify all features work on staging
- [ ] [ ] Get stakeholder approval

### Monitoring Setup

- [ ] [ ] Configure error tracking (Sentry)
- [ ] [ ] Set up log aggregation
- [ ] [ ] Configure uptime monitoring
- [ ] [ ] Set up performance monitoring
- [ ] [ ] Create alerting rules

---

## Phase 13: Production Deployment

### Pre-Flight

- [ ] [ ] All tasks above ✅ complete
- [ ] [ ] Backup database
- [ ] [ ] Create git tag: `git tag -a v7-10-release`
- [ ] [ ] Push to main branch
- [ ] [ ] Notify team of deployment

### Deploy

- [ ] [ ] Deploy to production (Vercel / Node.js Host)

- [ ] [ ] Verify health checks passing
- [ ] [ ] Monitor error rate (< 0.1%)
- [ ] [ ] Monitor API response times
- [ ] [ ] Test critical paths end-to-end

### Post-Deployment

- [ ] [ ] Send deployment notification
- [ ] [ ] Update status page
- [ ] [ ] Monitor first hour closely
- [ ] [ ] Review logs for errors
- [ ] [ ] Get user feedback
- [ ] [ ] Document any issues
- [ ] [ ] Plan hotfixes if needed

---

## Phase 14: Post-Launch

### Week 1 Monitoring

- [ ] [ ] Review error logs daily
- [ ] [ ] Monitor performance metrics
- [ ] [ ] Check user engagement metrics
- [ ] [ ] Respond to user feedback
- [ ] [ ] Deploy any critical hotfixes

### Week 2-4 Optimization

- [ ] [ ] Analyze usage patterns
- [ ] [ ] Optimize slow endpoints
- [ ] [ ] Add caching where needed
- [ ] [ ] Plan Phase 11 features
- [ ] [ ] Gather user feedback
- [ ] [ ] Create improvement backlog

---

## Rollback Plan

If critical issues found:

1. [ ] Identify issue
2. [ ] Stop deployments
3. [ ] Communicate with users
4. [ ] Revert to previous version: `git revert <commit>`
5. [ ] Deploy previous version
6. [ ] Fix issue on separate branch
7. [ ] Test thoroughly before re-deploying

---

## Success Criteria

**All of these must be ✅ complete:**

- [ ] All 8 API endpoints working
- [ ] All 5+ UI components rendering
- [ ] Database migrations applied
- [ ] Firebase configured
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Lighthouse score > 90
- [ ] Security review passed
- [ ] Performance targets met
- [ ] Mobile responsive
- [ ] Accessible (WCAG AA)
- [ ] Cross-browser compatible
- [ ] Documentation complete
- [ ] Team trained
- [ ] Users ready to test

---

## Support Contacts

- **Firebase Issues**: firebase-support@google.com
- **Supabase Issues**: https://supabase.com/support
- **Next.js Issues**: GitHub discussions or Discord
- **Your Team**: [Add team contacts]

---

## Sign-Off

- [ ] Developer: _________________ Date: _______
- [ ] QA Lead: _________________ Date: _______
- [ ] Product Owner: _________________ Date: _______
- [ ] DevOps: _________________ Date: _______

---

**Last Updated:** July 8, 2026  
**Version:** 1.0  
**Status:** Ready to Use  

✅ **All checkboxes completed = GO for production!**
