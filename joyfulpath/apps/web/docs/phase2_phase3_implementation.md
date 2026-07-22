Phase 2 & 3 Implementation Checklist

Overview
- Phase 2: Engagement & Community
- Phase 3: Interactive Learning & Games

Completed items (scaffolded):
- Updated Prisma schema with PrayerRequest, Reward, Redemption, Achievement, Challenge, Notification, GameSession, GameProgress, ReadingPlanProgress.
- Basic API endpoints for Prayer and Rewards (create/list/respond/approve/reject/fulfill/export CSV).
- Redis-based event bus (`src/lib/eventBus.ts`) and notification router with delivery adapters (in-app, push stub, email stub).
- Admin redemption UI skeleton and Reward store components (`src/features/rewards/*`).
- Game session store (Redis-backed) and APIs for start/action/save/end/state.
- Achievement evaluator and analytics collector stubs.

Remaining / Next steps (recommended):
1. Reward Workflow
   - Add inventory reservation on redemption request (to prevent race conditions).
   - Integrate fulfillment provider or admin CSV export/process for shipping.
   - Add audit logs and receipts for physical reward shipments.
2. Achievement Engine
   - Implement criteria language and evaluator for common criteria (count, streak, score, manual).
   - Add incremental progress tracking and notifications on unlock.
3. Notifications
   - Wire real push (FCM/APNs) and email provider (SendGrid/SES) with templates and localization.
   - Add retry policy, DLQ, and metrics.
4. Games
   - Implement per-game logic: quiz orchestration, timers, scoring rules, anti-cheat.
   - Add game UI pages (Quiz, Verse Builder, Memory Match) with client-side state and server reconciliation.
   - Add leaderboards and match-making if needed.
5. Testing
   - Unit tests for rule engine, XP calculations, reward approval logic.
   - Integration tests for API endpoints with a test DB.
   - E2E tests (Playwright) for user flows: redeem reward, submit prayer, play a quiz.
6. Analytics
   - Stream events to an analytics store (e.g., BigQuery) or use a metrics DB.
   - Build admin dashboards and retention funnels.
7. Ops
   - Add Redis in CI/dev docker-compose; ensure migrations and seed data run in CI.
   - Add monitoring for event consumers and notification delivery.

Local run notes
- Requires: Postgres (`DATABASE_URL`) and Redis (`REDIS_URL`).
- Run database migration after updating schema:

```bash
npx prisma migrate dev --name phase2_phase3
```

- Start dev server:

```bash
npm install
npm run dev
```

Contact
- Ask if you want me to implement any of the "Next steps" now (e.g., full achievement evaluator, game UI, or test suite).