# Copied from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# (slightly adjusted)

# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile


# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable NextJS Telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Pass API base URL argument as ENV to build
ARG NEXT_PUBLIC_API_BASE_URL=https://api.provideq.kit.edu
ENV NEXT_PUBLIC_API_BASE_URL ${NEXT_PUBLIC_API_BASE_URL}

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable NextJS Telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Choose dokku's default port
# https://dokku.com/docs/networking/port-management/
EXPOSE 5000
ENV PORT 5000

CMD ["node", "server.js"]