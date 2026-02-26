# ============================================================
# Stage 1 – deps: install ALL dependencies (needed for build)
# ============================================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ============================================================
# Stage 2 – builder: compile TypeScript → dist/
# We call tsc directly (not `npm run build`) to avoid running
# the env-validation that `npm run typecheck` triggers.
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Compile TS to JS
RUN node_modules/.bin/tsc -p tsconfig.json

# ============================================================
# Stage 3 – runner: lean production image
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5001/api/v1/health || exit 1

CMD ["node", "dist/server.js"]
