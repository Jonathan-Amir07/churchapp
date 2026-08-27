# JoyfulPath Specification & Gap Analysis

## 1. Current Architecture
- **Monorepo Structure**: Turborepo manages a monorepo (`joyfulpath-monorepo`) containing:
  - `apps/web`: Next.js frontend (Turbopack, Tailwind CSS v4, React 19).
  - `apps/api`: NestJS backend.
  - `apps/api-gateway`: NestJS API Gateway.
  - `apps/mobile`: Mobile app (structure inferred, possibly React Native/Expo based on grep results).
  - `packages/*`: Shared config, database schema (Prisma), types, UI components, etc.

## 2. Current Stack
- **Frontend**: Next.js (App Router), React 19, Tailwind CSS v4, Zustand, React Query, Supabase SSR, Next Auth (v5 beta).
- **Backend**: NestJS, PostgreSQL (via Prisma), Redis (via ioredis), JWT auth.
- **Database**: PostgreSQL with extensive Prisma models (Users, Families, Classes, Lessons, Progress, Gamification etc.).

## 3. Existing Features
- **Working (Potentially)**:
  - Database schema covers comprehensive domains: Users, Attendance, Gamification (Points, Xp, Leaderboard), Classes, Tasks, Quizzes, Store.
  - Basic Next.js scaffolding.
  - NestJS applications structure.
  
- **Incomplete / Placeholder Features**:
  - Auth mechanisms are using mock setups (`proxy.ts` uses `isMockMode()`, login screens have dummy placeholders).
  - Dashboard screens (Instructor, Student, etc.) contain heavy mock implementations.
  - Data uploaders mock upload delays.
  - Gamification/Leaderboard has mock analytics/endpoints.
  - Quiz building/grading flow uses mock redirects and placeholder inputs.

## 4. Missing Features
- Proper end-to-end integration with the backend for many screens (lots of dummy placeholders).
- Authentication is heavily mocked and needs real implementation across Web/Mobile.
- True API implementation for various resources (tasks, quizzes, gamification).

## 5. Critical Bugs
- Build processes are still being evaluated, but significant reliance on `mockClient` indicates broken/unavailable dependencies on real backend services.
- Prisma exports and types show warnings with Turbopack due to `export *` usage in CommonJS modules.

## 6. Security Problems
- Mock authentication allows arbitrary role assignment via cookies.
- Lack of actual authorization checks on mocked data endpoints.

## 7. Database Problems
- Currently the schema is extensive, but its integration with actual application logic (Prisma Client queries) seems partially implemented.

## 8. Deployment Problems
- Current reliance on `isMockMode` could accidentally leak into production if not tightly controlled via environments.

## 9. Recommended Implementation Order
1. **Infrastructure & DevOps**: Solidify environment configurations and CI/CD pipelines. Resolve Turbopack build warnings.
2. **Database & Auth**: Connect frontend and backend to the real PostgreSQL database. Implement real NextAuth/Supabase authentication and remove `mockClient`.
3. **Core API**: Implement actual NestJS endpoints to replace mock data for Users, Classes, and Lessons.
4. **Web Dashboards**: Wire Next.js dashboards to the real APIs.
5. **Gamification & Store**: Integrate XP, Points, and Leaderboards.
6. **Mobile App**: Implement API integration for the mobile screens.
