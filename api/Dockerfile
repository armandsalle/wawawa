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

#====================
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN cd api && pnpm run build
COPY . .

LABEL fly_launch_runtime="Node"
FROM node:20-slim AS base
WORKDIR /app

ENV NODE_ENV="production"
COPY --from=build /app ./

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "api/dist/index.js" ]
