# Multi-stage Production & Evaluation Dockerfile for NeuralRoute AMD
# Challenge: Lablab x AMD AI Academy Challenge (2026)

# Stage 1: Install Dependencies
FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build Application & Verify Benchmarks
FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run test suite & evaluation benchmark during container compilation
RUN npm test
RUN npm run evaluate

# Compile production Next.js build
RUN npm run build

# Stage 3: Production & Evaluation Runner
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

LABEL org.opencontainers.image.title="NeuralRoute AMD"
LABEL org.opencontainers.image.description="Smart Agentic Model Router & Token Optimizer on AMD ROCm"
LABEL org.opencontainers.image.vendor="Lablab x AMD AI Academy Challenge"
LABEL maintainer="sahariar_hossain294"

# Copy needed artifacts for production runtime and benchmark evaluation
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/tests ./tests
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

# Default entrypoint starts the live web server & REST API
CMD ["npm", "start"]
