# JoyfulPath Deployment Guide

This document outlines the steps required to deploy the JoyfulPath platform to production.

## 1. Requirements
- Node.js v20+
- PostgreSQL v14+
- Redis (Optional, for caching if implemented)
- Supabase (for File Storage only)

## 2. Database Setup
Ensure PostgreSQL is running.
Create a production database:
```sql
CREATE DATABASE joyfulpath;
```

## 3. Environment Variables
Create a `.env` file in the root based on `.env.example`:
```env
# Postgres Database Config
DATABASE_URL=postgresql://user:password@localhost:5432/joyfulpath?schema=public

# JWT Auth
JWT_SECRET=your_super_secret_jwt_key

# Supabase Storage (for avatars/lessons)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Next.js Config
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 4. Prisma Migration
Apply the database schema to your production database:
```bash
npx prisma generate
npx prisma migrate deploy
```

## 5. Storage Setup
Ensure that your Supabase Storage buckets are created:
- `avatars`
- `lessons`
- `homework`

Set bucket policies to allow public reads if required, and authenticated uploads.

## 6. Backend Deployment
Deploy the NestJS API:
```bash
cd apps/api
npm install
npm run build
npm run start:prod
```

## 7. Frontend Deployment
Deploy the Next.js Web App:
```bash
cd apps/web
npm install
npm run build
npm run start
```
*Note: Next.js can easily be deployed on Vercel by linking the `apps/web` directory.*

## 8. Domain Configuration
- API Domain: `api.yourdomain.com` pointing to the NestJS server.
- Web Domain: `www.yourdomain.com` pointing to the Next.js server.

## 9. CORS
Ensure the NestJS backend allows CORS for your production web domain. Update `apps/api/src/main.ts` if necessary:
```typescript
app.enableCors({ origin: 'https://www.yourdomain.com', credentials: true });
```

## 10. Production Verification
- Run `npm audit` to check for dependency vulnerabilities.
- Ensure all automated tests pass (`npm run test` in `apps/api`).
- Run a manual end-to-end check by registering a student, instructor, and admin.

## 11. Backup Strategy
Set up automated daily `pg_dump` cron jobs for the PostgreSQL database. Store backups securely (e.g. AWS S3).

## 12. Rollback Strategy
If a deployment fails:
1. Revert to the previous Git commit.
2. If database schema was altered, rollback using Prisma down migrations or restore from the latest `pg_dump`.

## 13. Troubleshooting
- **Dynamic Server Usage Error (Next.js):** Ensure cookies/headers are accessed inside server components properly.
- **Prisma Client not found:** Ensure `npx prisma generate` was run before building the API.
- **Unauthorized (401) on API calls:** Check if the JWT secret in `apps/api` matches the one used by `apps/web`.
