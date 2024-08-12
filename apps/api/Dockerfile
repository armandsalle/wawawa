FROM oven/bun
RUN apt-get update -qq \
 && apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config ca-certificates
WORKDIR /app
# Copy project
COPY . .

# To keep the image small ;)
RUN rm -rf /app/apps/web
#  Temp solution for bun
RUN bun install --ignore-scripts
WORKDIR /app/apps/api

# Compile the TypeScript application
ENV NODE_ENV="production"
RUN bun build --compile --sourcemap src/index.ts --outfile=app

EXPOSE 3000
CMD ["./app"]
