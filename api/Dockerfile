# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
FROM oven/bun:latest as base

LABEL fly_launch_runtime="Bun"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates -y build-essential pkg-config python-is-python3

# Bun app lives here
WORKDIR /app
COPY . /app

# Set production environment
ENV NODE_ENV="production"


FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/build /app/build

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "build/index.js" ]
