# syntax=docker/dockerfile:1

# ---- Base: Node 24 + pnpm via corepack -------------------------------------
FROM node:24-alpine AS base
# libc6-compat: some prebuilt native deps expect glibc symbols on Alpine.
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /app

# ---- Dependencies (cached unless the lockfile changes) ---------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Build -----------------------------------------------------------------
FROM base AS builder
# NEXT_PUBLIC_* vars are inlined at build time, so they must be present now
# (canonical URLs, OpenGraph, sitemap, AdSense). Pass them as Coolify build args.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ADSENSE_CLIENT
ARG NEXT_PUBLIC_ADSENSE_SLOT_HOME
ARG NEXT_PUBLIC_ADSENSE_SLOT_RESULT
ARG NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE
ARG NEXT_PUBLIC_ADSENSE_SLOT_BRAND
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ADSENSE_CLIENT=$NEXT_PUBLIC_ADSENSE_CLIENT \
    NEXT_PUBLIC_ADSENSE_SLOT_HOME=$NEXT_PUBLIC_ADSENSE_SLOT_HOME \
    NEXT_PUBLIC_ADSENSE_SLOT_RESULT=$NEXT_PUBLIC_ADSENSE_SLOT_RESULT \
    NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=$NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE \
    NEXT_PUBLIC_ADSENSE_SLOT_BRAND=$NEXT_PUBLIC_ADSENSE_SLOT_BRAND \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- Runner (minimal standalone image) -------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# Run as an unprivileged user.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone output already contains a pruned node_modules + server.js.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
