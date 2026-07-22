FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json turbo.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages/ ./packages/
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api-gateway/node_modules ./apps/api-gateway/node_modules
COPY . .
WORKDIR /app/apps/api-gateway
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/node_modules ./apps/api-gateway/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api-gateway/dist ./apps/api-gateway/dist

USER nestjs
EXPOSE 3000
CMD ["node", "apps/api-gateway/dist/main.js"]
