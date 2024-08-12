FROM node:22-bullseye-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update -qq \
 && apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config ca-certificates

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
FROM base AS prod
WORKDIR /app

ENV NODE_ENV="production"

RUN addgroup --system --gid 1001 app && adduser app --system --uid 1001 --ingroup app

COPY --from=build --chown=app:app /app ./

# Start the server by default, this can be overwritten at runtime
USER 1001
EXPOSE 3000
CMD [ "node", "api/dist/index.js" ]
