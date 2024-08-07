FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates

WORKDIR /app
COPY api/ api/
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .

#========================
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

#====================
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .

LABEL fly_launch_runtime="Bun"
FROM oven/bun:latest
WORKDIR /app

ENV NODE_ENV="production"
COPY --from=build /app ./

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "api/src/index.ts" ]
