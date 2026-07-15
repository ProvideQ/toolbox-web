# Stage 1: build
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies (uses yarn if yarn.lock exists)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Pass in NEXT_PUBLIC_API_BASE_URL from Docker build args
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

ARG NEXT_PUBLIC_MSS_EDITOR_BASE_URL
ENV NEXT_PUBLIC_MSS_EDITOR_BASE_URL=$NEXT_PUBLIC_MSS_EDITOR_BASE_URL

ARG NEXT_PUBLIC_MSS_API_BASE_URL
ENV NEXT_PUBLIC_MSS_API_BASE_URL=$NEXT_PUBLIC_MSS_API_BASE_URL

# Copy source and build
COPY . .
ENV NODE_ENV=production
RUN yarn build

# Stage 2: serve with node
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD [ "node", "server.js" ]
