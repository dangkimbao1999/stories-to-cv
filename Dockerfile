# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.12.4 --activate

FROM base AS dev
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json biome.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/ai/package.json packages/ai/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/security/package.json packages/security/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY tests/e2e/package.json tests/e2e/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS source
COPY . .

FROM source AS build
RUN pnpm build

FROM build AS web
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "--filter", "@stories/web", "start", "--hostname", "0.0.0.0"]

FROM build AS worker
ENV NODE_ENV=production
CMD ["pnpm", "--filter", "@stories/worker", "start"]
